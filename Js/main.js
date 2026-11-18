
/* =========================================================
   KNOW YOUR TRANSPORT FARE
   File: js/main.js

   Purpose:
   This is the main JavaScript file for the website.
   It connects the HTML pages with our data and storage files.

   Technologies:
   - JavaScript ES6 Modules
   - DOM Manipulation
   - Events
   - Arrays and Objects
   - Local Storage
   - JSON
   ========================================================= */


// =========================================================
// 1. IMPORT REQUIRED FUNCTIONS
// Import reusable functions from our other JavaScript files.
// =========================================================

import {
    cities,
    routes,
    transportTypes,
    getRoute,
    getTransportType,
    formatCurrency
} from "./data.js";

import {
    getSavedJourneys,
    saveJourney,
    deleteJourney,
    clearAllJourneys,
    getJourneyCount,
    getTotalSavedFare
} from "./storage.js";


// =========================================================
// 2. GENERAL HELPER FUNCTIONS
// These functions are useful on different website pages.
// =========================================================


// Select one HTML element using its CSS selector.
function selectElement(selector) {

    return document.querySelector(selector);

}


// Select multiple HTML elements.
function selectAllElements(selector) {

    return document.querySelectorAll(selector);

}


// Display a message inside an HTML element.
function displayMessage(element, message, type = "success") {

    // Stop if the element does not exist.
    if (!element) return;

    // Display the message.
    element.textContent = message;

    // Apply a message type for styling.
    element.className = `form-feedback ${type}`;

}


// =========================================================
// 3. MOBILE NAVIGATION
// Allows users to open and close the mobile menu.
// =========================================================

function initializeNavigation() {

    // Get the navigation button.
    const menuToggle = selectElement("#menuToggle");

    // Get the navigation menu.
    const mainNav = selectElement("#mainNav");

    // Check whether both elements exist.
    if (!menuToggle || !mainNav) return;

    // Listen for clicks on the menu button.
    menuToggle.addEventListener("click", () => {

        // Add or remove the show class.
        const isOpen = mainNav.classList.toggle("show");

        // Update accessibility information.
        menuToggle.setAttribute("aria-expanded", String(isOpen));

    });

    // Close the menu when a navigation link is selected.
    mainNav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("show");

            menuToggle.setAttribute("aria-expanded", "false");

        });

    });

}


// =========================================================
// 4. POPULATE CITY SELECT OPTIONS
// Adds cities from data.js to the calculator form.
// =========================================================

function populateCityOptions() {

    // Get the departure and destination fields.
    const departure = selectElement("#departure");
    const destination = selectElement("#destination");

    // Stop if this page does not contain the calculator.
    if (!departure || !destination) return;

    // Add city options to both select fields.
    cities.forEach(city => {

        // Create the departure option.
        const departureOption = document.createElement("option");

        departureOption.value = city;
        departureOption.textContent = city;

        departure.appendChild(departureOption);


        // Create the destination option.
        const destinationOption = document.createElement("option");

        destinationOption.value = city;
        destinationOption.textContent = city;

        destination.appendChild(destinationOption);

    });

}


// =========================================================
// 5. FARE CALCULATOR
// Calculates an estimated fare based on route and transport.
// =========================================================

