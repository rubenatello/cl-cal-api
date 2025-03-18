import fetch from "node-fetch";

export async function handler() {
    const API_URL = "https://api.planningcenteronline.com/calendar/v2/events?include=event_times"; 
    const CLIENT_ID = process.env.PLANNING_CENTER_CLIENT_ID;
    const CLIENT_SECRET = process.env.PLANNING_CENTER_CLIENT_SECRET;

    try {
        console.log("Fetching ONLY City Group events from:", API_URL);

        if (!CLIENT_ID || !CLIENT_SECRET) {
            throw new Error("Missing Client ID or Client Secret. Ensure they're set in Netlify Environment Variables.");
        }

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

        // ✅ Extract & Filter Only "City Group" Events
        const cityGroupEvents = data.data
            .filter(event => event.attributes.name.toLowerCase().includes("city group"))
            .map(event => {
                const eventTime = (data.included || []).find(
                    included => included.type === "EventTime" &&
                    included.relationships.event.data.id === event.id
                );

                return {
                    id: event.id,
                    name: event.attributes.name,
                    date: eventTime ? eventTime.attributes.start_at : "No Date Available",
                    image_url: event.attributes.image_url,
                    registration_url: event.attributes.registration_url,
                    event_link: event.links.html,
                };
            });

        console.log("Filtered City Group Events:", cityGroupEvents);

        return {
            statusCode: 200,
            body: JSON.stringify(cityGroupEvents, null, 2), // ✅ Pretty-printed JSON
        };
    } catch (error) {
        console.error("Fetch Error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }, null, 2),
        };
    }
};
