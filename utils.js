Мой Волна, [03.10.2025 11:39]
// Утилиты и вспомогательные функции для RURCoin
class RURCoinUtils {
    constructor() {
        this.developmentMode = this.isDevelopment();
    }

    // Проверка режима разработки
    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('ngrok') ||
               window.location.hostname.includes('codesandbox');
    }

    // Форматирование чисел с разделителями тысяч
    formatNumber(number, decimals = 2) {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    }

    // Форматирование денежных значений
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 5
        }).format(amount);
    }

    // Форматирование TON значений
    formatTON(amount) {
        return ${this.formatNumber(amount)} TON;
    }

    // Форматирование RURC значений
    formatRURC(amount) {
        return ${this.formatNumber(amount)} RURC;
    }

    // Генерация случайной строки[citation:5]
    generateRandomString(length = 32) {
        const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }

    // Получение текущей даты и времени[citation:5]
    getCurrentDateTime(format = 'full') {
        const now = new Date();
        
        const formats = {
            'YMD': () => {
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                return ${year}-${month}-${day};
            },
            'full': () => {
                const date = this.getCurrentDateTime('YMD');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                return ${date} ${hours}:${minutes}:${seconds};
            },
            'time': () => {
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                return ${hours}:${minutes};
            }
        };

        return formats[format] ? formats[format]() : formats['full']();
    }

    // Валидация TON адреса
    isValidTONAddress(address) {
        if (!address) return false;
        
        // Базовые проверки TON адреса
        const tonAddressRegex = /^[0-9a-zA-Z_-]{48}$/;
        return tonAddressRegex.test(address);
    }

    // Копирование текста в буфер обмена
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback для старых браузеров
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            }
        } catch (error) {
            console.error('Copy failed:', error);
            return false;
        }
    }

Мой Волна, [03.10.2025 11:39]
// Обработка ошибок API[citation:5]
    handleApiError(error, context = '') {
        console.error(API Error in ${context}:, error);
        
        const errorMessage = this.getErrorMessage(error);
        
        // Показ уведомления пользователю
        if (window.rurcoinUI && window.rurcoinUI.showToast) {
            window.rurcoinUI.showToast(
                Ошибка ${context}: ${errorMessage}, 
                'error'
            );
        }
        
        // Отправка аналитики
        if (window.rurcoinAPI) {
            window.rurcoinAPI.sendAnalytics('api_error', {
                context,
                error: errorMessage,
                timestamp: this.getCurrentDateTime()
            });
        }
        
        return errorMessage;
    }

    // Получение понятного сообщения об ошибке[citation:5]
    getErrorMessage(error) {
        if (error.response) {
            // Ошибка HTTP
            switch (error.response.status) {
                case 400: return 'Неверный запрос';
                case 401: return 'Не авторизован';
                case 403: return 'Доступ запрещен';
                case 404: return 'Ресурс не найден';
                case 408: return 'Таймаут запроса';
                case 500: return 'Ошибка сервера';
                case 502: return 'Проблемы с сетью';
                case 503: return 'Сервис недоступен';
                default: return Ошибка ${error.response.status};
            }
        } else if (error.request) {
            // Ошибка сети
            return 'Проблемы с подключением к сети';
        } else {
            // Другие ошибки
            return error.message || 'Неизвестная ошибка';
        }
    }

    // Сохранение в LocalStorage с обработкой ошибок
    setLocalStorage(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('LocalStorage set failed:', error);
            return false;
        }
    }

    // Чтение из LocalStorage с обработкой ошибок
    getLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('LocalStorage get failed:', error);
            return defaultValue;
        }
    }

    // Удаление из LocalStorage
    removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('LocalStorage remove failed:', error);
            return false;
        }
    }

    // Очистка устаревших данных
    cleanupExpiredData() {
        const now = Date.now();
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('temp_')) {
                try {
                    const item = localStorage.getItem(key);
                    const data = JSON.parse(item);
                    
                    if (data.expires && data.expires < now) {
                        keysToRemove.push(key);
                    }
                } catch (error) {
                    // Если данные повреждены, удаляем ключ
                    keysToRemove.push(key);
                }
            }
        }
        
        keysToRemove.forEach(key => this.removeLocalStorage(key));
    }

    // Анимация подсветки элемента
    highlightElement(elementId, color = '#ffd700', duration = 2000) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const originalBackground = element.style.backgroundColor;
        element.style.transition = 'background-color 0.5s ease';
        element.style.backgroundColor = color;
        
        setTimeout(() => {
            element.style.backgroundColor = originalBackground;
        }, duration);
    }

Мой Волна, [03.10.2025 11:39]
// Проверка поддержки браузером современных функций
    checkBrowserCompatibility() {
        const features = {
            serviceWorker: 'serviceWorker' in navigator,
            fetch: 'fetch' in window,
            promise: 'Promise' in window,
            crypto: 'crypto' in window && 'subtle' in window.crypto,
            indexedDB: 'indexedDB' in window,
            webAssembly: 'WebAssembly' in window
        };

        const unsupported = Object.keys(features).filter(key => !features[key]);
        
        if (unsupported.length > 0 && this.developmentMode) {
            console.warn('Unsupported features:', unsupported);
        }
        
        return features;
    }

    // Задержка выполнения
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Создание хэша строки (упрощенный вариант)
    async createHash(str) {
        if (window.crypto && crypto.subtle) {
            const encoder = new TextEncoder();
            const data = encoder.encode(str);
            const hash = await crypto.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(hash))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        } else {
            // Fallback для старых браузеров
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16);
        }
    }
}

// Инициализация утилит
document.addEventListener('DOMContentLoaded', () => {
    window.utils = new RURCoinUtils();
    
    // Очистка устаревших данных при загрузке
    window.utils.cleanupExpiredData();
    
    // Проверка совместимости браузера
    const compatibility = window.utils.checkBrowserCompatibility();
    
    if (!compatibility.serviceWorker) {
        console.warn('Service Worker не поддерживается в этом браузере');
    }
});