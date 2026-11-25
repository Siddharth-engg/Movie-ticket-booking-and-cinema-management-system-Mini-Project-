// ===== LISTING PAGE JS (koi id lagane ki zaroorat nahi) =====

// Step 1: elements pakdo (HTML ke classes se)
var searchInput = document.querySelector(".search-box input");
var searchButton = document.querySelector(".search-box button");
var filterBoxes = document.querySelectorAll(".filters");
var genreChips = filterBoxes[0].querySelectorAll(".chip");
var languageChips = filterBoxes[1].querySelectorAll(".chip");
var movieCards = document.querySelectorAll(".movie-card");

// Step 2: "No movies found" message JS khud bana leta hai
var noResults = document.createElement("p");
noResults.textContent = "No movies found.";
noResults.style.display = "none";
noResults.style.marginTop = "20px";
document.querySelector(".container").appendChild(noResults);

// Step 3: check karne ke liye (F12 > Console mein dikhega)
console.log("Cards:", movieCards.length, "| Genre chips:", genreChips.length, "| Language chips:", languageChips.length);

// Step 4: user ka choice yaad rakho
var selectedGenre = "All";
var selectedLanguage = "All";

// Step 5: movies dikhao ya chhupao
function filterMovies() {
  var searchText = searchInput.value.toLowerCase();
  var visibleCount = 0;

  for (var i = 0; i < movieCards.length; i++) {
    var card = movieCards[i];
    var title = card.querySelector(".movie-title").textContent.toLowerCase();
    var meta = card.querySelector(".movie-meta").textContent;
    var show = true;

    if (title.indexOf(searchText) === -1) {
      show = false;
    }
    if (selectedGenre !== "All" && meta.indexOf(selectedGenre) === -1) {
      show = false;
    }
    if (selectedLanguage !== "All" && meta.indexOf(selectedLanguage) === -1) {
      show = false;
    }

    if (show === true) {
      card.style.display = "";
      visibleCount = visibleCount + 1;
    } else {
      card.style.display = "none";
    }
  }

  if (visibleCount === 0) {
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
  }
}

// Step 6: genre chips
for (var i = 0; i < genreChips.length; i++) {
  genreChips[i].addEventListener("click", function () {
    for (var j = 0; j < genreChips.length; j++) {
      genreChips[j].classList.remove("active");
    }
    this.classList.add("active");
    selectedGenre = this.textContent.trim();
    filterMovies();
  });
}

// Step 7: language chips
for (var k = 0; k < languageChips.length; k++) {
  languageChips[k].addEventListener("click", function () {
    for (var m = 0; m < languageChips.length; m++) {
      languageChips[m].classList.remove("active");
    }
    this.classList.add("active");
    selectedLanguage = this.textContent.trim();
    filterMovies();
  });
}

// Step 8: search bar
searchInput.addEventListener("keyup", filterMovies);
searchButton.addEventListener("click", filterMovies);