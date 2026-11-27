document.addEventListener("DOMContentLoaded", () => {

    /* ================= MOVIE DATA ================= */
    const movies = [
        {
            title: "Toxic: A Fairy Tale for Grown-Ups",
            genre: "Action • Thriller",
            duration: "3h 49m",
            rating: "⭐ TBD",
            poster: "https://img.studioflicks.com/wp-content/uploads/2026/01/08192338/fJBAfLiNfovSAb6KjkIndpF3Sm7.jpg"
        },
        {
            title: "Hanuman-Ansh",
            genre: "Spiritual • Drama",
            duration: "2h 20m",
            rating: "⭐ TBD",
            poster: "https://panasiabiz.com/wp-content/uploads/2026/02/hanuman-movie.webp"
        },
        {
            title: "Mirzapur: The Movie",
            genre: "Action • Crime • Drama",
            duration: "3h 17m",
            rating: "⭐ TBD",
            poster: "https://images.plex.tv/photo?size=large-720&scale=2&url=https:%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2F7CFdq8M9ZuP1QRLaBG2ExdcrCBs.jpg"
        },
        {
            title: "War 2",
            genre: "Action • Thriller",
            duration: "2h 53m",
            rating: "⭐ TBD",
            poster: "https://www.rogerebert.com/wp-content/uploads/2025/08/2Yc8Kl2ldPpDzLrG2M5Ddv62FXB-jpg.webp"
        }
    ];

    const upcomingMovies = [
        {
            title: "Haiwaan",
            genre: "Hindi • Action • Thriller",
            poster: "https://m.media-amazon.com/images/M/MV5BMDI3MDI3NmUtNjAwZS00OWU5LWI4ODEtMzMxMTI2OGRhZjQ5XkEyXkFqcGc@._V1_.jpg"
        },
        {
            title: "Fall 2: Deadpoint",
            genre: "English • Thriller",
            poster: "https://image.tmdb.org/t/p/original/252nvxg7orVQIX4O76uPCqq4qem.jpg"
        },
        {
            title: "The Paradise",
            genre: "Hindi • Drama • Action",
            poster: "https://images.filmibeat.com/ph-big/2025/08/the-paradise1754637135_0.jpg"
        },
        {
            title: "Vibe",
            genre: "Hindi • Drama • Romance",
            poster: "https://www.bollywoodhungama.com/wp-content/uploads/2026/05/Vibe-01.jpeg"
        }
    ];

    /* ============== DYNAMIC CARD RENDERING ============== */
    function renderMovies(movieList, containerId, isUpcoming = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = movieList.map(movie => `
            <article class="movie-card">
                <div class="poster">
                    <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
                    <span class="rating">${isUpcoming ? "🎟️ PRE BOOK" : movie.rating}</span>
                </div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.genre}</p>
                    <div class="movie-bottom">
                        <span>${isUpcoming ? "Coming Soon" : movie.duration}</span>
                        <button class="${isUpcoming ? "prebook-btn" : "book-btn"}" type="button">
                            ${isUpcoming ? "Pre Book" : "Book Now"}
                        </button>
                    </div>
                </div>
            </article>
        `).join("");
    }

    renderMovies(movies, "latestMoviesGrid");
    renderMovies(upcomingMovies, "preBookingGrid", true);

    /* ================= HAMBURGER MENU ================= */
    const navbar = document.querySelector(".navbar");
    const nav = navbar?.querySelector("nav");

    if (navbar && nav) {
        const menuButton = document.createElement("button");
        menuButton.type = "button";
        menuButton.className = "menu-toggle";
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-label", "Open navigation menu");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-controls", "main-navigation");
        nav.id = "main-navigation";
        navbar.insertBefore(menuButton, nav);

        function closeMenu() {
            nav.classList.remove("active");
            menuButton.textContent = "☰";
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
        }

        menuButton.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("active");
            menuButton.textContent = isOpen ? "✕" : "☰";
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 700) closeMenu();
        });
    }

    /* ================= MOVIE SEARCH ================= */
    const searchInput = document.getElementById("movieSearch");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const searchText = searchInput.value.toLowerCase().trim();
            document.querySelectorAll("#latestMoviesGrid .movie-card, #preBookingGrid .movie-card")
                .forEach(card => {
                    card.hidden = !card.textContent.toLowerCase().includes(searchText);
                });
        });
    }

    /* ================= LOGIN / SIGNUP ================= */
    document.querySelectorAll(".login-btn, .signup-btn").forEach(button => {
        button.addEventListener("click", () => {
            const action = button.classList.contains("login-btn") ? "Login" : "Sign Up";
            alert(`${action} feature is coming soon!`);
        });
    });

    /* ================= BOOKING BUTTONS ================= */
    document.addEventListener("click", event => {
        const button = event.target.closest(".movie-card .book-btn, .movie-card .prebook-btn");
        if (!button) return;
        const movieName = button.closest(".movie-card")?.querySelector("h3")?.textContent || "your selected movie";
        alert(`You selected: ${movieName}\nBooking feature coming soon!`);
    });

    /* ================= FOOTER YEAR ================= */
    const yearElement = document.getElementById("currentYear");
    if (yearElement) yearElement.textContent = new Date().getFullYear();
});
