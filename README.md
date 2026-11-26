# Cinevia - Movie Ticket Booking Demo

## Run the website

For the complete booking flow, serve the project root with a local web server (for example, `python -m http.server 8000`) and visit `http://localhost:8000/html/index.html`. Browser storage may not work when opening the files directly with `file://`.

The booking flow is:

1. Browse movies on the home page or movie catalogue.
2. Select a now-showing movie and a cinema showtime.
3. Choose available seats and continue to the confirmation page.

The selected movie, showtime, seats, and ticket total are passed between pages using browser `sessionStorage`. Upcoming movies are informational and cannot be booked yet. Account screens use browser `localStorage` for this front-end demo only.

This project does not include a server, real payment processing, email delivery, or secure production authentication.