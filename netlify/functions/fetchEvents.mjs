import fetch from "node-fetch";

export async function handler() {
    const API_URL = "https://api.planningcenteronline.com/calendar/v2/events"; 
    const API_KEY = process.env.PLANNING_CENTER_API_KEY; 

    try {
        console.log("Fetching events from:", API_URL);
        console.log("Using API Key:", API_KEY ? "Exists" : "Not Found");

        if (!API_KEY) {
            throw new Error("Missing API Key. Ensure it's set in Netlify Environment Variables.");
        }

        const response = await fetch(API_URL, {
            headers: { "Authorization": `Bearer ${API_KEY}` }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error Response:", errorText);
            throw new Error("Failed to fetch events - " + errorText);
        }

        const data = await response.json();
        console.log("Received Data:", data);

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error("Fetch Error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
