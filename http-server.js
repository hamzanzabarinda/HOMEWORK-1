const http = require("http");
const url = require("url");

// conversion rates
const conversionRates = {
  usd: 1500,
  eur: 1700,
  cny: 2000,
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // only allow GET /convert
  if (req.method === "GET" && parsedUrl.pathname === "/convert") {
    const { amount, currency } = parsedUrl.query;

    // validation
    if (!amount) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "amount is required" })
      );
    }

    if (!currency) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "currency is required" })
      );
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "amount must be a valid number" })
      );
    }

    if (!conversionRates[currency]) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "unsupported currency" })
      );
    }

    const convertedAmount =
      numericAmount * conversionRates[currency];

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        input: {
          amount: numericAmount,
          currency,
        },
        convertedAmount,
        unit: "RWF",
      })
    );
  } else {
    res.writeHead(404, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(2000, () => {
  console.log("Server running on http://localhost:2000");
});