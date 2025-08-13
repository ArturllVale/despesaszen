// Módulo para a funcionalidade de comparação de despesas
import { elements } from './dom-elements.js';
import { storage } from './storage.js';
import { utils } from './utils.js';

export class ComparisonManager {
  constructor() {
    elements.closeComparisonDialogBtn.addEventListener('click', () => this.closeComparisonDialog());
    elements.runComparisonBtn.addEventListener('click', () => this._runComparison());
  }

  openComparisonDialog() {
    this._populateSelectors();
    elements.comparisonDialog.classList.remove('hidden');
  }

  closeComparisonDialog() {
    elements.comparisonDialog.classList.add('hidden');
    elements.comparisonResultsContainer.innerHTML = ''; // Limpa os resultados ao fechar
  }

  _populateSelectors() {
    const expenses = storage.getExpenses();
    const uniqueYears = [...new Set(expenses.map(exp => new Date(exp.date.replace(/-/g, '\/')).getFullYear()))].sort((a, b) => b - a);
    const months = [
      { value: 0, name: 'Janeiro' }, { value: 1, name: 'Fevereiro' }, { value: 2, name: 'Março' },
      { value: 3, name: 'Abril' }, { value: 4, name: 'Maio' }, { value: 5, name: 'Junho' },
      { value: 6, name: 'Julho' }, { value: 7, name: 'Agosto' }, { value: 8, name: 'Setembro' },
      { value: 9, name: 'Outubro' }, { value: 10, name: 'Novembro' }, { value: 11, name: 'Dezembro' }
    ];

    const yearSelectors = [elements.compareYearA, elements.compareYearB];
    const monthSelectors = [elements.compareMonthA, elements.compareMonthB];

    yearSelectors.forEach(selector => {
      selector.innerHTML = '';
      uniqueYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        selector.appendChild(option);
      });
    });

    monthSelectors.forEach(selector => {
      selector.innerHTML = '';
      months.forEach(month => {
        const option = document.createElement('option');
        option.value = month.value;
        option.textContent = month.name;
        selector.appendChild(option);
      });
    });

    // Pré-selecionar datas
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    elements.compareYearA.value = lastMonth.getFullYear();
    elements.compareMonthA.value = lastMonth.getMonth();
    elements.compareYearB.value = now.getFullYear();
    elements.compareMonthB.value = now.getMonth();
  }

  _runComparison() {
    const yearA = elements.compareYearA.value;
    const monthA = elements.compareMonthA.value;
    const yearB = elements.compareYearB.value;
    const monthB = elements.compareMonthB.value;

    if (!yearA || !monthA || !yearB || !monthB) {
      utils.showNotification('Por favor, selecione ambos os períodos.', 'danger');
      return;
    }

    const reportA = this._getReportForPeriod(parseInt(yearA), parseInt(monthA));
    const reportB = this._getReportForPeriod(parseInt(yearB), parseInt(monthB));

    this._renderResults(reportA, reportB);
  }

  _getReportForPeriod(year, month) {
    const expenses = storage.getExpenses();
    const categories = storage.getCategories();
    const report = {
      total: 0,
      byCategory: {}
    };

    const periodExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date.replace(/-/g, '\/'));
      return expDate.getFullYear() === year && expDate.getMonth() === month;
    });

    periodExpenses.forEach(exp => {
      report.total += exp.amount;
      const category = categories.find(cat => cat.id === exp.categoryId);
      const categoryName = category ? category.name : 'Sem Categoria';
      if (!report.byCategory[categoryName]) {
        report.byCategory[categoryName] = 0;
      }
      report.byCategory[categoryName] += exp.amount;
    });

    return report;
  }

  _renderResults(reportA, reportB) {
    const allCategoryNames = [...new Set([...Object.keys(reportA.byCategory), ...Object.keys(reportB.byCategory)])].sort();

    const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' });
    const monthAName = monthFormatter.format(new Date(elements.compareYearA.value, elements.compareMonthA.value));
    const monthBName = monthFormatter.format(new Date(elements.compareYearB.value, elements.compareMonthB.value));

    let tableHTML = `
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Categoria</th>
            <th>${monthAName.charAt(0).toUpperCase() + monthAName.slice(1)} ${elements.compareYearA.value}</th>
            <th>${monthBName.charAt(0).toUpperCase() + monthBName.slice(1)} ${elements.compareYearB.value}</th>
            <th>Diferença</th>
          </tr>
        </thead>
        <tbody>
    `;

    allCategoryNames.forEach(name => {
      const amountA = reportA.byCategory[name] || 0;
      const amountB = reportB.byCategory[name] || 0;
      const difference = amountB - amountA;
      tableHTML += `
        <tr>
          <td>${name}</td>
          <td>${utils.formatCurrency(amountA)}</td>
          <td>${utils.formatCurrency(amountB)}</td>
          <td style="color: ${difference > 0 ? 'var(--accent-color)' : 'var(--primary-color)'}">${utils.formatCurrency(difference)}</td>
        </tr>
      `;
    });

    const totalDifference = reportB.total - reportA.total;
    tableHTML += `
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td>Total</td>
            <td>${utils.formatCurrency(reportA.total)}</td>
            <td>${utils.formatCurrency(reportB.total)}</td>
            <td style="color: ${totalDifference > 0 ? 'var(--accent-color)' : 'var(--primary-color)'}">${utils.formatCurrency(totalDifference)}</td>
          </tr>
        </tfoot>
      </table>
    `;

    elements.comparisonResultsContainer.innerHTML = tableHTML;
  }
}
