const cron_secret = "some-secret";

fetch("/api/generate-partiotions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${cron_secret}`,
  },
})
  .then((response) => {
    if (!response.ok) throw new Error("Network error");
    return response.json();
  })
  .then((data) => console.log("Success:", data))
  .catch((error) => console.error("Error:", error));
