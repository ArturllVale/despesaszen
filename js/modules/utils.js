// Módulo de funções utilitárias
import { elements } from './dom-elements.js';
import { storage } from './storage.js';

export const utils = {
  // Formata um número para moeda brasileira
  formatCurrency: (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  },

  // Formata a data para exibição (dd/mm/aaaa)
  formatDate: (dateString) => {
    const date = new Date(dateString);
    // Adiciona o fuso horário para corrigir a data
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString('pt-BR');
  },

  // Exibe uma notificação na tela
  showNotification: (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    elements.notificationContainer.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('fade-out');
      notification.addEventListener('transitionend', () => notification.remove());
    }, 3000);
  },

  // Alterna o modo escuro/claro
  toggleDarkMode: () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    storage.saveTheme(newTheme);
  },

  // Aplica o tema salvo no carregamento
  applyTheme: () => {
    const savedTheme = storage.getTheme();
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }
};