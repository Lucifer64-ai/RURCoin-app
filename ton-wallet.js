Мой Волна, [03.10.2025 11:36]
// Интеграция с TON кошельком для транзакций и взаимодействия
class TONWalletIntegration {
    constructor() {
        this.connector = null;
        this.wallet = null;
        this.isConnected = false;
        this.init();
    }

    async init() {
        try {
            // Инициализация TON Connect[citation:10]
            this.connector = new TON_CONNECT_UI.TonConnectUI({
                manifestUrl: this.getManifestUrl(),
                buttonRootId: 'ton-connect'
            });

            // Проверка существующего подключения
            if (this.connector.connected) {
                this.wallet = this.connector.wallet;
                this.isConnected = true;
                this.onWalletConnected(this.wallet);
            }

            // Подписка на изменения статуса кошелька
            this.connector.onStatusChange(wallet => {
                if (wallet) {
                    this.wallet = wallet;
                    this.isConnected = true;
                    this.onWalletConnected(wallet);
                } else {
                    this.isConnected = false;
                    this.wallet = null;
                    this.onWalletDisconnected();
                }
            });

        } catch (error) {
            console.error('TON Wallet initialization failed:', error);
        }
    }

    getManifestUrl() {
        // URL к вашему manifest.json файлу
        return ${window.location.origin}/tonconnect-manifest.json;
    }

    onWalletConnected(wallet) {
        console.log('TON Wallet connected:', wallet);
        
        // Обновление UI
        if (window.app && window.app.onWalletConnected) {
            window.app.onWalletConnected(wallet);
        }
        
        // Отправка аналитики
        if (window.rurcoinAPI) {
            window.rurcoinAPI.sendAnalytics('wallet_connected', {
                walletType: wallet.device.appName,
                walletAddress: wallet.account.address
            });
        }
    }

    onWalletDisconnected() {
        console.log('TON Wallet disconnected');
        
        // Обновление UI
        if (window.app && window.app.onWalletDisconnected) {
            window.app.onWalletDisconnected();
        }
        
        // Отправка аналитики
        if (window.rurcoinAPI) {
            window.rurcoinAPI.sendAnalytics('wallet_disconnected', {});
        }
    }

    // Отправка транзакции для покупки нефтяной вышки[citation:10]
    async buyOilRig(rigType, cost) {
        if (!this.isConnected) {
            throw new Error('Wallet not connected');
        }

        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 360, // 6 минут
            messages: [
                {
                    address: 'UQAfEl3NlWxvs9pNcuszZeBa5sSGfgrfCFsmp9kc-_ZGy-xF',
                    amount: this.toNano(cost).toString()
                }
            ]
        };

        try {
            const result = await this.connector.sendTransaction(transaction);
            
            // Отправка аналитики об успешной транзакции
            if (window.rurcoinAPI) {
                window.rurcoinAPI.sendAnalytics('oil_rig_purchased', {
                    rigType,
                    cost,
                    transactionHash: result.boc
                });
            }
            
            return result;
        } catch (error) {
            console.error('Transaction failed:', error);
            
            // Отправка аналитики о неудачной транзакции
            if (window.rurcoinAPI) {
                window.rurcoinAPI.sendAnalytics('transaction_failed', {
                    rigType,
                    cost,
                    error: error.message
                });
            }
            
            throw error;
        }
    }

    // Отправка транзакции для активации VIP статуса
    async buyVIPStatus(cost = 50) {
        if (!this.isConnected) {
            throw new Error('Wallet not connected');
        }

Мой Волна, [03.10.2025 11:36]
const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 360,
            messages: [
                {
                    address: 'UQAfEl3NlWxvs9pNcuszZeBa5sSGfgrfCFsmp9kc-_ZGy-xF',
                    amount: this.toNano(cost).toString()
                }
            ]
        };

        try {
            const result = await this.connector.sendTransaction(transaction);
            
            // Обновление статуса VIP на сервере
            if (window.rurcoinAPI && this.wallet) {
                await window.rurcoinAPI.activateVIP(
                    this.wallet.account.address, 
                    result.boc
                );
            }
            
            return result;
        } catch (error) {
            console.error('VIP purchase failed:', error);
            throw error;
        }
    }

    // Начало фарминга (начальный взнос)
    async startFarming(cost = 2) {
        if (!this.isConnected) {
            throw new Error('Wallet not connected');
        }

        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 360,
            messages: [
                {
                    address: 'UQAfEl3NlWxvs9pNcuszZeBa5sSGfgrfCFsmp9kc-_ZGy-xF',
                    amount: this.toNano(cost).toString()
                }
            ]
        };

        return await this.connector.sendTransaction(transaction);
    }

    // Конвертация TON в нанотоны (1 TON = 1,000,000,000 нанотон)
    toNano(amount) {
        return BigInt(Math.floor(amount * 1000000000));
    }

    // Конвертация нанотон в TON
    fromNano(amount) {
        return Number(amount) / 1000000000;
    // Получение баланса кошелька
    async getBalance() {
        if (!this.isConnected || !this.wallet) {
            return 0;
        }

        try {
            // Здесь можно интегрировать с TON API для получения реального баланса
            // Временная заглушка
            return 15.5;
        } catch (error) {
            console.error('Error getting balance:', error);
            return 0;
        }
    }

    // Декодирование адреса для красивого отображения
    formatAddress(address, startLength = 4, endLength = 4) {
        if (!address) return '';
        return ${address.substring(0, startLength)}...${address.substring(address.length - endLength)};
    }

    // Отключение кошелька
    async disconnect() {
        if (this.connector) {
            await this.connector.disconnect();
        }
    }
}

// Инициализация интеграции с кошельком
document.addEventListener('DOMContentLoaded', () => {
    window.tonWallet = new TONWalletIntegration();
});