function initializeFareCalculator() {

    // Get the calculator form.
    const fareForm = selectElement("#fareForm");

    // Get the result containers.
    const fareResult = selectElement("#fareResult");
    const resultDetails = selectElement("#resultDetails");

    // Get the save journey button if one exists.
    const saveButton = selectElement("#saveJourneyBtn");

    // Stop if the calculator form does not exist.
    if (!fareForm || !fareResult || !resultDetails) return;

    // Store the most recently calculated journey.
    let currentJourney = null;

    // Listen for form submission.
    fareForm.addEventListener("submit", event => {

        // Prevent the browser from refreshing the page.
        event.preventDefault();

        // Get values entered by the user.
        const from = selectElement("#departure").value;

        const to = selectElement("#destination").value;

        const transportId = selectElement("#transportType").value;

        const passengers = Number(
            selectElement("#passengers").value
        );


        // Validate the selected cities.
        if (!from || !to) {

            alert("Please select your departure and destination.");

            return;

        }

        // A person cannot travel from a city to itself.
        if (from === to) {

            alert("Departure and destination cannot be the same.");

            return;

        }

        // Validate the number of passengers.
        if (!Number.isInteger(passengers) || passengers < 1 || passengers > 20) {

            alert("Please enter between 1 and 20 passengers.");

            return;

        }


        // Find the selected transport type.
        const transport = getTransportType(transportId);

        if (!transport) {

            alert("Please select a valid transport type.");

            return;

        }


        // Find the selected route.
        const route = getRoute(from, to);

        if (!route) {

            alert(
                "Sorry, this route is not currently available in our sample data."
            );

            fareResult.hidden = true;

            return;

        }


        // Calculate the estimated fare.
        const unitFare = route.fare * transport.multiplier;

        // Calculate the total fare for all passengers.
        const totalFare = unitFare * passengers;


        // Store the journey details in an object.
        currentJourney = {

            from: from,

            to: to,

            transportType: transport.name,

            transportId: transport.id,

            passengers: passengers,

            distance: route.distance,

            unitFare: Math.round(unitFare),

            totalFare: Math.round(totalFare)

        };


        // Display the result.
        resultDetails.innerHTML = `

            <div class="result-item">

                <span>Departure</span>

                <strong>${from}</strong>

            </div>


            <div class="result-item">

                <span>Destination</span>

                <strong>${to}</strong>

            </div>


            <div class="result-item">

                <span>Transport Type</span>

                <strong>${transport.name}</strong>

            </div>


            <div class="result-item">

                <span>Distance</span>

                <strong>${route.distance} km</strong>

            </div>


            <div class="result-item">

                <span>Number of Passengers</span>

                <strong>${passengers}</strong>

            </div>


            <div class="result-item">

                <span>Fare Per Passenger</span>

                <strong>${formatCurrency(Math.round(unitFare))}</strong>

            </div>


            <div class="result-total">

                <span>Total Estimated Fare</span>

                <strong>${formatCurrency(Math.round(totalFare))}</strong>

            </div>

        `;


        // Make the result section visible.
        fareResult.hidden = false;


        // Show the save button if it exists.
        if (saveButton) {

            saveButton.hidden = false;

        }

    });


    // Save the calculated journey when the button is clicked.
    if (saveButton) {

        saveButton.addEventListener("click", () => {

            // Make sure a journey has been calculated.
            if (!currentJourney) {

                alert("Please calculate a fare before saving.");

                return;

            }

            // Save the journey in Local Storage.
            const saved = saveJourney(currentJourney);

            if (saved) {

                alert("Your journey has been saved successfully!");

            } else {

                alert("Unable to save your journey. Please try again.");

            }

        });

    }

}


// =========================================================
// 6. POPULAR ROUTES
// Implements route search, filtering and sorting.
// =========================================================

