document.addEventListener("DOMContentLoaded", () => {
    const movies = window.CINEVIA_MOVIES || [];
    const nowShowing = movies.filter((movie) => movie.status === "now-showing");
    const upcoming = movies.filter((movie) => movie.status === "upcoming");

    function createMovieCard(movie, isUpcoming) {
        const card = document.createElement(isUpcoming ? "article" : "a");
        card.className = "movie-card";
        card.dataset.title = movie.title.toLowerCase();
        card.dataset.genre = movie.genre.join(" ").toLowerCase();
        card.dataset.language = movie.language.toLowerCase();
        card.dataset.status = movie.status;

        if (!isUpcoming) {
            card.href = `details.html?movie=${encodeURIComponent(movie.id)}`;
            card.setAttribute("aria-label", `View showtimes for ${movie.title}`);
        }

        const poster = document.createElement("div");
        poster.className = "poster";
        const image = document.createElement("img");
        image.src = movie.poster;
        image.alt = `${movie.title} poster`;
        image.loading = "lazy";
        poster.appendChild(image);

        const badge = document.createElement("span");
        badge.className = "rating";
        badge.textContent = isUpcoming ? "COMING SOON" : `★ ${movie.rating}`;
        poster.appendChild(badge);

        const info = document.createElement("div");
        info.className = "movie-info";
        const title = document.createElement("h3");
        title.textContent = movie.title;
        const metadata = document.createElement("p");
        metadata.textContent = `${movie.genre.join(" • ")} • ${movie.language}`;
        const bottom = document.createElement("div");
        bottom.className = "movie-bottom";

        const duration = document.createElement("span");
        duration.textContent = isUpcoming ? "Coming soon" : movie.duration;
        const action = document.createElement("span");
        action.className = "movie-action";
        action.textContent = isUpcoming ? "Coming Soon" : "View Showtimes";

        bottom.append(duration, action);
        info.append(title, metadata, bottom);
        card.append(poster, info);
        return card;
    }

    function renderMovies(list, containerId, isUpcoming) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.replaceChildren(...list.map((movie) => createMovieCard(movie, isUpcoming)));
    }

    renderMovies(nowShowing, "latestMoviesGrid", false);
    renderMovies(upcoming, "preBookingGrid", true);
    renderMovies(nowShowing, "nowShowingGrid", false);
    renderMovies(upcoming, "upcomingGrid", true);

    const filters = { genre: "all", language: "all" };
    const searchInput = document.getElementById("movieSearch");

    function applyFilters() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        document.querySelectorAll(".movie-card[data-title]").forEach((card) => {
            const matchesSearch = card.dataset.title.includes(query)
                || card.dataset.genre.includes(query)
                || card.dataset.language.includes(query);
            const matchesGenre = filters.genre === "all" || card.dataset.genre.includes(filters.genre);
            const matchesLanguage = filters.language === "all" || card.dataset.language === filters.language;
            card.hidden = !(matchesSearch && matchesGenre && matchesLanguage);
        });
    }

    if (searchInput) searchInput.addEventListener("input", applyFilters);

    document.querySelectorAll("[data-filter-group][data-filter-value]").forEach((button) => {
        button.addEventListener("click", () => {
            const group = button.dataset.filterGroup;
            filters[group] = button.dataset.filterValue.toLowerCase();
            document.querySelectorAll(`[data-filter-group="${group}"]`).forEach((option) => {
                const active = option === button;
                option.classList.toggle("active", active);
                option.setAttribute("aria-pressed", String(active));
            });
            applyFilters();
        });
    });

    const navbar = document.querySelector(".navbar");
    const nav = navbar && navbar.querySelector("nav");
    if (navbar && nav) {
        const menuButton = document.createElement("button");
        menuButton.type = "button";
        menuButton.className = "menu-toggle";
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-label", "Open navigation menu");
        menuButton.setAttribute("aria-expanded", "false");
        nav.id = "main-navigation";
        menuButton.setAttribute("aria-controls", nav.id);
        navbar.insertBefore(menuButton, nav);

        menuButton.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("active");
            menuButton.textContent = isOpen ? "✕" : "☰";
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation menu");
                menuButton.textContent = "☰";
            });
        });
    }

    const year = document.getElementById("currentYear");
    if (year) year.textContent = String(new Date().getFullYear());
});
