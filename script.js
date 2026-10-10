
var themeBtn = document.getElementById("themeBtn");

function setTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem("theme", theme);           
  if (themeBtn) {
    themeBtn.textContent = (theme === "dark") ? "Light mode" : "Dark mode";
  }
}

setTheme(localStorage.getItem("theme") || "light");

if (themeBtn) {
  themeBtn.onclick = function () {
    var current = document.documentElement.getAttribute("data-bs-theme");
    setTheme(current === "dark" ? "light" : "dark");
  };
}



var welcome = document.getElementById("welcome");
var savedName = localStorage.getItem("username");

if (welcome && savedName) {
  welcome.className = "alert alert-success";
  welcome.textContent = "Welcome back, " + savedName + "!";
}

var lastBooking = document.getElementById("lastBooking");
if (lastBooking && localStorage.getItem("lastBooking")) {
  lastBooking.className = "alert alert-info";
  lastBooking.textContent = "Your last booking: " + localStorage.getItem("lastBooking");
}



var searchBox = document.getElementById("searchBox");
var filterSelect = document.getElementById("filterSelect");

function filterSpots() {
  var text = searchBox.value.toLowerCase();
  var category = filterSelect.value;
  var cards = document.querySelectorAll(".spot");
  var shown = 0;

  cards.forEach(function (card) {
    var textMatches = card.textContent.toLowerCase().includes(text);
    var categoryMatches = (category === "All") || (card.dataset.category === category);

    if (textMatches && categoryMatches) {
      card.style.display = "";        
      shown = shown + 1;
    } else {
      card.style.display = "none"; 
    }
  });

  document.getElementById("noResults").style.display = (shown === 0) ? "block" : "none";
}

if (searchBox && filterSelect) {
  searchBox.oninput = filterSpots;
  filterSelect.onchange = filterSpots;
}


var galleryImages = document.querySelectorAll(".gallery-img");
var bigPicture = document.getElementById("bigPicture");
var bigCaption = document.getElementById("bigCaption");
var current = 0;

function showPicture(number) {
  if (number < 0) { number = galleryImages.length - 1; }    
  if (number >= galleryImages.length) { number = 0; }      
  current = number;
  bigPicture.src = galleryImages[current].src;
  bigPicture.alt = galleryImages[current].alt;
  bigCaption.textContent = galleryImages[current].alt;
}

if (bigPicture) {
  var galleryModal = new bootstrap.Modal(document.getElementById("pictureModal"));

  galleryImages.forEach(function (img, index) {
    img.onclick = function () {
      showPicture(index);
      galleryModal.show();
    };
  });

  document.getElementById("prevBtn").onclick = function () { showPicture(current - 1); };
  document.getElementById("nextBtn").onclick = function () { showPicture(current + 1); };
}



function checkInput(input, isOk, message) {
  var errorBox = input.nextElementSibling;   
  if (isOk) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    errorBox.textContent = message;
  }
  return isOk;
}

function clearForm(form) {
  form.reset();
  form.querySelectorAll(".is-valid").forEach(function (box) {
    box.classList.remove("is-valid");
  });
}

function isEmail(text) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

function isPhone(text) {
  
  return /^(\+266)?[2568][0-9]{7}$/.test(text.replace(/ /g, ""));
}


var contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.onsubmit = function (event) {
    event.preventDefault();     

    var name = document.getElementById("cName");
    var email = document.getElementById("cEmail");
    var message = document.getElementById("cMessage");

    var good = true;
    good = checkInput(name, name.value.trim().length >= 2, "Please enter your name.") && good;
    good = checkInput(email, isEmail(email.value), "Please enter a valid email.") && good;
    good = checkInput(message, message.value.trim().length >= 10, "Message must be at least 10 characters.") && good;

    var result = document.getElementById("contactResult");
    if (good) {
      localStorage.setItem("username", name.value.trim());  
      result.className = "alert alert-success";
      result.textContent = "Thank you " + name.value.trim() + "! We got your message.";
      clearForm(contactForm);
    } else {
      result.className = "alert alert-danger";
      result.textContent = "Please fix the red boxes.";
    }
  };
}



var bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  var spotSelect = document.getElementById("bSpot");
  var ticketSelect = document.getElementById("bTicket");
  var peopleBox = document.getElementById("bPeople");
  var dateBox = document.getElementById("bDate");

  
  var today = new Date().toISOString().split("T")[0];
  dateBox.min = today;


  function updateTotal() {
    var spotPrice = Number(spotSelect.value) || 0;
    var ticketPrice = Number(ticketSelect.value) || 0;
    var people = Number(peopleBox.value) || 0;

    var total = (spotPrice + ticketPrice) * people;
    var note = "";

    if (people >= 5) {            
      total = total * 0.9;
      note = "10% group discount applied!";
    }

    document.getElementById("bTotal").textContent = "M" + Math.round(total);
    document.getElementById("bNote").textContent = note;
    return Math.round(total);
  }

  spotSelect.onchange = updateTotal;
  ticketSelect.onchange = updateTotal;
  peopleBox.oninput = updateTotal;
  updateTotal();

  
  bookingForm.onsubmit = function (event) {
    event.preventDefault();

    var name = document.getElementById("bName");
    var email = document.getElementById("bEmail");
    var phone = document.getElementById("bPhone");
    var people = Number(peopleBox.value);

    var good = true;
    good = checkInput(name, name.value.trim().length >= 2, "Please enter your name.") && good;
    good = checkInput(email, isEmail(email.value), "Please enter a valid email.") && good;
    good = checkInput(phone, isPhone(phone.value), "Enter a Lesotho number, e.g. 58123456.") && good;
    good = checkInput(dateBox, dateBox.value !== "" && dateBox.value >= today, "Choose a date from today onwards.") && good;
    good = checkInput(spotSelect, spotSelect.value !== "", "Please choose a spin spot.") && good;
    good = checkInput(peopleBox, people >= 1 && people <= 20, "Choose between 1 and 20 people.") && good;

    var result = document.getElementById("bookingResult");
    if (good) {
      var spotName = spotSelect.options[spotSelect.selectedIndex].text.split(" (")[0];
      var summary = spotName + " on " + dateBox.value + " for " + people + " people, total M" + updateTotal();

      localStorage.setItem("username", name.value.trim());  
      localStorage.setItem("lastBooking", summary);

      result.className = "alert alert-success";
      result.textContent = "Booking confirmed! " + summary;
      clearForm(bookingForm);
      updateTotal();
    } else {
      result.className = "alert alert-danger";
      result.textContent = "Please fix the red boxes.";
    }
  };
}