function initializeRoutesPage() {

    // Get the routes container.
    const routesContainer = selectElement("#routesContainer");

    // Get the search and filter controls.
    const routeSearch = selectElement("#routeSearch");

    const departureFilter = selectElement("#departureFilter");

    const fareSort = selectElement("#fareSort");

    const noRoutesMessage = selectElement("#noRoutesMessage");

    // Stop if this is not the routes page.
    if (!routesContainer) return;


    // Get the original route cards.
    const originalCards = Array.from(
        routesContainer.querySelectorAll(".route-card")
    );


    // Get all unique departure cities.
    const departureCities = [
        ...new Set(routes.map(route => route.from))
    ];


    // Add departure cities to the filter.
    if (departureFilter) {

        departureCities.sort().forEach(city => {

            const option = document.createElement("option");

            option.value = city;

            option.textContent = city;

            departureFilter.appendChild(option);

        });

    }


    // Function to filter and sort the routes.
    function updateRoutes() {

        // Read the search input.
        const searchText = routeSearch
            ? routeSearch.value.toLowerCase().trim()
            : "";


        // Read the selected departure city.
        const selectedDeparture = departureFilter
            ? departureFilter.value
            : "";


        // Read the sorting option.
        const sortOption = fareSort
            ? fareSort.value
            : "default";


        // Filter routes based on search and departure.
        let filteredRoutes = originalCards.filter(card => {

            const from = card.dataset.from.toLowerCase();

            const to = card.dataset.to.toLowerCase();

            const matchesSearch =
                from.includes(searchText) ||
                to.includes(searchText);

            const matchesDeparture =
                !selectedDeparture ||
                card.dataset.from === selectedDeparture;

            return matchesSearch && matchesDeparture;

        });


        // Sort the matching routes by fare.
        if (sortOption === "low") {

            filteredRoutes.sort((a, b) => {

                return Number(a.dataset.fare) - Number(b.dataset.fare);

            });

        } else if (sortOption === "high") {

            filteredRoutes.sort((a, b) => {

                return Number(b.dataset.fare) - Number(a.dataset.fare);

            });

        }


        // Remove the old cards from the container.
        routesContainer.innerHTML = "";


        // Add the filtered cards back to the page.
        filteredRoutes.forEach(card => {

            routesContainer.appendChild(card);

        });


        // Show a message when no route matches.
        if (noRoutesMessage) {

            noRoutesMessage.hidden = filteredRoutes.length !== 0;

        }

    }


    // Listen for search input.
    if (routeSearch) {

        routeSearch.addEventListener("input", updateRoutes);

    }


    // Listen for departure filter changes.
    if (departureFilter) {

        departureFilter.addEventListener("change", updateRoutes);

    }


    // Listen for sorting changes.
    if (fareSort) {

        fareSort.addEventListener("change", updateRoutes);

    }

}


// =========================================================
// 7. SAVED JOURNEYS PAGE
// Displays journeys stored in Local Storage.
// =========================================================

function initializeSavedJourneysPage() {

    // Get the saved journeys container.
    const container = selectElement("#savedJourneysContainer");

    // Get the empty state message.
    const emptyState = selectElement("#emptyState");

    // Get the summary elements.
    const savedCount = selectElement("#savedCount");

    const totalSavedFare = selectElement("#totalSavedFare");

    // Get the clear all button.
    const clearAllButton = selectElement("#clearAllBtn");

    // Get the feedback message.
    const savedMessage = selectElement("#savedMessage");

    // Stop if this page does not contain saved journeys.
    if (!container) return;


    // Function to display all saved journeys.
    function renderSavedJourneys() {

        // Retrieve journeys from Local Storage.
        const journeys = getSavedJourneys();

        // Update the journey count.
        if (savedCount) {

            savedCount.textContent = getJourneyCount();

        }

        // Update the total estimated fare.
        if (totalSavedFare) {

            totalSavedFare.textContent = formatCurrency(
                getTotalSavedFare()
            );

        }


        // Clear the existing journey cards.
        container.innerHTML = "";


        // Show the empty state when no journeys exist.
        if (journeys.length === 0) {

            if (emptyState) {

                emptyState.hidden = false;

            }

            return;

        }


        // Hide the empty state.
        if (emptyState) {

            emptyState.hidden = true;

        }


        // Create a card for each saved journey.
        journeys.forEach(journey => {

            // Create a new card element.
            const card = document.createElement("article");

            card.className = "saved-journey-card";


            // Create a readable date.
            const savedDate = journey.savedAt
                ? new Date(journey.savedAt).toLocaleDateString("en-NG")
                : "Date unavailable";


            // Display journey information.
            card.innerHTML = `

                <div class="saved-journey-info">

                    <h3>${escapeHTML(journey.from)} to ${escapeHTML(journey.to)}</h3>

                    <p>
                        Transport:
                        ${escapeHTML(journey.transportType)}
                    </p>

                    <p>
                        Passengers:
                        ${Number(journey.passengers)}
                    </p>

                    <p>
                        Distance:
                        ${Number(journey.distance)} km
                    </p>

                    <p>
                        Saved:
                        ${escapeHTML(savedDate)}
                    </p>

                    <strong>
                        ${formatCurrency(Number(journey.totalFare))}
                    </strong>

                </div>


                <button
                    class="btn btn-outline delete-journey-btn"
                    data-id="${escapeHTML(journey.id)}"
                    type="button"
                >

                    Delete Journey

                </button>

            `;


            // Add the card to the page.
            container.appendChild(card);

        });

    }


    // Helper function to safely display text in HTML.
    function escapeHTML(value) {

        return String(value ?? "").replace(/[&<>"']/g, character => {

            const entities = {

                "&": "&amp;",

                "<": "&lt;",

                ">": "&gt;",

                '"': "&quot;",

                "'": "&#039;"

            };

            return entities[character];

        });

    }


    // Listen for clicks on delete buttons.
    container.addEventListener("click", event => {

        const deleteButton = event.target.closest(".delete-journey-btn");

        // Ignore clicks that are not on a delete button.
        if (!deleteButton) return;


        // Get the journey ID.
        const journeyId = deleteButton.dataset.id;


        // Delete the selected journey.
        const deleted = deleteJourney(journeyId);

        if (deleted) {

            displayMessage(
                savedMessage,
                "Journey deleted successfully.",
                "success"
            );

            // Refresh the displayed journeys.
            renderSavedJourneys();

        } else {

            displayMessage(
                savedMessage,
                "Unable to delete this journey.",
                "error"
            );

        }

    });


    // Clear all saved journeys.
    if (clearAllButton) {

        clearAllButton.addEventListener("click", () => {

            // Do not clear if the list is already empty.
            if (getSavedJourneys().length === 0) {

                alert("There are no saved journeys to clear.");

                return;

            }


            // Ask for confirmation.
            const confirmed = confirm(
                "Are you sure you want to delete all saved journeys?"
            );


            if (confirmed) {

                const cleared = clearAllJourneys();

                if (cleared) {

                    displayMessage(
                        savedMessage,
                        "All saved journeys have been cleared.",
                        "success"
                    );

                    renderSavedJourneys();

                } else {

                    displayMessage(
                        savedMessage,
                        "Unable to clear saved journeys.",
                        "error"
                    );

                }

            }

        });

    }


    // Display saved journeys when the page loads.
    renderSavedJourneys();

}


