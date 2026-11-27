/*
 * Cinevia - Seat Selection
 * Front-end demo data: update the SHOW_DATA object to change the movie,
 * show details, ticket price, seats, or booked seats.
 */

const params = new URLSearchParams(window.location.search);
let savedBooking = null;
try {
    savedBooking = JSON.parse(sessionStorage.getItem("cineviaBooking") || "null");
} catch (error) {
    console.error("Could not read the selected booking.", error);
}

const SHOW_DATA = {
    movie: {
        title: params.get("movie")
            ? (window.CINEVIA_MOVIES || []).find((movie) => movie.id === params.get("movie"))?.title || "Selected movie"
            : savedBooking?.movie || "Selected movie",
        genre: savedBooking?.genre || "Cinema",
        date: params.get("date") || savedBooking?.date || new Date().toLocaleDateString("en-IN"),
        time: params.get("time") || savedBooking?.time || "Showtime not selected",
        theater: params.get("theater") || savedBooking?.theater || "Cinema",
        screen: params.get("screen") || savedBooking?.screen || "Screen 1"
    },
    movieId: params.get("movie") || savedBooking?.movieId || "",
    poster: savedBooking?.poster || "",
    ticketPrice: savedBooking?.ticketPrice || 180,
    convenienceFee: savedBooking?.convenienceFee || 30,
    rows: ["A", "B", "C", "D", "E", "F"],
    seatsPerRow: 8,
    aisleAfterSeat: 4,
    bookedSeats: ["A5", "C2", "D4", "E6"]
};

const selectedSeats = new Set();

const seatLayout = document.getElementById("seatLayout");
const selectedSeatsDisplay = document.getElementById("selectedSeatsDisplay");
const ticketCount = document.getElementById("ticketCount");
const ticketTotal = document.getElementById("ticketTotal");
const grandTotal = document.getElementById("grandTotal");
const continueBtn = document.getElementById("continueBtn");
const bookingMessage = document.createElement("p");
const hasValidShow = Boolean(
    savedBooking
    && params.get("movie")
    && params.get("time")
    && params.get("theater")
    && params.get("screen")
    && savedBooking.movieId === params.get("movie")
    && savedBooking.time === params.get("time")
    && savedBooking.theater === params.get("theater")
);

bookingMessage.className = "booking-message";
bookingMessage.id = "bookingMessage";
continueBtn.insertAdjacentElement("afterend", bookingMessage);

