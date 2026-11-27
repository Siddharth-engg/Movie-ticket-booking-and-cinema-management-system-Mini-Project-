// ===== DETAILS PAGE JS (koi id ya extra CSS ki zaroorat nahi) =====

var showtimeButtons = document.querySelectorAll(".showtime-btn");
var cinemaCards = document.querySelectorAll(".cinema-card");

// Message JS khud bana leta hai, last cinema card ke baad
var selectedMsg = document.createElement("p");
selectedMsg.style.color = "#B3CFE5";
selectedMsg.style.fontWeight = "bold";
selectedMsg.style.marginBottom = "20px";
var lastCard = cinemaCards[cinemaCards.length - 1];
lastCard.parentNode.insertBefore(selectedMsg, lastCard.nextSibling);

console.log("Showtime buttons:", showtimeButtons.length);

for (var i = 0; i < showtimeButtons.length; i++) {
  showtimeButtons[i].addEventListener("click", function () {

    // Pehle sabka color normal karo
    for (var j = 0; j < showtimeButtons.length; j++) {
      showtimeButtons[j].style.backgroundColor = "";
      showtimeButtons[j].style.color = "";
    }

    // Clicked button ko highlight karo
    this.style.backgroundColor = "#4A7FA7";
    this.style.color = "#F6FAFD";

    // Cinema ka naam + time dikhao
    var cinemaName = this.parentElement.querySelector(".cinema-name").textContent;
    selectedMsg.textContent = "You selected: " + cinemaName + " at " + this.textContent;
  });
}