// =========================================================
// 8. CONTACT FORM VALIDATION
// Checks the contact form without sending an email.
// =========================================================

function initializeContactForm() {

    // Get the contact form.
    const contactForm = selectElement("#contactForm");

    // Get the feedback element.
    const contactFeedback = selectElement("#contactFeedback");

    // Stop if the contact form does not exist.
    if (!contactForm) return;


    // Listen for form submission.
    contactForm.addEventListener("submit", event => {

        // Prevent the page from refreshing.
        event.preventDefault();


        // Get the form values.
        const name = selectElement("#contactName").value.trim();

        const email = selectElement("#contactEmail").value.trim();

        const subject = selectElement("#contactSubject").value.trim();

        const message = selectElement("#contactMessage").value.trim();


        // Check whether required fields are empty.
        if (!name || !email || !subject || !message) {

            displayMessage(
                contactFeedback,
                "Please complete all fields.",
                "error"
            );

            return;

        }


        // Check the email format.
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            displayMessage(
                contactFeedback,
                "Please enter a valid email address.",
                "error"
            );

            return;

        }


        // Display a successful local validation message.
        displayMessage(
            contactFeedback,
            "Thank you! Your form has passed validation. This demo does not send messages.",
            "success"
        );


        // Reset the form fields.
        contactForm.reset();

    });

}


// =========================================================
// 9. INITIALIZE THE WEBSITE
// Runs the appropriate functions when the page loads.
// =========================================================

function initializeWebsite() {

    // Initialize the mobile navigation.
    initializeNavigation();


    // Populate city options on the calculator page.
    populateCityOptions();


    // Initialize the fare calculator.
    initializeFareCalculator();


    // Initialize popular routes.
    initializeRoutesPage();


    // Initialize saved journeys.
    initializeSavedJourneysPage();


    // Initialize contact form validation.
    initializeContactForm();

}


// =========================================================
// 10. RUN THE WEBSITE
// Wait until the HTML document is ready.
// =========================================================

if (document.readyState === "loading") {

    // Wait for the HTML document to finish loading.
    document.addEventListener("DOMContentLoaded", initializeWebsite);

} else {

    // Run immediately if the document is already ready.
    initializeWebsite();

}


// =========================================================
// END OF MAIN.JS
// =========================================================