function formatCurrency(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

function populateMovieDetails() {
    document.getElementById("movieTitle").textContent = SHOW_DATA.movie.title;
    document.getElementById("movieGenre").textContent = SHOW_DATA.movie.genre;
    document.getElementById("showDate").textContent = SHOW_DATA.movie.date;
    document.getElementById("showTime").textContent = SHOW_DATA.movie.time;
    document.getElementById("screenName").textContent = SHOW_DATA.movie.screen;

    document.getElementById("summaryMovieTitle").textContent = SHOW_DATA.movie.title;
    document.getElementById("summaryShowDetails").textContent =
        `${SHOW_DATA.movie.date} • ${SHOW_DATA.movie.theater} • ${SHOW_DATA.movie.screen} • ${SHOW_DATA.movie.time}`;

    document.getElementById("convenienceFee").textContent =
        formatCurrency(SHOW_DATA.convenienceFee);
    document.getElementById("ticketPriceLabel").textContent =
        formatCurrency(SHOW_DATA.ticketPrice);
}

function createSeat(row, seatNumber) {
    const seatName = `${row}${seatNumber}`;
    const seat = document.createElement("button");

    seat.type = "button";
    seat.className = "seat";
    seat.dataset.seat = seatName;
    seat.textContent = seatName;
    seat.setAttribute("aria-label", `Seat ${seatName}`);

    if (SHOW_DATA.bookedSeats.includes(seatName)) {
        seat.classList.add("booked");
        seat.disabled = true;
        seat.setAttribute("aria-label", `Seat ${seatName}, booked`);
    } else {
        seat.classList.add("available");
        seat.setAttribute("aria-pressed", "false");
        seat.addEventListener("click", () => toggleSeat(seat));
    }

    return seat;
}

function renderSeats() {
    seatLayout.innerHTML = "";

    SHOW_DATA.rows.forEach((rowName) => {
        const row = document.createElement("div");
        row.className = "seat-row";

        const rowLabel = document.createElement("span");
        rowLabel.className = "row-name";
        rowLabel.textContent = rowName;
        row.appendChild(rowLabel);

        for (let number = 1; number <= SHOW_DATA.seatsPerRow; number++) {
            if (number === SHOW_DATA.aisleAfterSeat + 1) {
                const aisle = document.createElement("span");
                aisle.className = "aisle";
                aisle.setAttribute("aria-hidden", "true");
                row.appendChild(aisle);
            }

            row.appendChild(createSeat(rowName, number));
        }

        seatLayout.appendChild(row);
    });
}

function toggleSeat(seatElement) {
    const seatName = seatElement.dataset.seat;

    if (selectedSeats.has(seatName)) {
        selectedSeats.delete(seatName);
        seatElement.classList.remove("selected");
        seatElement.classList.add("available");
        seatElement.setAttribute("aria-pressed", "false");
    } else {
        selectedSeats.add(seatName);
        seatElement.classList.remove("available");
        seatElement.classList.add("selected");
        seatElement.setAttribute("aria-pressed", "true");
    }

    bookingMessage.textContent = "";
    updateSummary();
}

function updateSummary() {
    const seatList = Array.from(selectedSeats).sort((a, b) => {
        const rowA = a.charAt(0);
        const rowB = b.charAt(0);
        if (rowA !== rowB) return rowA.localeCompare(rowB);
        return Number(a.slice(1)) - Number(b.slice(1));
    });

    selectedSeatsDisplay.innerHTML = "";

    if (seatList.length === 0) {
        const none = document.createElement("span");
        none.className = "empty-selection";
        none.textContent = "None";
        selectedSeatsDisplay.appendChild(none);
    } else {
        seatList.forEach((seatName) => {
            const tag = document.createElement("span");
            tag.textContent = seatName;
            selectedSeatsDisplay.appendChild(tag);
        });
    }

    const count = seatList.length;
    const ticketAmount = count * SHOW_DATA.ticketPrice;
    const totalAmount = count > 0 ? ticketAmount + SHOW_DATA.convenienceFee : 0;

    ticketCount.textContent = count;
    ticketTotal.textContent = formatCurrency(ticketAmount);
    grandTotal.textContent = formatCurrency(totalAmount);
    continueBtn.disabled = count === 0;
}

function continueToPayment() {
    if (selectedSeats.size === 0) {
        bookingMessage.textContent = "Please select at least one seat to continue.";
        return;
    }

    // Demo flow: save the booking details for the confirmation page.
    const booking = {
        movieId: SHOW_DATA.movieId,
        movie: SHOW_DATA.movie.title,
        genre: SHOW_DATA.movie.genre,
        poster: SHOW_DATA.poster,
        date: SHOW_DATA.movie.date,
        time: SHOW_DATA.movie.time,
        theater: SHOW_DATA.movie.theater,
        screen: SHOW_DATA.movie.screen,
        seats: Array.from(selectedSeats),
        ticketPrice: SHOW_DATA.ticketPrice,
        convenienceFee: SHOW_DATA.convenienceFee,
        total: selectedSeats.size * SHOW_DATA.ticketPrice + SHOW_DATA.convenienceFee
    };

    try {
        sessionStorage.setItem("cineviaBooking", JSON.stringify(booking));
    } catch (error) {
        console.error("Could not save booking details in this browser.", error);
        bookingMessage.textContent = "Your browser could not save this booking. Please enable site storage and try again.";
        return;
    }

    window.location.href = "confirmation.html";
}

continueBtn.addEventListener("click", continueToPayment);

if (hasValidShow) {
    populateMovieDetails();
    renderSeats();
    updateSummary();
} else {
    document.getElementById("movieTitle").textContent = "Choose a movie showtime";
    document.getElementById("movieGenre").textContent = "";
    document.getElementById("summaryMovieTitle").textContent = "No show selected";
    document.getElementById("summaryShowDetails").textContent = "Start from the movie list.";
    document.getElementById("seatInstruction").textContent =
        "Return to the movie list and choose a movie showtime first.";
    bookingMessage.textContent = "A movie and showtime are required before choosing seats.";
    continueBtn.disabled = true;
}
