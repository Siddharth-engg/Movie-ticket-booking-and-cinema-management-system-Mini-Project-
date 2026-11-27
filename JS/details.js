document.addEventListener("DOMContentLoaded", () => {
    const movies = window.CINEVIA_MOVIES || [];
    const requestedId = new URLSearchParams(window.location.search).get("movie") || "toxic";
    const movie = movies.find((item) => item.id === requestedId) || movies.find((item) => item.id === "toxic");

    if (!movie) {
        window.location.replace("listing.html");
        return;
    }

    document.title = `${movie.title} - Cinevia`;
    document.getElementById("moviePoster").src = movie.poster;
    document.getElementById("moviePoster").alt = `${movie.title} poster`;
    document.getElementById("movieTitle").textContent = movie.title;
    document.getElementById("movieTagline").textContent = movie.tagline;
    document.getElementById("movieSynopsis").textContent = movie.synopsis;

    const isUpcoming = movie.status === "upcoming";
    document.getElementById("movieStatus").textContent = isUpcoming ? "COMING SOON" : "NOW SHOWING";

    const tags = document.getElementById("movieTags");
    [...movie.genre, movie.language, movie.duration, movie.rating ? `★ ${movie.rating} / 10` : "Coming soon"]
        .forEach((label) => {
            const tag = document.createElement("span");
            tag.className = "tag";
            tag.textContent = label;
            tags.appendChild(tag);
        });

    const castList = document.getElementById("movieCast");
    if (movie.cast && movie.cast.length) {
        movie.cast.forEach((member) => {
            const card = document.createElement("div");
            card.className = "cast-member";
            const image = document.createElement("img");
            image.src = member.image;
            image.alt = member.name;
            const name = document.createElement("div");
            name.className = "cast-name";
            name.textContent = member.name;
            const role = document.createElement("div");
            role.className = "cast-role";
            role.textContent = member.role;
            card.append(image, name, role);
            castList.appendChild(card);
        });
    } else {
        castList.textContent = "Cast information will be announced soon.";
    }

    const showtimeButtons = document.querySelectorAll(".showtime-btn");
    const notice = document.getElementById("showtimeNotice");
    if (isUpcoming) {
        notice.textContent = "Booking is not open yet. Check back when showtimes are announced.";
        showtimeButtons.forEach((button) => {
            button.disabled = true;
            button.setAttribute("aria-label", `${button.textContent.trim()}, booking not open`);
        });
        return;
    }

    notice.textContent = "Select a showtime to continue to seat selection.";
    showtimeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const cinema = button.closest(".cinema-card");
            const date = new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
            const booking = {
                movieId: movie.id,
                movie: movie.title,
                genre: movie.genre.join(" • "),
                poster: movie.poster,
                date,
                time: button.textContent.trim(),
                theater: cinema.querySelector(".cinema-name").textContent.trim(),
                screen: cinema.dataset.screen,
                seats: [],
                ticketPrice: 180,
                convenienceFee: 30
            };

            try {
                sessionStorage.setItem("cineviaBooking", JSON.stringify(booking));
            } catch (error) {
                console.error("Could not save your selected showtime.", error);
                notice.textContent = "Your browser could not save this booking. Please enable site storage and try again.";
                return;
            }

            const params = new URLSearchParams({
                movie: booking.movieId,
                date: booking.date,
                time: booking.time,
                theater: booking.theater,
                screen: booking.screen
            });
            window.location.href = `seat-selection.html?${params.toString()}`;
        });
    });
});
