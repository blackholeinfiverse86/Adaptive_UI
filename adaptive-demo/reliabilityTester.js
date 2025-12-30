class ReliabilityTester {
    constructor(adaptiveController) {
        this.controller = adaptiveController;
        this.testResults = [];
    }

    async runReliabilityTests() {
        this.log('🔧 Starting Reliability Tests...');
        this.testResults = [];

        await this.testSignalQueueing();
        await this.testThrottleConsistency();
        await this.testConcurrentSignalHandling();
        await this.testDebounceRobustness();
        await this.testExecutionDeterminism();

        this.reportReliabilityResults();
    }

    async testSignalQueueing() {
        this.log('Testing signal queuing...');
        
        this.controller.reliabilityManager.reset();
        await this.wait(50);
        
        const signals = ['undo-loop', 'hover-repeat', 'dwell', 'fast-action'];
        const promises = signals.map(signal => 
            this.controller.processSignal(signal, { targetId: 0 })
        );
        
        const results = await Promise.all(promises);
        await this.wait(300);
        
        const state = this.controller.getExecutionState();
        const processedCount = results.filter(r => r).length;
        const passed = processedCount === 4 && state.lastProcessed !== null;
        
        this.testResults.push({
            test: 'Signal Queuing',
            passed,
            details: `Processed: ${processedCount}/4, Last: ${state.lastProcessed?.type || 'none'}`
        });
        
        await this.wait(1100);
    }

    async testThrottleConsistency() {
        this.log('Testing throttle consistency...');
        
        this.controller.reliabilityManager.reset();
        await this.wait(50);
        
        const result1 = await this.controller.processSignal('undo-loop', { targetId: 0 });
        
        const result2 = await this.controller.processSignal('undo-loop', { targetId: 0 });
        
        const isThrottled = this.controller.isThrottled('undo-loop');
        const passed = result1 && !result2 && isThrottled;
        
        this.testResults.push({
            test: 'Throttle Consistency',
            passed,
            details: `First: ${result1}, Second: ${result2}, Throttled: ${isThrottled}`
        });
        
        await this.wait(1100);
    }

    async testConcurrentSignalHandling() {
        this.log('Testing concurrent signal handling...');
        
        this.controller.reliabilityManager.reset();
        await this.wait(50);
        
        const concurrentSignals = [
            this.controller.processSignal('undo-loop', { targetId: 0 }),
            this.controller.processSignal('hover-repeat', { targetId: 1 }),
            this.controller.processSignal('dwell', { targetId: 2 }),
            this.controller.processSignal('backtrack', { targetId: 3 }),
            this.controller.processSignal('fast-action', { targetId: 4 })
        ];
        
        const results = await Promise.all(concurrentSignals);
        await this.wait(300);
        
        const state = this.controller.getExecutionState();
        const processedCount = results.filter(r => r).length;
        const passed = processedCount === 5 && state.lastProcessed !== null && !state.isProcessing;
        
        this.testResults.push({
            test: 'Concurrent Signal Handling',
            passed,
            details: `Processed: ${processedCount}/5, Queue: ${state.queueLength}, Processing: ${state.isProcessing}`
        });
        
        await this.wait(1100);
    }

    async testDebounceRobustness() {
        this.log('Testing debounce robustness...');
        
        this.controller.reliabilityManager.reset();
        await this.wait(50);
        
        const results = [];
        for (let i = 0; i < 5; i++) {
            const result = await this.controller.processSignal('hover-repeat', { targetId: 0 });
            results.push(result);
            await this.wait(20);
        }
        
        await this.wait(200);
        
        const state = this.controller.getExecutionState();
        const processedCount = results.filter(r => r).length;
        const passed = processedCount === 1 && state.lastProcessed?.type === 'hover-repeat';
        
        this.testResults.push({
            test: 'Debounce Robustness',
            passed,
            details: `Processed: ${processedCount}/5, Last: ${state.lastProcessed?.type || 'none'}`
        });
        
        await this.wait(1100);
    }

    async testExecutionDeterminism() {
        this.log('Testing execution determinism...');
        
        const results = [];
        
        for (let run = 0; run < 3; run++) {
            this.controller.reliabilityManager.reset();
            
            await this.controller.processSignal('undo-loop', { targetId: 0 });
            await this.wait(100);
            await this.controller.processSignal('dwell', { targetId: 1 });
            await this.wait(200);
            
            const state = this.controller.getExecutionState();
            results.push(state.lastProcessed?.type);
            
            await this.wait(1200);
        }
        
        const allSame = results.every(result => result === results[0]);
        
        this.testResults.push({
            test: 'Execution Determinism',
            passed: allSame,
            details: `Results: ${results.join(', ')}`
        });
    }

    reportReliabilityResults() {
        this.log('📊 RELIABILITY TEST RESULTS:');
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        
        this.testResults.forEach(result => {
            const status = result.passed ? '✅' : '❌';
            this.log(`${status} ${result.test}: ${result.details}`);
        });
        
        this.log(`🎯 Reliability Score: ${passed}/${total} tests passed`);
        
        if (passed === total) {
            this.log('🎉 All reliability tests PASSED! System is deterministic.');
        } else {
            this.log('⚠️ Reliability issues detected. Review failed tests.');
        }
    }

    log(message) {
        if (window.adaptiveUI && window.adaptiveUI.log) {
            window.adaptiveUI.log(message);
        } else {
            console.log(message);
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.ReliabilityTester = ReliabilityTester;