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

  getFilteredExpenses() {
    const expenses = storage.getExpenses();
    const filter = elements.timeFilterSelect.value;
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      switch (filter) {
        case 'day':
          return expenseDate.toDateString() === new Date().toDateString();
        case 'week':
          return expenseDate >= startOfWeek;
        case 'month':
        default:
          return expenseDate >= startOfMonth;
      }
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