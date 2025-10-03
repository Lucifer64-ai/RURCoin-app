Мой Волна, [03.10.2025 10:48]
// API для взаимодействия с бэкенд сервером RURCoin
class RURCoinAPI {
    constructor() {
        this.baseURL = 'https://api.your-rurcoin-domain.com/v1';
        this.token = localStorage.getItem('auth_token');
    }

    async request(endpoint, options = {}) {
        const url = ${this.baseURL}${endpoint};
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers.Authorization = Bearer ${this.token};
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(HTTP error! status: ${response.status});
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Получение данных пользователя
    async getUserData(walletAddress) {
        return this.request(/users/${walletAddress});
    }

    // Обновление баланса RURCoin
    async updateRURCBalance(walletAddress, newBalance) {
        return this.request(/users/${walletAddress}/balance, {
            method: 'PUT',
            body: JSON.stringify({ balance: newBalance })
        });
    }

    // Получение истории транзакций
    async getTransactionHistory(walletAddress, limit = 50) {
        return this.request(/transactions/${walletAddress}?limit=${limit});
    }

    // Регистрация новой нефтяной вышки
    async registerOilRig(walletAddress, rigData) {
        return this.request(/oil-rigs, {
            method: 'POST',
            body: JSON.stringify({
                walletAddress,
                ...rigData
            })
        });
    }

    // Обмен нефти на RURCoin
    async exchangeOilForRURC(walletAddress, oilAmount) {
        return this.request(/exchange/oil-to-rurc, {
            method: 'POST',
            body: JSON.stringify({
                walletAddress,
                oilAmount
            })
        });
    }

    // Получение текущих цен
    async getMarketPrices() {
        return this.request('/market/prices');
    }

    // Проверка статуса VIP
    async getVIPStatus(walletAddress) {
        return this.request(/vip/status/${walletAddress});
    }

    // Активация VIP статуса
    async activateVIP(walletAddress, transactionHash) {
        return this.request(/vip/activate, {
            method: 'POST',
            body: JSON.stringify({
                walletAddress,
                transactionHash
            })
        });
    }

    // Получение статистики пула
    async getPoolStatistics() {
        return this.request('/pool/statistics');
    }

    // Отправка аналитики[citation:1]
    async sendAnalytics(event, data) {
        try {
            return this.request('/analytics', {
                method: 'POST',
                body: JSON.stringify({
                    event,
                    data,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            // Сохраняем аналитику для повторной отправки позже
            this.queueFailedAnalytics(event, data);
        }
    }

    // Очередь неудачных аналитических запросов
    queueFailedAnalytics(event, data) {
        const queue = JSON.parse(localStorage.getItem('analytics_queue') || '[]');
        queue.push({
            event,
            data,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('analytics_queue', JSON.stringify(queue));
    }

    // Повторная отправка неудачных запросов
    async retryFailedAnalytics() {
        const queue = JSON.parse(localStorage.getItem('analytics_queue') || '[]');

Мой Волна, [03.10.2025 10:48]
for (const item of queue) {
            try {
                await this.sendAnalytics(item.event, item.data);
                // Удаляем из очереди при успешной отправке
                const newQueue = queue.filter(q => q.timestamp !== item.timestamp);
                localStorage.setItem('analytics_queue', JSON.stringify(newQueue));
            } catch (error) {
                console.error('Failed to retry analytics:', error);
            }
        }
    }
}

// Симуляция API для разработки (заглушки)
class MockRURCoinAPI extends RURCoinAPI {
    constructor() {
        super();
        this.mockData = {
            userBalance: 1500.75,
            oilAmount: 1250.50,
            oilRigs: [
                { id: 1, type: 'basic', production: 50, capacity: 1000 },
                { id: 2, type: 'advanced', production: 120, capacity: 2500 }
            ],
            transactions: [],
            vipStatus: false
        };
    }

    async request(endpoint, options = {}) {
        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
        
        // Заглушки для различных эндпоинтов
        if (endpoint.includes('/users/') && options.method !== 'PUT') {
            return {
                success: true,
                data: {
                    walletAddress: endpoint.split('/').pop(),
                    balance: this.mockData.userBalance,
                    oilAmount: this.mockData.oilAmount,
                    oilRigs: this.mockData.oilRigs,
                    vipStatus: this.mockData.vipStatus
                }
            };
        }

        if (endpoint.includes('/balance') && options.method === 'PUT') {
            const body = JSON.parse(options.body || '{}');
            this.mockData.userBalance = body.balance;
            return { success: true };
        }

        if (endpoint === '/exchange/oil-to-rurc') {
            const body = JSON.parse(options.body || '{}');
            const exchangedAmount = body.oilAmount * 0.01; // 1 литр = 0.01 RURC
            this.mockData.oilAmount -= body.oilAmount;
            this.mockData.userBalance += exchangedAmount;
            
            return {
                success: true,
                data: {
                    exchangedAmount,
                    newBalance: this.mockData.userBalance,
                    remainingOil: this.mockData.oilAmount
                }
            };
        }

        if (endpoint === '/market/prices') {
            return {
                success: true,
                data: {
                    rurc: 0.02064,
                    ton: 2.45,
                    exchangeRate: 0.01
                }
            };
        }

        return { success: true, data: {} };
    }
}

// Использование mock API в development, реального API в production
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

window.rurcoinAPI = isDevelopment ? new MockRURCoinAPI() : new RURCoinAPI();