class FinalIntegrationTest {
    constructor(adaptiveController) {
        this.controller = adaptiveController;
        this.testResults = [];
        this.startTime = null;
    }

    async runFullSystemValidation() {
        this.log('🎯 Starting Final Integration Test...');
        this.startTime = Date.now();
        this.testResults = [];

        await this.testSystemInitialization();
        await this.testAllPatternExecution();
        await this.testSafetyMechanisms();
        await this.testPrioritySystem();
        await this.testErrorRecovery();
        await this.testMemoryManagement();
        await this.testDocumentationAccuracy();

        this.reportFinalResults();
        return this.testResults.every(r => r.passed);
    }

    async testSystemInitialization() {
        this.log('Testing system initialization...');
        
        const hasController = !!this.controller;
        const hasReliabilityManager = !!this.controller.reliabilityManager;
        const hasSignalInterpreter = !!this.controller.signalInterpreter;
        const hasUIMutator = !!this.controller.uiMutator;
        const isInitialized = this.controller.initialized;

        const passed = hasController && hasReliabilityManager && hasSignalInterpreter && hasUIMutator && isInitialized;

        this.testResults.push({
            test: 'System Initialization',
            passed,
            details: `Controller: ${hasController}, Reliability: ${hasReliabilityManager}, Initialized: ${isInitialized}`
        });
    }

    async testAllPatternExecution() {
        this.log('Testing all pattern execution...');
        
        this.controller.reliabilityManager.reset();
        await this.wait(100);

        const patterns = ['undo-loop', 'hover-repeat', 'dwell', 'backtrack', 'fast-action'];
        const results = [];

        for (const pattern of patterns) {
            const result = await this.controller.processSignal(pattern, { targetId: 0 });
            results.push(result);
            await this.wait(1200);
        }

        const allExecuted = results.every(r => r === true);
        const passed = allExecuted && results.length === 5;

        this.testResults.push({
            test: 'All Pattern Execution',
            passed,
            details: `Executed: ${results.filter(r => r).length}/5 patterns`
        });
    }

    async testSafetyMechanisms() {
        this.log('Testing safety mechanisms...');
        
        this.controller.reliabilityManager.reset();
        await this.wait(50);

        const rapidSignals = [];
        for (let i = 0; i < 10; i++) {
            rapidSignals.push(this.controller.processSignal('undo-loop', { targetId: 0 }));
        }

        const results = await Promise.all(rapidSignals);
        const processedCount = results.filter(r => r).length;
        const isThrottled = this.controller.isThrottled('undo-loop');

        const passed = processedCount === 1 && isThrottled;

        this.testResults.push({
            test: 'Safety Mechanisms',
            passed,
            details: `Processed: ${processedCount}/10, Throttled: ${isThrottled}`
        });

        await this.wait(1100);
    }

    async testPrioritySystem() {
        this.log('Testing priority system...');
        
        this.controller.reliabilityManager.reset();
        await this.wait(50);

        await this.controller.processSignal('dwell', { targetId: 0 });
        await this.wait(100);
        await this.controller.processSignal('undo-loop', { targetId: 1 });
        await this.wait(200);

        const state = this.controller.getExecutionState();
        const lastProcessed = state.lastProcessed?.type;
        const passed = lastProcessed === 'undo-loop';

        this.testResults.push({
            test: 'Priority System',
            passed,
            details: `Higher priority signal executed: ${lastProcessed}`
        });

        await this.wait(1100);
    }

    async testErrorRecovery() {
        this.log('Testing error recovery...');
        
        try {
            await this.controller.processSignal('invalid-signal', { targetId: 999 });
            await this.controller.processSignal('undo-loop', { targetId: 0 });
            
            const state = this.controller.getExecutionState();
            const passed = state.lastProcessed?.type === 'undo-loop';

            this.testResults.push({
                test: 'Error Recovery',
                passed,
                details: `System recovered from invalid signal`
            });
        } catch (error) {
            this.testResults.push({
                test: 'Error Recovery',
                passed: false,
                details: `Error handling failed: ${error.message}`
            });
        }

        await this.wait(1100);
    }

    async testMemoryManagement() {
        this.log('Testing memory management...');
        
        const initialState = this.controller.getExecutionState();
        
        for (let i = 0; i < 5; i++) {
            this.controller.reliabilityManager.reset();
            await this.controller.processSignal('dwell', { targetId: i % 6 });
            await this.wait(200);
        }

        const finalState = this.controller.getExecutionState();
        const queueCleared = finalState.queueLength === 0;
        const noMemoryLeaks = finalState.throttledSignals.length <= 5;

        const passed = queueCleared && noMemoryLeaks;

        this.testResults.push({
            test: 'Memory Management',
            passed,
            details: `Queue cleared: ${queueCleared}, Throttle map size: ${finalState.throttledSignals.length}`
        });
    }

    async testDocumentationAccuracy() {
        this.log('Testing documentation accuracy...');
        
        const configMatches = this.controller.config.throttleDuration === 1000;
        const patternsExist = Object.keys(this.controller.adaptationPatterns).length === 5;
        const adaptationMapExists = Object.keys(this.controller.adaptationMap).length === 5;

        const passed = configMatches && patternsExist && adaptationMapExists;

        this.testResults.push({
            test: 'Documentation Accuracy',
            passed,
            details: `Config: ${configMatches}, Patterns: ${patternsExist}, Map: ${adaptationMapExists}`
        });
    }

    reportFinalResults() {
        const duration = Date.now() - this.startTime;
        this.log('🏁 FINAL INTEGRATION TEST RESULTS:');
        
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        
        this.testResults.forEach(result => {
            const status = result.passed ? '✅' : '❌';
            this.log(`${status} ${result.test}: ${result.details}`);
        });
        
        this.log(`⏱️ Test Duration: ${duration}ms`);
        this.log(`🎯 Final Score: ${passed}/${total} tests passed`);
        
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

window.FinalIntegrationTest = FinalIntegrationTest;