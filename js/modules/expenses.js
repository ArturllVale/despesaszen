// Módulo de gerenciamento de despesas
import { elements } from './dom-elements.js';
import { storage } from './storage.js';
import { utils } from './utils.js';
import { DialogManager } from './dialogs.js';

export class ExpenseManager {
  constructor(chartManager, categoryManager) {
    this.chartManager = chartManager;
    this.categoryManager = categoryManager;
    this.dialogManager = new DialogManager(); // Instancia o DialogManager
    elements.expensesList.addEventListener('click', (e) => this.handleExpenseClick(e));
  }

  saveExpense(expenseData) {
    let expenses = storage.getExpenses();
    const existingIndex = expenses.findIndex(exp => exp.id === expenseData.id);

    if (existingIndex > -1) {
      expenses[existingIndex] = expenseData;
    } else {
      expenses.push(expenseData);
    }
    storage.saveExpenses(expenses);
  }

  deleteExpense(expenseId) {
    let expenses = storage.getExpenses();
    expenses = expenses.filter(exp => exp.id !== expenseId);
    storage.saveExpenses(expenses);
    this.renderExpenses();
    utils.showNotification('Despesa excluída', 'danger');
  }

  renderMonthFilterOptions() {
    const expenses = storage.getExpenses();
    const uniqueMonths = new Set();

    expenses.forEach(expense => {
        const dateParts = expense.date.split('-');
        const expenseDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        const year = expenseDate.getFullYear();
        const month = expenseDate.getMonth();
        uniqueMonths.add(`${year}-${String(month + 1).padStart(2, '0')}`);
    });

    const sortedMonths = Array.from(uniqueMonths).sort().reverse();

    elements.timeFilterSelect.innerHTML = `
        <option value="month">Este Mês</option>
        <option value="week">Esta Semana</option>
        <option value="day">Hoje</option>
    `;

    const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
    const today = new Date();
    const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    sortedMonths.forEach(monthKey => {
        if (monthKey === currentMonthKey) {
            return;
        }

        const [year, month] = monthKey.split('-');
        const date = new Date(year, month - 1, 1);
        const option = document.createElement('option');
        option.value = monthKey;

        let label = monthFormatter.format(date);
        option.textContent = label.charAt(0).toUpperCase() + label.slice(1);

        elements.timeFilterSelect.appendChild(option);
    });
  }

  getFilteredExpenses() {
    const expenses = storage.getExpenses();
    const timeFilter = elements.timeFilterSelect.value;
    const categoryFilter = elements.categoryFilterSelect.value;
    const searchTerm = elements.searchInput.value.trim().toLowerCase();
    const today = new Date();
    const monthFilterRegex = /^\d{4}-\d{2}$/;

    // Pre-calculate date ranges to be more efficient
    let startDate, endDate;
    if (monthFilterRegex.test(timeFilter)) {
      const [year, month] = timeFilter.split('-').map(Number);
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 1);
    } else if (timeFilter === 'week') {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else if (timeFilter === 'month') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    return expenses.filter(expense => {
      // 1. Search check
      const searchMatch = searchTerm === '' || expense.description.toLowerCase().includes(searchTerm);
      if (!searchMatch) return false;

      // 2. Category check
      const categoryMatch = (categoryFilter === 'all') || (expense.categoryId === categoryFilter);
      if (!categoryMatch) return false;

      // 3. Time check
      const dateParts = expense.date.split('-');
      const expenseDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

      if (timeFilter === 'day') {
        return expenseDate.toDateString() === today.toDateString();
      }

      if (endDate) { // Specific month range
        return expenseDate >= startDate && expenseDate < endDate;
      }
      if (startDate) { // Open-ended range (week, month)
        return expenseDate >= startDate;
      }

      return true; // Should not happen with default filters
    });
  }

  renderExpenses() {
    const expenses = this.getFilteredExpenses();
    const categories = storage.getCategories();
    elements.expensesList.innerHTML = '';

    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (expenses.length === 0) {
      elements.emptyState.classList.remove('hidden');
      elements.expensesList.classList.add('hidden');
    } else {
      elements.emptyState.classList.add('hidden');
      elements.expensesList.classList.remove('hidden');
      expenses.forEach(expense => {
        const category = categories.find(cat => cat.id === expense.categoryId);
        const item = document.createElement('div');
        item.className = 'expense-item';
        item.dataset.id = expense.id;
        item.innerHTML = `
                    <div class="expense-category-color" style="background-color: ${category?.color || '#cccccc'}"></div>
                    <div class="expense-details">
                        <div class="expense-description">${expense.description}</div>
                        <div class="expense-meta">${category?.name || 'Sem Categoria'} · ${utils.formatDate(expense.date)}</div>
                    </div>
                    <div class="expense-amount" style="color: ${category?.color || '#cccccc'}">${utils.formatCurrency(expense.amount)}</div>
                `;
        elements.expensesList.appendChild(item);
      });
    }
    this.updateDashboard(expenses);
  }

  updateDashboard(expenses) {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    elements.totalExpensesDisplay.textContent = utils.formatCurrency(total);
    this.chartManager.renderChart(expenses);
  }

  handleExpenseClick(e) {
    const expenseItem = e.target.closest('.expense-item');
    if (expenseItem) {
      const expenseId = expenseItem.dataset.id;
      const expense = storage.getExpenses().find(exp => exp.id === expenseId);
      this.dialogManager.openExpenseDialog(expense, () => this.deleteExpense(expenseId));
    }
  }
}