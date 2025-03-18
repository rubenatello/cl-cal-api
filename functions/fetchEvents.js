exports.handler = async () => {
    const API_URL = "https://api.planningcenteronline.com/calendar/v2/events"; // Correct Planning Center API URL
    const API_KEY = process.env.PLANNING_CENTER_API_KEY; // API key stored securely in Netlify

    try {
        const response = await fetch(API_URL, {
            headers: { "Authorization": `Bearer ${API_KEY}` }
        });

        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
