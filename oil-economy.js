class OilEconomy {
    constructor() {
        this.hasPaidEntry = false;
        this.totalOilPool = 1000000;
        this.baseExchangeRate = 0.01;
        this.totalOilExtracted = 0;
        this.userOilStorage = 0;
        this.userOilProduction = 0;
        this.rigSlots = {
            1: { unlocked: true, rig: null, barrel: { currentOil: 0, capacity: 0 } },
            2: { unlocked: false, rig: null, barrel: { currentOil: 0, capacity: 0 } },
            3: { unlocked: false, rig: null, barrel: { currentOil: 0, capacity: 0 } }
        };
        this.vipStatus = {
            isActive: false,
            purchasedAt: null
        };
        this.lastHarvestTime = Date.now();
    }

    calculateOilProduction() {
        const now = Date.now();
        const secondsPassed = (now - this.lastHarvestTime) / 1000;
        
        if (secondsPassed > 0 && this.userOilProduction > 0) {
            let productionMultiplier = 1;
            if (this.vipStatus.isActive) {
                productionMultiplier *= 1.1;
            }

            Object.values(this.rigSlots).forEach(slot => {
                if (slot.rig && slot.barrel) {
                    const productionPerSecond = slot.rig.production / 3600;
                    const oilProduced = productionPerSecond * secondsPassed * productionMultiplier;
                    const availableSpace = slot.barrel.capacity - slot.barrel.currentOil;
                    const actualProduction = Math.min(oilProduced, availableSpace);
                    
                    slot.barrel.currentOil += actualProduction;
                }
            });
            this.lastHarvestTime = now;
        }
    }

    calculateTotalProduction() {
        let totalProduction = 0;
        Object.values(this.rigSlots).forEach(slot => {
            if (slot.rig) {
                totalProduction += slot.rig.production;
            }
        });
        this.userOilProduction = totalProduction;
        return totalProduction;
    }

    calculateExchangeRate() {
        const poolRatio = this.oilEconomy.totalOilPool / 1000000;
        return this.oilEconomy.baseExchangeRate / poolRatio;
    }

    buyOilRig(rigType, slot) {
        // Логика покупки и установки нефтяной вышки
        const rig = this.oilRigTypes[rigType];
        if (!slot.rig) {
            slot.rig = {
                type: rigType,
                name: rig.name,
                production: rig.production,
                icon: rig.icon
            };
            slot.barrel = {
                currentOil: 0,
                capacity: rig.baseCapacity
            };
            this.calculateTotalProduction();
            return true;
        }
        return false;
    }

    activateVip() {
        this.vipStatus.isActive = true;
        this.vipStatus.purchasedAt = new Date().toISOString();
        Object.values(this.rigSlots).forEach(slot => {
            if (slot.barrel) {
                slot.barrel.capacity = Math.floor(slot.barrel.capacity * 1.5);
            }
        });
    }
}

// Конфигурация вышек
OilEconomy.prototype.oilRigTypes = {
    1: { name: "Старая качалка", production: 50, cost: 0.1, icon: "🛢️", baseCapacity: 1000 },
    2: { name: "Буровая установка", production: 120, cost: 0.3, icon: "⛏️", baseCapacity: 2500 },
    3: { name: "Морская платформа", production: 300, cost: 0.8, icon: "🌊", baseCapacity: 6000 }
};