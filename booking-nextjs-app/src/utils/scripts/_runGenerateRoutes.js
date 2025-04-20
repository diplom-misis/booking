const CRON_SECRET = "some-secret";

async function generateRoutes() {
  try {
    const response = await fetch("/api/generate-routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CRON_SECRET}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    console.log("Success:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

generateRoutes().then(console.log).catch(console.error);
