const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Route to get quiz questions from Open Trivia Database
app.get("/api/questions", async (req, res) => {
  const { category, difficulty } = req.query;

  // Map categories to API IDs if necessary
  const categoryMap = {
    AnimeKnowledge: 22, // Example category ID
    PopCultureTrivia: 19,
  };

  try {
    const response = await axios.get("https://opentdb.com/api.php", {
      params: {
        amount: 10, // Get 10 questions
        type: "multiple", // Multiple choice questions
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    res.status(500).send("Error fetching quiz data");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
