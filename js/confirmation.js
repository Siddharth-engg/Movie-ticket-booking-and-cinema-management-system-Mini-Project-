document.addEventListener("DOMContentLoaded", () => {
    let booking;
    try {
        booking = JSON.parse(sessionStorage.getItem("cineviaBooking") || "null");
    } catch (error) {
        console.error("Could not read the saved booking.", error);
    }

    const ticket = document.getElementById("printableTicket");
    const printButton = document.getElementById("printTicketBtn");
    if (!booking || !Array.isArray(booking.seats) || booking.seats.length === 0) {
        document.getElementById("confirmationHeading").textContent = "No booking found";
        document.getElementById("confirmationMessage").textContent =
            "Choose a movie and seats first. Your booking will appear here after seat selection.";
        ticket.hidden = true;
        printButton.hidden = true;
        return;
    }

    document.getElementById("ticketMovie").textContent = booking.movie || "Selected movie";
    document.getElementById("ticketDate").textContent = booking.date || "";
    document.getElementById("ticketTime").textContent = booking.time || "";
    document.getElementById("ticketTheater").textContent = booking.theater || "Cinema";
    document.getElementById("ticketScreen").textContent = booking.screen || "";
    document.getElementById("ticketSeats").textContent =
        `${booking.seats.join(", ")} (${booking.seats.length} ${booking.seats.length === 1 ? "Seat" : "Seats"})`;
    document.getElementById("ticketTotalPrice").textContent =
        `₹${Number(booking.total || 0).toLocaleString("en-IN")}`;

    if (!booking.bookingId) {
        booking.bookingId = `CV-${Date.now().toString(36).toUpperCase()}`;
        try {
            sessionStorage.setItem("cineviaBooking", JSON.stringify(booking));
        } catch (error) {
            console.error("Could not save your booking reference.", error);
        }
    }
    document.getElementById("ticketBookingId").textContent = booking.bookingId;

    const poster = document.querySelector(".movie-poster");
    if (poster && booking.poster) {
        poster.src = booking.poster;
        poster.alt = `${booking.movie || "Movie"} poster`;
    }

    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem("cinevia_current_user") || "null");
    } catch (error) {
        console.error("Could not read the saved account.", error);
    }
    if (currentUser && currentUser.name) {
        document.getElementById("confirmationMessage").textContent =
            `Your seats are reserved in this browser demo, ${currentUser.name}.`;
    }

    printButton.addEventListener("click", () => window.print());
});
