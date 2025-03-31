import fetch from "node-fetch";

export async function handler() {
  const API_URL = "https://api.planningcenteronline.com/calendar/v2/event_instances?filter=future&order=starts_at&include=event,event.tags";
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
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error("Failed to fetch events - " + errorText);
    }

    const data = await response.json();

    // Build event lookup by ID
    const eventsById = {};
    const tagsById = {};

    for (const item of data.included || []) {
      if (item.type === "Event") {
        eventsById[item.id] = item;
      }
      if (item.type === "Tag") {
        tagsById[item.id] = item;
      }
    }

    const seenEventIds = new Set();
    const cityGroupEvents = [];

    for (const instance of data.data || []) {
      const eventId = instance.relationships.event.data.id;
      if (seenEventIds.has(eventId)) continue;
      seenEventIds.add(eventId);

      const event = eventsById[eventId];
      if (!event) continue;

      const title = event.attributes.name;
      if (!title.toLowerCase().includes("city group")) continue;

      const tags = (event.relationships.tags?.data || []).map(tagRef => tagsById[tagRef.id]?.attributes?.name).filter(Boolean);

      // Convert time to Pacific Time
      const utcDate = new Date(instance.attributes.starts_at);
      const localDateStr = utcDate.toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
        dateStyle: "full",
        timeStyle: "short",
      });

      cityGroupEvents.push({
        id: event.id,
        name: title,
        date_utc: instance.attributes.starts_at,
        date_local: localDateStr,
        image_url: event.attributes.image_url,
        church_center_url: instance.attributes.church_center_url,
        tags: tags,
      });
    }

    console.log("Filtered City Group Events:", cityGroupEvents);

    return {
      statusCode: 200,
      body: JSON.stringify(cityGroupEvents, null, 2),
    };
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }, null, 2),
    };
  }
}
