// Módulo de gerenciamento do PWA
import { elements } from './dom-elements.js';

export class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.init();
  }

  init() {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('Service worker registrado:', reg))
          .catch(err => console.log('Erro no registro do Service worker:', err));
      });
    }

    // Gerenciar prompt de instalação
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      if (elements.installPwaBtn) {
        elements.installPwaBtn.style.display = 'flex';
        elements.installPwaBtn.addEventListener('click', () => this.installPWA());
      }
    });
  }

  async installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        this.deferredPrompt = null;
        if (elements.installPwaBtn) {
          elements.installPwaBtn.style.display = 'none';
        }
      }
    }
  }
}