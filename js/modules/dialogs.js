// Módulo de gerenciamento de diálogos
import { elements } from './dom-elements.js';
import { CategoryManager } from './categories.js';

export class DialogManager {
  constructor() {
    this.categoryManager = new CategoryManager();
    this.addEventListeners();
  }

  addEventListeners() {
    // Botões de fechar genéricos
    const closeButtons = [
      elements.closeDialogBtn, elements.cancelDialogBtn,
      elements.closeManageCategoriesDialogBtn, elements.closeExportDialogBtn,
      elements.closeConfirmDialogBtn, elements.cancelConfirmBtn
    ];
    closeButtons.forEach(btn => btn?.addEventListener('click', () => this.closeAllDialogs()));

    // Fechar ao clicar fora
    document.querySelectorAll('.dialog').forEach(dialog => {
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) this.closeAllDialogs();
      });
    });
  }

  closeAllDialogs() {
    document.querySelectorAll('.dialog').forEach(dialog => dialog.classList.add('hidden'));
  }

  openExpenseDialog(expense = null, onDelete = null) {
    this.categoryManager.renderCategoryOptions();
    elements.addEditForm.reset();

    if (expense) {
      elements.dialogTitle.textContent = 'Editar Despesa';
      elements.expenseIdInput.value = expense.id;
      elements.expenseAmountInput.value = expense.amount;
      elements.expenseDescriptionInput.value = expense.description;
      elements.expenseCategorySelect.value = expense.categoryId;
      elements.expenseDateInput.value = expense.date;

      // Adicionar botão de exclusão
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = 'Excluir';
      deleteBtn.className = 'button danger';
      deleteBtn.style.marginRight = 'auto'; // Alinha à esquerda
      deleteBtn.onclick = () => {
        this.closeAllDialogs();
        this.openConfirmDialog('Excluir esta despesa?', onDelete);
      };

      // Limpa botões antigos antes de adicionar
      elements.addEditForm.querySelector('.dialog-footer .danger')?.remove();
      elements.addEditForm.querySelector('.dialog-footer').prepend(deleteBtn);

    } else {
      elements.dialogTitle.textContent = 'Adicionar Despesa';
      elements.expenseDateInput.valueAsDate = new Date();
      // Remove o botão de exclusão se existir
      elements.addEditForm.querySelector('.dialog-footer .danger')?.remove();
    }

    elements.addEditDialog.classList.remove('hidden');
  }

  openCategoryDialog() {
    this.categoryManager.renderCategoriesList();
    elements.manageCategoriesDialog.classList.remove('hidden');
  }

  openExportDialog() {
    elements.exportDialog.classList.remove('hidden');
  }

  openConfirmDialog(message, onConfirm) {
    elements.confirmDialogMessage.textContent = message;
    elements.confirmDeleteBtn.onclick = () => {
      onConfirm();
      this.closeAllDialogs();
    };
    elements.confirmDialog.classList.remove('hidden');
  }

  closeExpenseDialog() {
    elements.addEditDialog.classList.add('hidden');
  }
}