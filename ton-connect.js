// TON Connect интеграция
class TONConnectIntegration {
    constructor() {
        this.connector = null;
        this.connected = false;
        this.walletInfo = null;
        this.init();
    }

    async init() {
        // Инициализация TON Connect
        this.connector = new TON_CONNECT_UI.TonConnect({
            manifestUrl: 'https://yourdomain.com/tonconnect-manifest.json'
        });

        // Проверяем, подключен ли уже кошелек
        if (this.connector.connected) {
            this.walletInfo = this.connector.wallet;
            this.connected = true;
            this.onWalletConnected(this.walletInfo);
        }

        // Подписываемся на события изменения статуса подключения
        this.connector.onStatusChange(wallet => {
            if (wallet) {
                this.connected = true;
                this.walletInfo = wallet;
                this.onWalletConnected(wallet);
            } else {
                this.connected = false;
                this.walletInfo = null;
                this.onWalletDisconnected();
            }
        });
    }

    onWalletConnected(wallet) {
        console.log('Кошелек подключен:', wallet);
        document.getElementById('walletInfo').style.display = 'block';
        document.getElementById('walletAddress').textContent = this.formatAddress(wallet.account.address);
        
        // Обновляем баланс
        this.updateBalance();
        
        // Показываем информацию о подключении
        document.getElementById('connectedInfo').style.display = 'block';
        document.getElementById('connectWalletBtn').style.display = 'none';
        
        // Уведомляем основное приложение
        if (window.app) {
            window.app.onWalletConnected(wallet);
        }
    }

    onWalletDisconnected() {
        console.log('Кошелек отключен');
        document.getElementById('walletInfo').style.display = 'none';
        document.getElementById('connectedInfo').style.display = 'none';
        document.getElementById('connectWalletBtn').style.display = 'block';
        
        // Уведомляем основное приложение
        if (window.app) {
            window.app.onWalletDisconnected();
        }
    }

    formatAddress(address) {
        if (!address) return '';
        return address.substring(0, 4) + '...' + address.substring(address.length - 4);
    }

    async updateBalance() {
        if (!this.connected || !this.walletInfo) return;
        
        try {
            // Здесь будет запрос к TON API для получения баланса
            // Пока используем заглушку
            const balance = '15.5';
            document.getElementById('walletBalance').textContent = balance;
            document.getElementById('connectedBalance').textContent = balance;
        } catch (error) {
            console.error('Ошибка получения баланса:', error);
        }
    }

    async sendTransaction(transaction) {
        if (!this.connected) {
            throw new Error('Кошелек не подключен');
        }

        try {
            const result = await this.connector.sendTransaction(transaction);
            return result;
        } catch (error) {
            console.error('Ошибка транзакции:', error);
            throw error;
        }
    }

    disconnect() {
        if (this.connector) {
            this.connector.disconnect();
        }
    }
}

// Инициализация TON Connect при загрузке страницы
let tonConnect;
document.addEventListener('DOMContentLoaded', function() {
    tonConnect = new TONConnectIntegration();
});