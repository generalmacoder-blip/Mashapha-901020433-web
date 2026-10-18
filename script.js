// Gusheshe Spinning website - simple JavaScript

// 1. Dark and light mode
var mode = document.getElementById("mode");

function setTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);

    if (mode) {
        mode.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
    }
}

setTheme(localStorage.getItem("theme") || "light");

if (mode) {
    mode.onclick = function () {
        var current = document.documentElement.getAttribute("data-bs-theme");
        setTheme(current === "dark" ? "light" : "dark");
    };
}


// 2. Search and category filter (Spots and Collection pages)
var search = document.getElementById("search");
var select = document.getElementById("select");
var spots = document.querySelectorAll(".spot");
var noResults = document.getElementById("noResults");

function filterSpots() {
    var word = search ? search.value.toLowerCase() : "";
    var category = select ? select.value : "All";
    var shown = 0;

    spots.forEach(function (spot) {
        var text = spot.textContent.toLowerCase();
        var spotCategory = spot.getAttribute("data-category");
        var matchesWord = text.includes(word);
        var matchesCategory = category === "All" || category === spotCategory;

        if (matchesWord && matchesCategory) {
            spot.style.display = "";
            shown++;
        } else {
            spot.style.display = "none";
        }
    });

    if (noResults) {
        noResults.style.display = shown === 0 ? "block" : "none";
    }
}

if (search) search.addEventListener("input", filterSpots);
if (select) select.addEventListener("change", filterSpots);


// 3. Gallery popup and Previous / Next buttons
var pictures = document.querySelectorAll(".gallery-img");
var pictureModal = document.getElementById("pictureModal");
var bigPicture = document.getElementById("bigPicture");
var bigCaption = document.getElementById("bigCaption");
var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");
var pictureIndex = 0;

function showPicture(index) {
    if (!pictures.length) return;

    // Keep the index within the list of pictures
    pictureIndex = (index + pictures.length) % pictures.length;

    bigPicture.src = pictures[pictureIndex].src;
    bigPicture.alt = pictures[pictureIndex].alt || "Gusheshe car";
    bigCaption.textContent = pictures[pictureIndex].alt ||
        pictures[pictureIndex].getAttribute("src").split("/").pop();
}

if (pictures.length && pictureModal && bigPicture) {
    pictures.forEach(function (picture, index) {
        picture.addEventListener("click", function () {
            showPicture(index);
            bootstrap.Modal.getOrCreateInstance(pictureModal).show();
        });
    });

    if (prevBtn) {
        prevBtn.onclick = function () {
            showPicture(pictureIndex - 1);
        };
    }

    if (nextBtn) {
        nextBtn.onclick = function () {
            showPicture(pictureIndex + 1);
        };
    }
}


// 4. Contact form
var contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.onsubmit = function (event) {
        event.preventDefault();

        var name = document.getElementById("cName");
        var email = document.getElementById("cEmail");
        var message = document.getElementById("cMessage");
        var result = document.getElementById("contactResult");

        var valid = true;

        [name, email, message].forEach(function (field) {
            if (!field.value.trim() || !field.checkValidity()) {
                field.classList.add("is-invalid");
                valid = false;
            } else {
                field.classList.remove("is-invalid");
            }
        });

        if (valid) {
            result.innerHTML = '<div class="alert alert-success">Thanks, ' +
                name.value.trim() + '! Your message is ready.</div>';
            contactForm.reset();
        } else {
            result.innerHTML = '<div class="alert alert-warning">Please fill in all fields correctly.</div>';
        }
    };
}


// 5. Booking price calculator
var bookingForm = document.getElementById("bookingForm");
var bSpot = document.getElementById("bSpot");
var bTicket = document.getElementById("bTicket");
var bPeople = document.getElementById("bPeople");
var bTotal = document.getElementById("bTotal");
var bNote = document.getElementById("bNote");

function updateTotal() {
    if (!bSpot || !bTicket || !bPeople || !bTotal) return;

    var spotPrice = Number(bSpot.value) || 0;
    var ticketPrice = Number(bTicket.value) || 0;
    var people = Number(bPeople.value) || 1;

    if (people < 1) people = 1;
    bTotal.textContent = "M" + ((spotPrice + ticketPrice) * people);

    if (bNote) {
        bNote.textContent = "Price per person: M" + (spotPrice + ticketPrice);
    }
}

if (bSpot && bTicket && bPeople) {
    bSpot.addEventListener("change", updateTotal);
    bTicket.addEventListener("change", updateTotal);
    bPeople.addEventListener("input", updateTotal);
    updateTotal();
}

// Show the last saved booking, if one exists
var welcome = document.getElementById("welcome");
var lastBooking = document.getElementById("lastBooking");

if (welcome && localStorage.getItem("customerName")) {
    welcome.innerHTML = '<div class="alert alert-success">Welcome back, ' +
        localStorage.getItem("customerName") + '!</div>';
}

if (lastBooking && localStorage.getItem("lastBooking")) {
    lastBooking.innerHTML = '<div class="alert alert-info">Last booking: ' +
        localStorage.getItem("lastBooking") + '</div>';
}

if (bookingForm) {
    bookingForm.onsubmit = function (event) {
        event.preventDefault();

        var fields = bookingForm.querySelectorAll("input[required], select[required]");
        var valid = true;

        fields.forEach(function (field) {
            if (!field.checkValidity()) {
                field.classList.add("is-invalid");
                valid = false;
            } else {
                field.classList.remove("is-invalid");
            }
        });

        var people = Number(bPeople.value);
        if (people < 1 || people > 20) {
            bPeople.classList.add("is-invalid");
            valid = false;
        }

        var result = document.getElementById("bookingResult");

        if (!valid) {
            result.innerHTML = '<div class="alert alert-warning">Please check the required fields.</div>';
            return;
        }

        var name = document.getElementById("bName").value.trim();
        var spotName = bSpot.options[bSpot.selectedIndex].text;
        var total = bTotal.textContent;

        localStorage.setItem("customerName", name);
        localStorage.setItem("lastBooking", spotName + " on " +
            document.getElementById("bDate").value + " — " + total);

        result.innerHTML = '<div class="alert alert-success">Thank you, ' +
            name + '! Your booking details have been saved on this device. This demo does not send a real booking.</div>';

        bookingForm.reset();
        updateTotal();
    };
}
