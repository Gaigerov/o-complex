// Проверяем, находимся ли мы в браузерном окружении
const isBrowser = typeof window !== 'undefined';

// Импортируем DOMPurify только в браузере
let DOMPurify = null;
if (isBrowser) {
  DOMPurify = require('dompurify');
}

export const sanitizeHtml = (html) => {
  if (!html) return { __html: '' };
  
  if (isBrowser && DOMPurify) {
    // Клиент: используем DOMPurify
    return { __html: DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4'],
      ALLOWED_ATTR: []
    }) };
  } else {
    // Сервер: простая очистка
    return { __html: html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
    };
  }
};
