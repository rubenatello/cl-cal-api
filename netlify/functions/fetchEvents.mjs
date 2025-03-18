import fetch from "node-fetch";

export async function handler() {
    const API_URL = "https://api.planningcenteronline.com/calendar/v2/events"; 
    const CLIENT_ID = process.env.PLANNING_CENTER_CLIENT_ID;
    const CLIENT_SECRET = process.env.PLANNING_CENTER_CLIENT_SECRET;

    try {
        console.log("Fetching events from:", API_URL);
        console.log("Using Client ID:", CLIENT_ID ? "Exists" : "Not Found");
        console.log("Using Client Secret:", CLIENT_SECRET ? "Exists" : "Not Found");

        if (!CLIENT_ID || !CLIENT_SECRET) {
            throw new Error("Missing Client ID or Client Secret. Ensure they're set in Netlify Environment Variables.");
        }

        // Encode Client ID & Secret for Basic Auth
        const API_AUTH = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

        const response = await fetch(API_URL, {
            headers: {
                "Authorization": `Basic ${API_AUTH}`,
                "Content-Type": "application/json",
            }
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
