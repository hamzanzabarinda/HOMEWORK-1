const express = require("express");
const app = express();

const PORT = 2000;

// conversion rates
const conversionRates = {
  usd: 1500,
  eur: 1700,
  cny: 2000,
};

// middleware for validation
function validateConversion(req, res, next) {
  const { amount, currency } = req.query;

  if (!amount) {
    return res.status(400).json({
      error: "amount is required",
    });
  }

  if (!currency) {
    return res.status(400).json({
      error: "currency is required",
    });
  }

  const numericAmount = Number(amount);

  if (isNaN(numericAmount)) {
    return res.status(400).json({
      error: "amount must be a valid number",
    });
  }

  if (!conversionRates[currency]) {
    return res.status(400).json({
      error: "unsupported currency",
    });
  }

  req.amount = numericAmount;
  next();
}

// route
app.get("/convert", validateConversion, (req, res) => {
  const { currency } = req.query;

  const convertedAmount =
    req.amount * conversionRates[currency];

  res.status(200).json({
    input: {
      amount: req.amount,
      currency,
    },
    convertedAmount,
    unit: "RWF",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});