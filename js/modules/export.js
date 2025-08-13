// Módulo de importação e exportação de dados
import { storage } from './storage.js';

export class ExportManager {

  getFormattedDate() {
    return new Date().toISOString().split('T')[0];
  }

  downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  exportToJson() {
    const data = {
      expenses: storage.getExpenses(),
      categories: storage.getCategories()
    };
    const fileName = `despesas-zen-backup-${this.getFormattedDate()}.json`;
    this.downloadFile(JSON.stringify(data, null, 2), fileName, 'application/json');
  }

  exportToCsv() {
    const expenses = storage.getExpenses();
    const categories = storage.getCategories();
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Data,Descrição,Categoria,Valor\r\n"; // Header

    expenses.forEach(expense => {
      const category = categories.find(c => c.id === expense.categoryId);
      const row = [
        expense.date,
        `"${expense.description}"`,
        `"${category ? category.name : 'N/A'}"`,
        expense.amount.toFixed(2).replace('.', ',')
      ].join(",");
      csvContent += row + "\r\n";
    });

    const fileName = `despesas-zen-extrato-${this.getFormattedDate()}.csv`;
    this.downloadFile(csvContent, fileName, 'text/csv');
  }
}