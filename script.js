Мой Волна, [03.10.2025 10:47]
// Дополнительные функции для пользовательского интерфейса
class RURCoinUI {
    constructor() {
        this.initEventListeners();
        this.updateRealTimeData();
    }

    initEventListeners() {
        // Обработчики для улучшения пользовательского опыта
        this.initSmoothScrolling();
        this.initTooltips();
        this.initMobileMenu();
    }

    initSmoothScrolling() {
        // Плавная прокрутка для якорей
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initTooltips() {
        // Инициализация подсказок для элементов
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip);
            element.addEventListener('mouseleave', this.hideTooltip);
        });
    }

    showTooltip(e) {
        const tooltipText = this.getAttribute('data-tooltip');
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = 
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            white-space: nowrap;
        ;
        
        document.body.appendChild(tooltip);
        this.tooltipElement = tooltip;
        this.positionTooltip(e);
    }

    positionTooltip(e) {
        const rect = this.getBoundingClientRect();
        const tooltip = this.tooltipElement;
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
    }

    hideTooltip() {
        if (this.tooltipElement) {
            document.body.removeChild(this.tooltipElement);
            this.tooltipElement = null;
        }
    }

    initMobileMenu() {
        // Адаптивное меню для мобильных устройств
        const menuToggle = document.createElement('button');
        menuToggle.innerHTML = '☰';
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.style.cssText = 
            display: none;
            position: fixed;
            top: 15px;
            right: 15px;
            z-index: 1000;
            background: #ffd700;
            border: none;
            border-radius: 5px;
            padding: 10px;
            font-size: 1.2em;
        ;

        document.body.appendChild(menuToggle);

        // Проверка мобильного устройства и добавление функционала
        if (window.innerWidth <= 768) {
            menuToggle.style.display = 'block';
            this.setupMobileMenu(menuToggle);
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                menuToggle.style.display = 'block';
            } else {
                menuToggle.style.display = 'none';
                const tabsNav = document.querySelector('.tabs-navigation');
                if (tabsNav) {
                    tabsNav.style.display = '';
                }
            }
        });
    }

    setupMobileMenu(menuToggle) {
        menuToggle.addEventListener('click', () => {
            const tabsNav = document.querySelector('.tabs-navigation');
            if (tabsNav) {
                const isVisible = tabsNav.style.display !== 'none';
                tabsNav.style.display = isVisible ? 'none' : 'block';

Мой Волна, [03.10.2025 10:47]
if (!isVisible) {
                    tabsNav.style.cssText += 
                        position: fixed;
                        top: 60px;
                        left: 0;
                        right: 0;
                        background: #1a1a2e;
                        z-index: 999;
                        padding: 10px;
                    ;
                }
            }
        });
    }

    updateRealTimeData() {
        // Обновление данных в реальном времени
        setInterval(() => {
            this.updateOilProduction();
            this.updateTokenPrices();
        }, 5000); // Обновление каждые 5 секунд
    }

    updateOilProduction() {
        // Обновление показателей добычи нефти
        const barrels = document.querySelectorAll('.barrel-item');
        barrels.forEach(barrel => {
            const productionRate = parseFloat(barrel.dataset.production) || 0;
            const currentAmount = parseFloat(barrel.dataset.amount) || 0;
            const capacity = parseFloat(barrel.dataset.capacity) || 1;
            
            // Симуляция добычи (в реальном приложении это будет приходить с сервера)
            const newAmount = Math.min(currentAmount + (productionRate / 3600), capacity);
            barrel.dataset.amount = newAmount;
            
            // Обновление прогресс-бара
            const progressFill = barrel.querySelector('.progress-fill');
            const progressText = barrel.querySelector('.progress-text');
            
            if (progressFill) {
                const percentage = (newAmount / capacity) * 100;
                progressFill.style.width = percentage + '%';
            }
            
            if (progressText) {
                progressText.textContent = ${newAmount.toFixed(2)}/${capacity} л;
            }
        });
    }

    async updateTokenPrices() {
        try {
            // В реальном приложении здесь будет запрос к API
            const mockPriceData = {
                rurc: 0.02064 + (Math.random() - 0.5) * 0.001,
                ton: 2.5 + (Math.random() - 0.5) * 0.1
            };
            
            // Обновление элементов на странице
            const priceElement = document.getElementById('rurcPriceLive');
            if (priceElement) {
                priceElement.textContent = $${mockPriceData.rurc.toFixed(5)};
            }
        } catch (error) {
            console.error('Ошибка обновления цен:', error);
        }
    }

    // Показ уведомлений
    static showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = toast toast-${type};
        toast.textContent = message;
        toast.style.cssText = 
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : 
                        type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            border: 2px solid #ffd700;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        ;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
}

// Стили для анимаций
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }

Мой Волна, [03.10.2025 10:47]
to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .tooltip {
        pointer-events: none;
    }
    
    @media (max-width: 768px) {
        .tabs-navigation {
            flex-direction: column;
        }
        
        .tab-btn {
            margin-bottom: 5px;
        }
    }
`;
document.head.appendChild(toastStyles);

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.rurcoinUI = new RURCoinUI();
});