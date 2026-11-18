
// =========================================================
// KNOW YOUR TRANSPORT FARE
// File: js/storage.js
// Purpose: Manages saved journeys using browser Local Storage.
// =========================================================


// =========================================================
// 1. STORAGE KEY
// This is the name used to identify our saved data.
// =========================================================

const STORAGE_KEY = "knowYourTransportFareJourneys";


// =========================================================
// 2. GET SAVED JOURNEYS
// Retrieves all journeys stored in the browser.
// =========================================================

export function getSavedJourneys() {

    try {

        // Read saved journey data from Local Storage.
        const savedData = localStorage.getItem(STORAGE_KEY);

        // Convert the JSON text into a JavaScript array.
        // Return an empty array if nothing has been saved.
        return savedData ? JSON.parse(savedData) : [];

    } catch (error) {

        // Handle invalid JSON or storage access errors.
        console.error("Unable to retrieve saved journeys:", error);

        return [];

    }

}


// =========================================================
// 3. SAVE JOURNEY
// Adds a new journey to the existing saved journeys.
// =========================================================

export function saveJourney(journey) {

    try {

        // Retrieve journeys that have already been saved.
        const journeys = getSavedJourneys();

        // Add a unique ID and date to the new journey.
        const newJourney = {

            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,

            ...journey,

            savedAt: new Date().toISOString()

        };

        // Add the new journey to the beginning of the array.
        journeys.unshift(newJourney);

        // Convert the array to JSON and save it.
        localStorage.setItem(STORAGE_KEY, JSON.stringify(journeys));

        // Return the newly saved journey.
        return newJourney;

    } catch (error) {

        // Handle cases where browser storage is unavailable or full.
        console.error("Unable to save journey:", error);

        return null;

    }

}


// =========================================================
// 4. DELETE ONE JOURNEY
// Removes a journey using its unique ID.
// =========================================================

export function deleteJourney(journeyId) {

    try {

        // Get all saved journeys.
        const journeys = getSavedJourneys();

        // Create a new array without the selected journey.
        const updatedJourneys = journeys.filter(journey => {

            return journey.id !== journeyId;

        });

        // Save the updated array.
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedJourneys)
        );

        // Return true when the operation completes.
        return true;

    } catch (error) {

        console.error("Unable to delete journey:", error);

        return false;

    }

}


// =========================================================
// 5. CLEAR ALL JOURNEYS
// Removes every saved journey from this project.
// =========================================================

export function clearAllJourneys() {

    try {

        // Remove only this project's saved journey data.
        localStorage.removeItem(STORAGE_KEY);

        return true;

    } catch (error) {

        console.error("Unable to clear saved journeys:", error);

        return false;

    }

}


// =========================================================
// 6. COUNT SAVED JOURNEYS
// Returns the number of saved journeys.
// =========================================================

export function getJourneyCount() {

    // Get the saved journeys and return their array length.
    return getSavedJourneys().length;

}


// =========================================================
// 7. CALCULATE TOTAL SAVED FARE
// Adds the estimated fares of all saved journeys.
// =========================================================

export function getTotalSavedFare() {

    // Retrieve all saved journeys.
    const journeys = getSavedJourneys();

    // Add the totalFare value of every saved journey.
    const total = journeys.reduce((sum, journey) => {

        return sum + Number(journey.totalFare || 0);

    }, 0);

    return total;

}


// =========================================================
// END OF STORAGE.JS
// Other JavaScript files can import these functions.
// =========================================================

