// Módulo de gerenciamento de gráficos
import { elements } from './dom-elements.js';
import { storage } from './storage.js';

export class ChartManager {
  constructor() {
    this.chart = null;
  }

  renderChart(filteredExpenses) {
    const categories = storage.getCategories();
    const dataByCat = categories.map(cat => {
      const total = filteredExpenses
        .filter(exp => exp.categoryId === cat.id)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return { name: cat.name, total: total, color: cat.color };
    }).filter(item => item.total > 0);

    const chartData = {
      labels: dataByCat.map(item => item.name),
      datasets: [{
        data: dataByCat.map(item => item.total),
        backgroundColor: dataByCat.map(item => item.color),
        borderWidth: 0,
      }]
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(elements.categoryChart, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        animation: {
          duration: 500
        }
      }
    });
  }
}