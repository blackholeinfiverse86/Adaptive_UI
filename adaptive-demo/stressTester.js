class StressTester {
    constructor(adaptiveController) {
        this.controller = adaptiveController;
        this.isRunning = false;
        this.testResults = [];
    }


    log(message) {
        if (window.adaptiveUI && window.adaptiveUI.log) {
            window.adaptiveUI.log(message);
        } else {
            console.log(message);
        }
    }


    async testRapidClicks() {
        this.log('🔥 Testing rapid clicks...');
        const signals = ['undo-loop', 'dwell', 'hover-repeat', 'fast-action'];
        
        for (let i = 0; i < 10; i++) {
            const signal = signals[i % signals.length];
            await this.controller.processSignal(signal, { targetId: i % 6 });
            await this.wait(50);
        }
        
        return this.verifyNoVisualChaos();
    }


    async testUndoSpamming() {
        this.log('🔥 Testing undo spamming...');
        
        for (let i = 0; i < 15; i++) {
            await this.controller.processSignal('undo-loop', { targetId: 0 });
            await this.wait(100);
        }
        
        return this.verifyThrottling();
    }


    async testLongIdleDwell() {
        this.log('🔥 Testing long idle dwell...');
        

        this.controller.processSignal('dwell', { targetId: 2 });
        await this.wait(6000);
        
        return this.verifyCleanup();
    }


    async testScrollHoverOverlap() {
        this.log('🔥 Testing scroll + hover overlap...');
        
        await this.controller.processSignal('dwell', { targetId: 1 });
        await this.wait(500);
        await this.controller.processSignal('hover-repeat', { targetId: 3 });
        await this.wait(500);
        await this.controller.processSignal('backtrack', { targetId: 5 });
        
        await this.wait(200);
        
        return this.verifySingleAdaptation();
    }


    async runAllTests() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.testResults = [];

        this.log('🚀 Starting stress tests...');
        
        try {
            this.testResults.push(await this.testRapidClicks());
            await this.wait(2000);
            
            this.testResults.push(await this.testUndoSpamming());
            await this.wait(2000);
            
            this.testResults.push(await this.testLongIdleDwell());
            await this.wait(2000);
            
            this.testResults.push(await this.testScrollHoverOverlap());
            
            this.reportResults();
        } finally {
            this.isRunning = false;
        }
    }


    verifyNoVisualChaos() {
        const activeTiles = document.querySelectorAll('.tile[class*="main-action"], .tile[class*="relevant"], .tile[class*="dimmed"], .tile[class*="focused"]');
        const result = activeTiles.length <= 6;
        const message = `✓ Visual chaos check: ${result ? 'PASS' : 'FAIL'} (${activeTiles.length} active effects)`;
        this.log(message);
        return { test: 'Visual Chaos', passed: result, details: `${activeTiles.length} active effects` };
    }


    verifyThrottling() {
        const isThrottled = this.controller.isThrottled('undo-loop');
        const message = `✓ Throttling check: ${isThrottled ? 'PASS' : 'FAIL'}`;
        this.log(message);
        return { test: 'Throttling', passed: isThrottled, details: 'Signal properly throttled' };
    }


    verifyCleanup() {
        const hasActiveEffects = document.querySelector('.tile[class*="relevant-pulse"]');
        const result = !hasActiveEffects;
        const message = `✓ Cleanup check: ${result ? 'PASS' : 'FAIL'}`;
        this.log(message);
        return { test: 'Cleanup', passed: result, details: 'Effects properly cleaned up' };
    }


    verifySingleAdaptation() {
        const activeAdaptation = this.controller.state.activeAdaptation;
        const result = activeAdaptation !== null;
        const message = `✓ Single adaptation check: ${result ? 'PASS' : 'FAIL'} (Active: ${activeAdaptation})`;
        this.log(message);
        return { test: 'Single Adaptation', passed: result, details: `Active: ${activeAdaptation}` };
    }


    reportResults() {
        this.log('📊 STRESS TEST RESULTS:');
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        
        this.testResults.forEach(result => {
            const message = `${result.passed ? '✅' : '❌'} ${result.test}: ${result.details}`;
            this.log(message);
        });
        
        this.log(`🎯 Overall: ${passed}/${total} tests passed`);
        
        if (passed === total) {
            this.log('🎉 All stress tests PASSED! System is stable.');
        } else {
            this.log('⚠️ Some tests failed. System needs stabilization.');
        }
    }


    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class RaceConditionPreventer {
    constructor() {
        this.pendingOperations = new Map();
    }


    async executeWithLock(key, operation) {
        if (this.pendingOperations.has(key)) {
            return this.pendingOperations.get(key);
        }

        const promise = operation();
        this.pendingOperations.set(key, promise);
        
        try {
            const result = await promise;
            return result;
        } finally {
            this.pendingOperations.delete(key);
        }
    }
}

window.StressTester = StressTester;
window.RaceConditionPreventer = RaceConditionPreventer;