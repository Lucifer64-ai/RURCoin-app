Мой Волна, [03.10.2025 11:41]
class RURCoinApp {
    constructor() {
        this.wallet = null;
        this.walletAddress = null;
        this.userBalance = 0;
        this.userRURCBalance = 0;
        this.isFarming = false;
        this.termsAccepted = false;
        this.priceChart = null;
        this.currentChartInterval = '24h';
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUserData();
        this.initPriceChart();
        this.loadRURCPriceData();
        
        // Загрузка данных каждые 30 секунд
        setInterval(() => {
            this.loadRURCPriceData();
        }, 30000);
    }

    bindEvents() {
        // Переключение вкладок
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Чекбокс соглашения
        document.getElementById('agreeTerms').addEventListener('change', (e) => {
            document.getElementById('acceptTermsBtn').disabled = !e.target.checked;
        });

        // Кнопки временного интервала графика
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const interval = e.currentTarget.getAttribute('data-interval');
                this.switchChartInterval(interval);
            });
        });
    }

    // Методы для работы с TON Connect
    onWalletConnected(wallet) {
        this.wallet = wallet;
        this.walletAddress = wallet.account.address;
        this.updateWalletDisplay();
        this.showNotification('TON кошелек успешно подключен!', 'success');
    }

    onWalletDisconnected() {
        this.wallet = null;
        this.walletAddress = null;
        this.isFarming = false;
        this.saveUserData();
        this.showNotification('TON кошелек отключен', 'info');
    }

    updateWalletDisplay() {
        if (this.walletAddress) {
            document.getElementById('walletInfo').style.display = 'block';
            document.getElementById('walletAddress').textContent = this.formatAddress(this.walletAddress);
            document.getElementById('connectedInfo').style.display = 'block';
        }
    }

    formatAddress(address) {
        if (!address) return '';
        return address.substring(0, 4) + '...' + address.substring(address.length - 4);
    }

    // Остальные методы из предыдущей реализации...
    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(tabName + 'Tab').classList.add('active');
        document.querySelector([data-tab="${tabName}"]).classList.add('active');

        if (tabName === 'info') {
            this.loadRURCPriceData();
        }
    }

    showTermsModal() {
        if (!this.walletAddress) {
            this.showNotification('Сначала подключите TON кошелек', 'error');
            return;
        }
        
        document.getElementById('termsModal').classList.add('active');
    }

    acceptTerms() {
        this.termsAccepted = true;
        document.getElementById('termsModal').classList.remove('active');
        this.startFarming();
    }

    declineTerms() {
        document.getElementById('termsModal').classList.remove('active');
        this.showNotification('Для участия в фарминге необходимо принять соглашение', 'info');
    }

    async startFarming() {
        if (!this.termsAccepted) {
            this.showTermsModal();
            return;
        }

        try {
            this.showTransactionModal('Инициализация фарминга...');

Мой Волна, [03.10.2025 11:41]
// Реальная транзакция через TON Connect
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 360, // 6 минут
                messages: [
                    {
                        address: 'UQAfEl3NlWxvs9pNcuszZeBa5sSGfgrfCFsmp9kc-_ZGy-xF', // Адрес для оплаты
                        amount: '2000000000', // 2 TON в нанотонах
                    }
                ]
            };

            const result = await tonConnect.sendTransaction(transaction);
            
            this.isFarming = true;
            this.saveUserData();
            
            document.getElementById('startFarmingSection').style.display = 'none';
            document.getElementById('farmingMain').style.display = 'block';
            
            this.closeTransactionModal();
            this.showNotification('Фарминг успешно начат!', 'success');
            
            this.startOilProduction();
            
        } catch (error) {
            this.closeTransactionModal();
            this.showNotification('Ошибка при запуске фарминга: ' + error.message, 'error');
            console.error('Farming error:', error);
        }
    }

    async buyOilRig(rigType) {
        if (!this.isFarming) {
            this.showNotification('Сначала начните фарминг', 'error');
            return;
        }

        const rigs = {
            1: { cost: 0.5, name: 'Старая качалка' },
            2: { cost: 1.5, name: 'Буровая установка' },
            3: { cost: 4, name: 'Морская платформа' }
        };

        const rig = rigs[rigType];

        try {
            this.showTransactionModal(Покупка ${rig.name}...);
            
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 360,
                messages: [
                    {
                        address: 'UQAfEl3NlWxvs9pNcuszZeBa5sSGfgrfCFsmp9kc-_ZGy-xF',
                        amount: String(rig.cost * 1000000000), // Конвертируем в нанотоны
                    }
                ]
            };

            const result = await tonConnect.sendTransaction(transaction);
            this.addOilRig(rigType);
            
            this.closeTransactionModal();
            this.showNotification(${rig.name} успешно приобретена!, 'success');
            
        } catch (error) {
            this.closeTransactionModal();
            this.showNotification('Ошибка при покупке вышки: ' + error.message, 'error');
        }
    }

    // Остальные методы (addOilRig, startOilProduction, initPriceChart, и т.д.)
    // остаются такими же, как в предыдущей реализации...

    showNotification(message, type = 'info') {
        // Реализация уведомлений...
    }

    saveUserData() {
        const userData = {
            walletAddress: this.walletAddress,
            userBalance: this.userBalance,
            userRURCBalance: this.userRURCBalance,
            isFarming: this.isFarming,
            termsAccepted: this.termsAccepted
        };
        localStorage.setItem('rurcoin_user_data', JSON.stringify(userData));
    }

    loadUserData() {
        const saved = localStorage.getItem('rurcoin_user_data');
        if (saved) {
            const userData = JSON.parse(saved);
            this.walletAddress = userData.walletAddress;
            this.userBalance = userData.userBalance;
            this.userRURCBalance = userData.userRURCBalance;
            this.isFarming = userData.isFarming;
            this.termsAccepted = userData.termsAccepted;

            if (this.walletAddress) {
                this.updateWalletDisplay();
            }

            if (this.isFarming) {
                document.getElementById('startFarmingSection').style.display = 'none';
                document.getElementById('farmingMain').style.display = 'block';
            }
        }
    }
}

Мой Волна, [03.10.2025 11:41]
// Стили для анимаций уведомлений
const style = document.createElement('style');
style.textContent = 
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
;
document.head.appendChild(style);

// Инициализация приложения
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new RURCoinApp();
});