/*
 * Cinevia - Seat Selection
 * Front-end demo data: update the SHOW_DATA object to change the movie,
 * show details, ticket price, seats, or booked seats.
 */

const SHOW_DATA = {
    movie: {
        title: "War 2",
        genre: "Action • Thriller",
        date: "20 September",
        time: "07:30 PM",
        screen: "Screen 2"
    },
    ticketPrice: 180,
    convenienceFee: 30,
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
        `${SHOW_DATA.movie.screen} • ${SHOW_DATA.movie.time}`;

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
    const totalAmount = ticketAmount + SHOW_DATA.convenienceFee;

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
        movie: SHOW_DATA.movie.title,
        date: SHOW_DATA.movie.date,
        time: SHOW_DATA.movie.time,
        screen: SHOW_DATA.movie.screen,
        seats: Array.from(selectedSeats),
        ticketPrice: SHOW_DATA.ticketPrice,
        convenienceFee: SHOW_DATA.convenienceFee,
        total: selectedSeats.size * SHOW_DATA.ticketPrice + SHOW_DATA.convenienceFee
    };

    try {
        sessionStorage.setItem("cineviaBooking", JSON.stringify(booking));
    } catch (error) {
        console.warn("Could not save booking details in this browser.", error);
    }

    // Keep the existing project navigation.
    window.location.href = "confirmation.html";
}

continueBtn.addEventListener("click", continueToPayment);

// Initial page setup.
populateMovieDetails();
renderSeats();
updateSummary();
