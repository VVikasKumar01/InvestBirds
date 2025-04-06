
document.getElementById('investmentForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const capital = document.getElementById('capital').value;
  const timePeriod = document.getElementById('timePeriod').value;
  const returnExpectation = document.getElementById('returnExpectation').value;
  const riskLevel = document.getElementById('riskLevel').value;

  const response = await fetch('http://localhost:5000/api/invest/build', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ capital, timePeriod, returnExpectation, riskLevel })
  });

  const data = await response.json();
  const portfolioResult = document.getElementById('portfolioResult');
  if (data.portfolio) {
    portfolioResult.innerHTML = '<h4>Suggested Portfolio</h4><table class="table"><thead><tr><th>Asset</th><th>Allocation</th><th>Reason</th></tr></thead><tbody>' +
      data.portfolio.map(p => `<tr><td>${p.asset}</td><td>${p.allocation}</td><td>${p.reason}</td></tr>`).join('') +
      '</tbody></table><p>' + data.notes + '</p>';
  } else {
    portfolioResult.innerHTML = '<div class="alert alert-danger">Failed to generate portfolio.</div>';
  }
});
