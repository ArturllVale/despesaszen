// Arquivo principal da aplicação Despesas Zen
import { elements } from './modules/dom-elements.js';
import { storage } from './modules/storage.js';
import { utils } from './modules/utils.js';
import { CategoryManager } from './modules/categories.js';
import { ExpenseManager } from './modules/expenses.js';
import { DialogManager } from './modules/dialogs.js';
import { ChartManager } from './modules/charts.js';
import { ExportManager } from './modules/export.js';
import { PWAManager } from './modules/pwa.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Gerenciadores
  const categoryManager = new CategoryManager();
  const chartManager = new ChartManager();
  const expenseManager = new ExpenseManager(chartManager, categoryManager);
  const dialogManager = new DialogManager();
  const exportManager = new ExportManager();
  const pwaManager = new PWAManager();

  // --- Event Listeners Principais ---

  // Botões de Ação
  elements.addExpenseBtn.addEventListener('click', () => dialogManager.openExpenseDialog());
  elements.emptyStateAddBtn.addEventListener('click', () => dialogManager.openExpenseDialog());

  // Menu Dropdown
  elements.menuBtn.addEventListener('click', () => elements.menuDropdown.classList.toggle('hidden'));
  document.addEventListener('click', (e) => {
    if (!elements.menuBtn.contains(e.target) && !elements.menuDropdown.contains(e.target)) {
      elements.menuDropdown.classList.add('hidden');
    }
  });

  // Ações do Menu
  elements.manageCategoriesBtn.addEventListener('click', () => dialogManager.openCategoryDialog());
  elements.exportBtn.addEventListener('click', function () {
    dialogManager.openExportDialog();
    elements.menuDropdown.classList.add('hidden'); // Fechar o menu após a seleção
  });
  elements.clearDataBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja apagar TODOS os dados? Esta ação não pode ser desfeita.')) {
      storage.clearAll();
      init();
      utils.showNotification('Dados apagados com sucesso', 'danger');
    }
  });
  elements.toggleDarkModeBtn.addEventListener('click', utils.toggleDarkMode);

  // Filtros
  elements.searchInput.addEventListener('input', () => expenseManager.renderExpenses());
  elements.timeFilterSelect.addEventListener('change', () => expenseManager.renderExpenses());
  elements.categoryFilterSelect.addEventListener('change', () => expenseManager.renderExpenses());

  // --- Diálogos ---

  // Diálogo de Despesa
  elements.addEditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const expenseData = {
      id: elements.expenseIdInput.value || crypto.randomUUID(),
      amount: parseFloat(elements.expenseAmountInput.value),
      description: elements.expenseDescriptionInput.value.trim(),
      categoryId: elements.expenseCategorySelect.value,
      date: elements.expenseDateInput.value,
    };
    expenseManager.saveExpense(expenseData);
    dialogManager.closeExpenseDialog();
    utils.showNotification(elements.expenseIdInput.value ? 'Despesa atualizada!' : 'Despesa adicionada!', 'success');
    init();
  });

  // Diálogo de Categorias
  elements.addCategoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = elements.categoryNameInput.value.trim();
    if (name) {
      categoryManager.addCategory(name);
      elements.categoryNameInput.value = '';
    }
  });

  // Diálogo de Exportação
  elements.exportJsonBtn.addEventListener('click', () => exportManager.exportToJson());
  elements.exportCsvBtn.addEventListener('click', () => exportManager.exportToCsv());

  // --- Inicialização ---
  function init() {
    utils.applyTheme();
    storage.initialize();
    categoryManager.renderCategoriesList();
    categoryManager.renderCategoryOptions();
    categoryManager.renderCategoryFilterOptions();
    expenseManager.renderMonthFilterOptions();
    expenseManager.renderExpenses();
  }

  init();
});