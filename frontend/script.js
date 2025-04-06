<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
const chatBox = document.getElementById('chatBox');

// ✅ AI chat message appender
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

// ✅ AI auto-reply logic
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

// ✅ Manual chat input handler
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
document.getElementById('investmentForm').addEventListener('submit', function(e) {
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

// ✅ Portfolio rendering with table + chart
function renderPortfolio(data) {
  const tableBody = document.getElementById('portfolioBody');
  tableBody.innerHTML = '';

  if (!Array.isArray(data.portfolio) || data.portfolio.length === 0) {
    appendMessage("⚠️ No portfolio data returned. Please try different inputs.", 'ai');
    return;
  }

  const labels = [];
  const allocations = [];
  const colors = [];

  data.portfolio.forEach((item, idx) => {
    const row = `
      <tr>
        <td>${item.asset || 'N/A'}</td>
        <td>${item.type || 'N/A'}</td>
        <td>${item.allocation || 'N/A'}</td>
        <td>${item.notes || '—'}</td>
      </tr>`;
    tableBody.innerHTML += row;

    labels.push(item.asset);
    allocations.push(parseFloat(item.allocation));
    colors.push(getColor(idx));
  });

  document.getElementById('portfolioTable').classList.remove('d-none');
  renderChart(labels, allocations, colors);
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ✅ Chart renderer
function renderChart(labels, data, colors) {
  const canvasId = 'portfolioChart';
  let canvas = document.getElementById(canvasId);
  if (!canvas) {
    const chartContainer = document.createElement('div');
    chartContainer.innerHTML = `<canvas id="${canvasId}" class="mt-4"></canvas>`;
    document.getElementById('portfolioTable').appendChild(chartContainer);
  } else {
    canvas.remove(); // re-render chart
    renderChart(labels, data, colors);
    return;
  }

  new Chart(document.getElementById(canvasId), {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: 'Portfolio Allocation',
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
        tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.raw}%` } }
      }
    }
  });
}

// ✅ Color generator
function getColor(i) {
  const palette = ['#6366f1','#f59e0b','#10b981','#ef4444','#3b82f6','#8b5cf6','#14b8a6','#f97316'];
  return palette[i % palette.length];
}
</script>
