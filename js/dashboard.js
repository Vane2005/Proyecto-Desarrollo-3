// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
    loadMetrics();
});

async function loadMetrics() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const metricsContainer = document.getElementById('metrics-container');
    const errorMessage = document.getElementById('error-message');

    // Mostrar loader
    loadingSpinner.style.display = 'block';
    metricsContainer.style.display = 'none';
    errorMessage.style.display = 'none';

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8087/dashboard/metrics', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log('Datos del dashboard:', data);

        populateMetrics(data);

        loadingSpinner.style.display = 'none';
        metricsContainer.style.display = 'block';
        errorMessage.style.display = 'none';

    } catch (error) {
        console.error('Error al cargar las métricas:', error);

        loadingSpinner.style.display = 'none';
        metricsContainer.style.display = 'none';
        errorMessage.style.display = 'block';

        const errorText = document.getElementById('error-text');
        let errorMsg = error.message;

        if (error.message.includes('Failed to fetch')) {
            errorMsg = 'No se pudo conectar al servidor. Verifica que el backend de Spring Boot está corriendo en http://localhost:8087';
        } else if (error.message.includes('HTTP')) {
            errorMsg = `Error del servidor: ${error.message}`;
        }

        errorText.textContent = errorMsg;
    }
}

function populateMetrics(data) {
    const ticketsSold = data.totalTicketsSold ?? 0;
    document.getElementById('ticketsSold').textContent = ticketsSold.toLocaleString();

    const totalRevenue = data.totalRevenue ?? 0;
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);

    const validatedTickets = data.validatedTickets ?? 0;
    document.getElementById('validatedTickets').textContent = validatedTickets.toLocaleString();

    const pendingTickets = data.pendingTickets ?? 0;
    document.getElementById('pendingTickets').textContent = pendingTickets.toLocaleString();

    const abandonedPurchases = data.abandonedPurchases ?? 0;
    document.getElementById('abandonedPurchases').textContent = abandonedPurchases.toLocaleString();

    const peakSalesHour = data.peakSalesHour ?? '-';
    document.getElementById('peakSalesHour').textContent = formatHour(peakSalesHour);

    populateAbandonedByStep(data.abandonedByStep);

    calculateSummary(data, ticketsSold, abandonedPurchases);

    updateLastUpdate();
}

function populateAbandonedByStep(abandonedByStep) {
    const container = document.getElementById('abandonedByStep');

    if (!abandonedByStep || Object.keys(abandonedByStep).length === 0) {
        container.innerHTML = '<p class="metric-label" style="margin: 1rem 0;">Sin datos disponibles</p>';
        return;
    }

    let html = '';
    for (const [step, count] of Object.entries(abandonedByStep)) {
        html += `
            <div class="step-item">
                <span class="step-name">${formatStepName(step)}</span>
                <span class="step-count">${count}</span>
            </div>
        `;
    }

    container.innerHTML = html;
}

function calculateSummary(data, ticketsSold, abandonedPurchases) {
    const totalAttempts = ticketsSold + abandonedPurchases;

    let conversionRate = '-';
    if (totalAttempts > 0) {
        conversionRate = ((ticketsSold / totalAttempts) * 100).toFixed(2) + '%';
    }
    document.getElementById('conversionRate').textContent = conversionRate;

    let abandonmentRate = '-';
    if (totalAttempts > 0) {
        abandonmentRate = ((abandonedPurchases / totalAttempts) * 100).toFixed(2) + '%';
    }
    document.getElementById('abandonmentRate').textContent = abandonmentRate;
}

function updateLastUpdate() {
    const now = new Date();
    const timeString = now.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    document.getElementById('lastUpdate').textContent = timeString;
}

function formatCurrency(value) {
    if (typeof value === 'string') {
        return value;
    }

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatHour(hour) {
    if (typeof hour === 'number') {
        return `${String(hour).padStart(2, '0')}:00`;
    }
    return hour;
}

function formatStepName(step) {
    const stepNames = {
        'cart': 'Carrito',
        'checkout': 'Pago',
        'confirmation': 'Confirmación',
        'payment': 'Procesamiento de Pago',
        'cart_abandoned': 'Carrito Abandonado',
        'checkout_abandoned': 'Pago Abandonado',
        'payment_abandoned': 'Pago Fallido'
    };

    return stepNames[step] || step.charAt(0).toUpperCase() + step.slice(1);
}

function refreshMetrics() {
    loadMetrics();
}

setInterval(refreshMetrics, 300000);
