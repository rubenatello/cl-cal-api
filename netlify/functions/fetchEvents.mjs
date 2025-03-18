import fetch from "node-fetch";
import { Buffer } from "buffer";  // Ensure Buffer is available

export async function handler() {
    const API_URL = "https://api.planningcenteronline.com/calendar/v2/events"; 
    const CLIENT_ID = process.env.PLANNING_CENTER_CLIENT_ID;
    const CLIENT_SECRET = process.env.PLANNING_CENTER_CLIENT_SECRET;

    try {
        if (!CLIENT_ID || !CLIENT_SECRET) {
            throw new Error("Missing Client ID or Client Secret. Ensure they're set in Netlify Environment Variables.");
        }

        console.log("Fetching events...");

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
            console.error("API Error:", errorText);
            throw new Error("Failed to fetch events - " + errorText);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data, null, 2), // Pretty-print JSON
            headers: { "Content-Type": "application/json" }
        };
    } catch (error) {
        console.error("Fetch Error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: { "Content-Type": "application/json" }
        };
    }
}
