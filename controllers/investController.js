
const { getPortfolioSuggestions } = require('../services/geminiService');

exports.buildPortfolio = async (req, res) => {
  const { capital, timePeriod, returnExpectation, riskLevel } = req.body;
  try {
    const suggestions = await getPortfolioSuggestions({ capital, timePeriod, returnExpectation, riskLevel });
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate portfolio' });
  }
};
