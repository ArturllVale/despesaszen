// Módulo de gerenciamento de dados no LocalStorage
const STORAGE_KEYS = {
  EXPENSES: 'zen_expenses',
  CATEGORIES: 'zen_categories',
  THEME: 'zen_theme'
};

const PREDEFINED_CATEGORIES = [
  { id: crypto.randomUUID(), name: 'Alimentação', color: '#6aa84f' }, // Verde-folha
  { id: crypto.randomUUID(), name: 'Transporte', color: '#e67e22' },  // Laranja vibrante
  { id: crypto.randomUUID(), name: 'Moradia', color: '#8e735b' },     // Marrom-terra
  { id: crypto.randomUUID(), name: 'Lazer', color: '#f1c40f' },       // Amarelo ensolarado
  { id: crypto.randomUUID(), name: 'Saúde', color: '#27ae60' },       // Verde-saúde
  { id: crypto.randomUUID(), name: 'Outros', color: '#7f8c8d' }       // Cinza neutro
];


export const storage = {
  initialize: () => {
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      storage.saveCategories(PREDEFINED_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
      storage.saveExpenses([]);
    }
  },

  // Funções genéricas
  getFromStorage: (key) => JSON.parse(localStorage.getItem(key)),
  saveToStorage: (key, data) => localStorage.setItem(key, JSON.stringify(data)),

  // Despesas
  getExpenses: () => storage.getFromStorage(STORAGE_KEYS.EXPENSES) || [],
  saveExpenses: (expenses) => storage.saveToStorage(STORAGE_KEYS.EXPENSES, expenses),

  // Categorias
  getCategories: () => storage.getFromStorage(STORAGE_KEYS.CATEGORIES) || [],
  saveCategories: (categories) => storage.saveToStorage(STORAGE_KEYS.CATEGORIES, categories),

  // Tema
  getTheme: () => localStorage.getItem(STORAGE_KEYS.THEME),
  saveTheme: (theme) => localStorage.setItem(STORAGE_KEYS.THEME, theme),

  // Limpar tudo
  clearAll: () => {
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  }
};