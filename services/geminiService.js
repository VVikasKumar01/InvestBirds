
exports.getPortfolioSuggestions = async ({ capital, timePeriod, returnExpectation, riskLevel }) => {
  return {
    portfolio: [
      { asset: 'Stock A', allocation: '40%', reason: 'High growth, aligns with return expectation' },
      { asset: 'Mutual Fund B', allocation: '30%', reason: 'Diversified exposure, lower risk' },
      { asset: 'Digital Gold', allocation: '30%', reason: 'Stability and inflation hedge' }
    ],
    notes: 'Portfolio based on moderate risk appetite and medium-term horizon.'
  };
};
