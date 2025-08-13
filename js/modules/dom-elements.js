// Módulo de mapeamento dos elementos do DOM
export const elements = {
  // Header e Ações
  addExpenseBtn: document.getElementById('add-expense-btn'),
  toggleDarkModeBtn: document.getElementById('toggle-dark-mode-btn'),
  menuBtn: document.getElementById('menu-btn'),
  menuDropdown: document.getElementById('menu-dropdown'),
  manageCategoriesBtn: document.getElementById('manage-categories-btn'),
  exportBtn: document.getElementById('export-btn'),
  clearDataBtn: document.getElementById('clear-data-btn'),
  installPwaBtn: document.getElementById('install-pwa-btn'),

  // Dashboard e Gráfico
  totalExpensesDisplay: document.getElementById('total-expenses-display'),
  categoryChart: document.getElementById('category-chart'),

  // Lista de Despesas
  timeFilterSelect: document.getElementById('time-filter-select'),
  expensesList: document.getElementById('expenses-list'),
  emptyState: document.getElementById('empty-state'),
  emptyStateAddBtn: document.getElementById('empty-state-add-btn'),

  // Diálogo de Adicionar/Editar Despesa
  addEditDialog: document.getElementById('add-edit-dialog'),
  dialogTitle: document.getElementById('dialog-title'),
  closeDialogBtn: document.getElementById('close-dialog-btn'),
  cancelDialogBtn: document.getElementById('cancel-dialog-btn'),
  addEditForm: document.getElementById('add-edit-form'),
  expenseIdInput: document.getElementById('expense-id'),
  expenseAmountInput: document.getElementById('expense-amount'),
  expenseDescriptionInput: document.getElementById('expense-description'),
  expenseCategorySelect: document.getElementById('expense-category'),
  expenseDateInput: document.getElementById('expense-date'),

  // Diálogo de Gerenciar Categorias
  manageCategoriesDialog: document.getElementById('manage-categories-dialog'),
  closeManageCategoriesDialogBtn: document.getElementById('close-manage-categories-dialog-btn'),
  addCategoryForm: document.getElementById('add-category-form'),
  categoryNameInput: document.getElementById('category-name-input'),
  categoriesList: document.getElementById('categories-list'),

  // Diálogo de Exportação
  exportDialog: document.getElementById('export-dialog'),
  closeExportDialogBtn: document.getElementById('close-export-dialog-btn'),
  exportJsonBtn: document.getElementById('export-json-btn'),
  exportCsvBtn: document.getElementById('export-csv-btn'),

  // Diálogo de Confirmação
  confirmDialog: document.getElementById('confirm-dialog'),
  confirmDialogTitle: document.getElementById('confirm-dialog-title'),
  confirmDialogMessage: document.getElementById('confirm-dialog-message'),
  closeConfirmDialogBtn: document.getElementById('close-confirm-dialog-btn'),
  cancelConfirmBtn: document.getElementById('cancel-confirm-btn'),
  confirmDeleteBtn: document.getElementById('confirm-delete-btn'),

  // Notificações
  notificationContainer: document.getElementById('notification-container'),
};