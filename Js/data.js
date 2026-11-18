
// =========================================================
// KNOW YOUR TRANSPORT FARE
// File: js/data.js
// Purpose: Stores reusable Nigerian transport route data.
// =========================================================


// =========================================================
// 1. NIGERIAN CITIES
// List of cities available in the fare calculator.
// =========================================================

export const cities = [
    "Abuja",
    "Lagos",
    "Kano",
    "Kaduna",
    "Jos",
    "Port Harcourt",
    "Ibadan",
    "Enugu",
    "Maiduguri",
    "Benin City",
    "Sokoto",
    "Ilorin"
];


// =========================================================
// 2. TRANSPORT TYPES
// Defines the transport options and their fare multipliers.
// These multipliers are illustrative project values.
// =========================================================

export const transportTypes = [
    {
        id: "bus",
        name: "Commercial Bus",
        multiplier: 1
    },
    {
        id: "luxury",
        name: "Luxury Bus",
        multiplier: 1.5
    },
    {
        id: "shared",
        name: "Shared Taxi",
        multiplier: 1.3
    }
];


// =========================================================
// 3. POPULAR TRANSPORT ROUTES
// Each route contains:
// - A unique ID
// - Departure city
// - Destination city
// - Estimated distance
// - Illustrative sample fare per passenger
//
// NOTE: These are demonstration values, not live prices.
// =========================================================

export const routes = [

    {
        id: 1,
        from: "Abuja",
        to: "Lagos",
        distance: 750,
        fare: 25000
    },

    {
        id: 2,
        from: "Kano",
        to: "Abuja",
        distance: 350,
        fare: 18000
    },

    {
        id: 3,
        from: "Lagos",
        to: "Ibadan",
        distance: 130,
        fare: 8000
    },

    {
        id: 4,
        from: "Abuja",
        to: "Kaduna",
        distance: 190,
        fare: 10000
    },

    {
        id: 5,
        from: "Port Harcourt",
        to: "Enugu",
        distance: 200,
        fare: 12000
    },

    {
        id: 6,
        from: "Jos",
        to: "Abuja",
        distance: 280,
        fare: 9000
    },

    {
        id: 7,
        from: "Lagos",
        to: "Benin City",
        distance: 320,
        fare: 14000
    },

    {
        id: 8,
        from: "Kaduna",
        to: "Kano",
        distance: 230,
        fare: 11000
    },

    {
        id: 9,
        from: "Abuja",
        to: "Jos",
        distance: 280,
        fare: 9000
    },

    {
        id: 10,
        from: "Enugu",
        to: "Port Harcourt",
        distance: 200,
        fare: 12000
    },

    {
        id: 11,
        from: "Kano",
        to: "Maiduguri",
        distance: 500,
        fare: 22000
    },

    {
        id: 12,
        from: "Abuja",
        to: "Sokoto",
        distance: 700,
        fare: 24000
    },

    {
        id: 13,
        from: "Ibadan",
        to: "Ilorin",
        distance: 150,
        fare: 9000
    },

    {
        id: 14,
        from: "Abuja",
        to: "Enugu",
        distance: 450,
        fare: 17000
    },

    {
        id: 15,
        from: "Lagos",
        to: "Port Harcourt",
        distance: 610,
        fare: 22000
    }

];


// =========================================================
// 4. FARE CALCULATION HELPER
// Finds the sample fare for a selected route.
//
// Returns null when the route is not available.
// =========================================================

export function getRoute(from, to) {

    // Search for a route matching both selected cities.
    const selectedRoute = routes.find(route => {

        return (
            route.from.toLowerCase() === from.toLowerCase() &&
            route.to.toLowerCase() === to.toLowerCase()
        );

    });

    // Return the matching route or null.
    return selectedRoute || null;
}


// =========================================================
// 5. TRANSPORT TYPE HELPER
// Finds a transport option using its ID.
// =========================================================

export function getTransportType(typeId) {

    // Find the transport option selected by the user.
    const selectedType = transportTypes.find(type => {

        return type.id === typeId;

    });

    // Return the selected transport type or null.
    return selectedType || null;
}


// =========================================================
// 6. CURRENCY FORMATTER
// Converts numbers into Nigerian Naira format.
// Example: 25000 becomes ₦25,000.
// =========================================================

export function formatCurrency(amount) {

    return new Intl.NumberFormat("en-NG", {

        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0

    }).format(amount);

}


// =========================================================
// END OF DATA.JS
// Other JavaScript modules can import these exports.
// =========================================================


