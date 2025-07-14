// File: /api/dexscreener.ts
export default async function handler(req, res) {
  const { contract } = req.query;

  if (!contract) {
    return res.status(400).json({ error: "Missing contract" });
  }

  const url = `https://api.dexscreener.com/latest/dex/tokens/${contract}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    });

    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.includes("application/json")) {
      const text = await response.text();
      return res.status(response.status).json({
        error: `Dexscreener error`,
        message: text.slice(0, 100),
      });
    }

    const json = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(json);
  } catch (err) {
    console.error("Fetch failed:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
}
