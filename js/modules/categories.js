// Módulo de gerenciamento de categorias
import { elements } from './dom-elements.js';
import { storage } from './storage.js';
import { utils } from './utils.js';

const CATEGORY_COLORS = ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#277da1'];

export class CategoryManager {
  constructor() {
    elements.categoriesList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-category-btn')) {
        this.deleteCategory(e.target.dataset.id);
      }
    });
  }

  addCategory(name) {
    const categories = storage.getCategories();
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
      utils.showNotification('Categoria já existe!', 'danger');
      return;
    }

    // Atribui uma cor do array de cores de forma cíclica
    const color = CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length];

    const newCategory = { id: crypto.randomUUID(), name, color };
    categories.push(newCategory);
    storage.saveCategories(categories);
    this.renderCategoriesList();
    this.renderCategoryOptions();
  }

  deleteCategory(categoryId) {
    let categories = storage.getCategories();
    // Não permitir excluir a última categoria
    if (categories.length <= 1) {
      utils.showNotification('Não é possível excluir a última categoria.', 'danger');
      return;
    }
    categories = categories.filter(cat => cat.id !== categoryId);
    storage.saveCategories(categories);
    this.renderCategoriesList();
    this.renderCategoryOptions();
  }

  renderCategoriesList() {
    const categories = storage.getCategories();
    elements.categoriesList.innerHTML = '';
    categories.forEach(category => {
      const item = document.createElement('div');
      item.className = 'category-item';
      item.innerHTML = `
                <span>${category.name}</span>
                <button class="delete-category-btn" data-id="${category.id}">&times;</button>
            `;
      elements.categoriesList.appendChild(item);
    });
  }

  renderCategoryOptions() {
    const categories = storage.getCategories();
    elements.expenseCategorySelect.innerHTML = '';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      elements.expenseCategorySelect.appendChild(option);
    });
  }

  renderCategoryFilterOptions() {
    const categories = storage.getCategories();
    elements.categoryFilterSelect.innerHTML = '<option value="all">Todas as categorias</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      elements.categoryFilterSelect.appendChild(option);
    });
  }
}