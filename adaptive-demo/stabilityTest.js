class StabilityTest {
    constructor(adaptiveController) {
        this.controller = adaptiveController;
        this.isRunning = false;
        this.startTime = null;
        this.metrics = {
            signalsProcessed: 0,
            adaptationsApplied: 0,
            errorsEncountered: 0,
            memorySnapshots: []
        };
    }

    async runLongDurationTest() {
        if (this.isRunning) return;
        
        this.log('🔋 Starting Long-Duration Stability Test...');
        this.isRunning = true;
        this.startTime = Date.now();
        this.resetMetrics();

        try {
            await this.runContinuousLoad();
            this.reportStabilityResults();
        } finally {
            this.isRunning = false;
        }
    }

    async runContinuousLoad() {
        const testDuration = 30000;
        const signalInterval = 500;
        const patterns = ['undo-loop', 'hover-repeat', 'dwell', 'backtrack', 'fast-action'];
        
        let elapsed = 0;
        let cycleCount = 0;

        while (elapsed < testDuration) {
            const cycleStart = Date.now();
            
            const pattern = patterns[cycleCount % patterns.length];
            const targetId = cycleCount % 6;
            
            try {
                const result = await this.controller.processSignal(pattern, { targetId });
                this.metrics.signalsProcessed++;
                if (result) this.metrics.adaptationsApplied++;
                
                if (cycleCount % 10 === 0) {
                    this.captureMemorySnapshot();
                }
                
            } catch (error) {
                this.metrics.errorsEncountered++;
                this.log(`[Stability] Error in cycle ${cycleCount}: ${error.message}`);
            }

            await this.wait(signalInterval);
            elapsed = Date.now() - this.startTime;
            cycleCount++;
            
            if (cycleCount % 20 === 0) {
                this.log(`[Stability] Cycle ${cycleCount} - ${Math.round(elapsed/1000)}s elapsed`);
            }
        }
    }

    captureMemorySnapshot() {
        const state = this.controller.getExecutionState();
        this.metrics.memorySnapshots.push({
            timestamp: Date.now() - this.startTime,
            queueLength: state.queueLength,
            throttledSignals: state.throttledSignals.length,
            isProcessing: state.isProcessing
        });
    }

    checkForDegradation() {
        if (this.metrics.memorySnapshots.length < 2) return { degraded: false, reason: 'Insufficient data' };
        
        const first = this.metrics.memorySnapshots[0];
        const last = this.metrics.memorySnapshots[this.metrics.memorySnapshots.length - 1];
        
        const queueGrowth = last.queueLength - first.queueLength;
        const throttleGrowth = last.throttledSignals - first.throttledSignals;
        
        if (queueGrowth > 5) {
            return { degraded: true, reason: `Queue grew by ${queueGrowth}` };
        }
        
        if (throttleGrowth > 10) {
            return { degraded: true, reason: `Throttle map grew by ${throttleGrowth}` };
        }
        
        const errorRate = this.metrics.errorsEncountered / this.metrics.signalsProcessed;
        if (errorRate > 0.05) {
            return { degraded: true, reason: `Error rate: ${(errorRate * 100).toFixed(1)}%` };
        }
        
        return { degraded: false, reason: 'No degradation detected' };
    }

    reportStabilityResults() {
        const duration = Date.now() - this.startTime;
        const degradation = this.checkForDegradation();
        
        this.log('🏁 STABILITY TEST RESULTS:');
        this.log(`⏱️ Duration: ${Math.round(duration/1000)}s`);
        this.log(`📊 Signals Processed: ${this.metrics.signalsProcessed}`);
        this.log(`🎯 Adaptations Applied: ${this.metrics.adaptationsApplied}`);
        this.log(`❌ Errors Encountered: ${this.metrics.errorsEncountered}`);
        this.log(`📈 Memory Snapshots: ${this.metrics.memorySnapshots.length}`);
        
        const successRate = ((this.metrics.adaptationsApplied / this.metrics.signalsProcessed) * 100).toFixed(1);
        this.log(`✅ Success Rate: ${successRate}%`);
        
        if (degradation.degraded) {
            this.log(`⚠️ DEGRADATION DETECTED: ${degradation.reason}`);
            this.log('❌ STABILITY TEST FAILED');
        } else {
            this.log(`✅ NO DEGRADATION: ${degradation.reason}`);
            this.log('🎉 STABILITY TEST PASSED - System maintains performance over time');
        }
        
        this.logMemoryTrend();
    }

    logMemoryTrend() {
        if (this.metrics.memorySnapshots.length === 0) return;
        
        this.log('📊 Memory Trend:');
        this.metrics.memorySnapshots.forEach((snapshot, index) => {
            if (index % 3 === 0) {
                this.log(`  ${Math.round(snapshot.timestamp/1000)}s: Queue=${snapshot.queueLength}, Throttled=${snapshot.throttledSignals}`);
            }
        });
    }

    resetMetrics() {
        this.metrics = {
            signalsProcessed: 0,
            adaptationsApplied: 0,
            errorsEncountered: 0,
            memorySnapshots: []
        };
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

window.StabilityTest = StabilityTest;