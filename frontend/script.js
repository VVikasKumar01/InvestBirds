const chatBox = document.getElementById('chatBox');

// ✅ Append chat messages
function appendMessage(content, sender = 'user') {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message', sender === 'user' ? 'user-message' : 'ai-message');

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble');
  bubble.innerText = content;

  messageDiv.appendChild(bubble);
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ✅ Simulate AI replies
function getAIResponse(message) {
  message = message.toLowerCase();
  if (message.includes('risk')) return "Let's assess your risk tolerance. Are you low, medium, or high risk?";
  if (message.includes('capital')) return "What's the amount you plan to invest? 💰";
  if (message.includes('time')) return "What's your investment time horizon—short, medium, or long-term?";
  if (message.includes('stocks') || message.includes('mutual funds') || message.includes('gold')) {
    return "Great choice! I'll pull the top picks in that category for you shortly. 📊";
  }
  return "Got it! Let's keep going—tell me more or fill in the form to build your portfolio.";
}

// ✅ Chat send handler
function sendMessage() {
  const userInput = document.getElementById('userInput');
  const message = userInput.value.trim();
  if (message === '') return;
  appendMessage(message, 'user');
  userInput.value = '';

  setTimeout(() => {
    const reply = getAIResponse(message);
    appendMessage(reply, 'ai');
  }, 800);
}

// ✅ Form submission handler
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

// ✅ Portfolio renderer
function renderPortfolio(data) {
  const resultDiv = document.getElementById('portfolioResult');
  resultDiv.innerHTML = '';

  if (!Array.isArray(data.portfolio) || data.portfolio.length === 0) {
    appendMessage("⚠️ No portfolio data returned. Please try different inputs.", 'ai');
    return;
  }

  const table = document.createElement('table');
  table.className = 'table table-bordered mt-4';
  table.innerHTML = `
    <thead class="table-light">
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
        <td>${item.asset || 'N/A'}</td>
        <td>${item.type || 'N/A'}</td>
        <td>${item.allocation || 0}</td>
        <td>${item.notes || '—'}</td>
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
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
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
