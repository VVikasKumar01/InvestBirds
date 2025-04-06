// ✅ Form submission handler
document.getElementById('investmentForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const capital = parseFloat(document.getElementById('capital').value);
  const timePeriod = document.getElementById('timePeriod').value;
  const roi = document.getElementById('roi').value;
  const riskTolerance = document.getElementById('riskTolerance').value;
  const investmentType = document.getElementById('investmentType').value;

  if (capital && timePeriod && roi && riskTolerance && investmentType) {
    const samplePortfolio = {
      portfolio: [
        { asset: 'Equity Large Cap', type: 'Stocks', allocation: '35', notes: 'Stable high-cap investments' },
        { asset: 'Mid Cap Mutual Fund', type: 'Funds', allocation: '25', notes: 'Moderate growth potential' },
        { asset: 'Gold ETF', type: 'Commodity', allocation: '20', notes: 'Hedge against volatility' },
        { asset: 'REITs', type: 'Real Estate', allocation: '10', notes: 'Passive income' },
        { asset: 'Cash', type: 'Liquidity', allocation: '10', notes: 'Emergency buffer' }
      ]
    };
    renderPortfolio(samplePortfolio);
  } else {
    alert("Please fill out all the form fields to continue.");
  }
});

/*
// ✅ Form submission handler BY USING GEMINI API conected to backend
document.getElementById('investmentForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const capital = parseFloat(document.getElementById('capital').value);
  const timePeriod = document.getElementById('timePeriod').value;
  const roi = document.getElementById('roi').value;
  const riskTolerance = document.getElementById('riskTolerance').value;
  const investmentType = document.getElementById('investmentType').value;

  if (capital && timePeriod && roi && riskTolerance && investmentType) {
    const requestData = {
      capital,
      timePeriod,
      roi,
      riskTolerance,
      investmentType
    };

    appendMessage("Generating your AI portfolio... 📈", 'ai');

    fetch('https://investbirds.onrender.com/api/buildPortfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    })
      .then(res => res.json())
      .then(data => {
        renderPortfolio(data);
        appendMessage("Here’s your personalized portfolio based on your inputs 📊", 'ai');
      })
      .catch(err => {
        appendMessage("Something went wrong while fetching your portfolio ❌", 'ai');
        console.error(err);
      });
  } else {
    appendMessage("Please fill out all the form fields to continue.", 'ai');
  }
});
*/

// ✅ Portfolio renderer
function renderPortfolio(data) {
  const resultDiv = document.getElementById('portfolioResult');
  resultDiv.innerHTML = '';

  const table = document.createElement('table');
  table.className = 'table table-bordered table-dark text-light';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Asset</th>
        <th>Type</th>
        <th>Allocation (%)</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody id="portfolioBody"></tbody>
  `;

  resultDiv.appendChild(table);

  const tableBody = document.getElementById('portfolioBody');
  const labels = [];
  const allocations = [];
  const colors = [];

  data.portfolio.forEach((item, idx) => {
    const row = `
      <tr>
        <td>${item.asset}</td>
        <td>${item.type}</td>
        <td>${item.allocation}</td>
        <td>${item.notes}</td>
      </tr>
    `;
    tableBody.innerHTML += row;

    labels.push(item.asset);
    allocations.push(parseFloat(item.allocation));
    colors.push(getColor(idx));
  });

  renderChart(labels, allocations, colors);
}

// ✅ Render Doughnut Chart
function renderChart(labels, data, colors) {
  const existingCanvas = document.getElementById('portfolioChart');
  if (existingCanvas) existingCanvas.remove();

  const canvas = document.createElement('canvas');
  canvas.id = 'portfolioChart';
  canvas.className = 'mt-4';
  document.getElementById('portfolioResult').appendChild(canvas);

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderColor: '#000',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { color: 'white' } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ${ctx.raw}%`
          }
        }
      }
    }
  });
}

// ✅ Color generator
function getColor(i) {
  const palette = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#14b8a6', '#f97316'];
  return palette[i % palette.length];
}
