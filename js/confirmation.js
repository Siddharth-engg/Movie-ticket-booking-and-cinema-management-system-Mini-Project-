/**
 * Cinevia - Ticket Confirmation Page JavaScript
 * Handles dynamic user greeting, printing ticket, and booking session details.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("🎟️ Ticket Confirmation View Loaded.");

    // Retrieve active user from localStorage if logged in
    const currentUserJson = localStorage.getItem('cinevia_current_user') || localStorage.getItem('cinevia_last_registered');
    
    if (currentUserJson) {
        try {
            const currentUser = JSON.parse(currentUserJson);
            if (currentUser && currentUser.name) {
                const bannerP = document.querySelector('.success-banner p');
                if (bannerP) {
                    bannerP.innerHTML = `Welcome <strong>${currentUser.name}</strong>! Your ticket and invoice details have been emailed to <em>${currentUser.email}</em>.`;
                }

                // If user has a personalized ID, link it to the booking
                const bookingIdEl = document.getElementById('ticketBookingId');
                if (bookingIdEl && currentUser.id) {
                    bookingIdEl.textContent = '#' + currentUser.id.replace('USR-', 'CV-');
                }
            }
        } catch (e) {
            console.warn("Could not parse current user data:", e);
        }
    }

    // Set today's date dynamically on the ticket if desired
    const ticketDateEl = document.getElementById('ticketDate');
    if (ticketDateEl) {
        const today = new Date();
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        ticketDateEl.textContent = today.toLocaleDateString('en-GB', options);
    }

    // Print button handler
    const printBtn = document.getElementById('printTicketBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            console.log("🖨️ Printing Ticket...");
            window.print();
        });
    }

    // Log ticket details to console
    const movieTitle = document.getElementById('ticketMovie')?.textContent || 'Deadpool & Wolverine';
    const movieSeats = document.getElementById('ticketSeats')?.textContent || 'E12, E13';
    const totalPaid = document.getElementById('ticketTotalPrice')?.textContent || '$28.00';
    const bookingId = document.getElementById('ticketBookingId')?.textContent || '#CV-8923401';

    console.log("%c=======================================================", "color: #4A7FA7; font-weight: bold;");
    console.log("%c🎬 CONFIRMED MOVIE TICKET DETAILS", "color: #B3CFE5; font-size: 14px; font-weight: bold;");
    console.log("%c=======================================================", "color: #4A7FA7; font-weight: bold;");
    console.log("📽️ Movie:      ", movieTitle);
    console.log("🪑 Seats:      ", movieSeats);
    console.log("💳 Total Paid: ", totalPaid);
    console.log("🎫 Booking ID: ", bookingId);
    console.log("%c=======================================================", "color: #4A7FA7; font-weight: bold;");
});

