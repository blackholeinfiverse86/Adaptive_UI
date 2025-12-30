class ReliabilityManager {
    constructor(controller) {
        this.controller = controller;
        this.signalQueue = [];
        this.processingLock = false;
        this.throttleMap = new Map();
        this.debounceTimer = null;
        this.safetyPolicy = new SafetyPolicy();
        this.priorityOrder = {
            'undo-loop': 1,      // Confusion (highest priority)
            'hover-repeat': 2,   // Overload
            'backtrack': 3,      // Hesitation  
            'dwell': 4,          // Exploration
            'fast-action': 5     // Default (lowest priority)
        };
        this.executionState = {
            activeSignal: null,
            queuedCount: 0,
            lastProcessed: null
        };
    }


    async processSignal(type, payload = {}) {
        const signalId = `${type}-${Date.now()}-${Math.random()}`;
        
        if (this.isThrottled(type)) {
            this.log(`[Reliability] Signal ${type} throttled`);
            return false;
        }

        this.setThrottle(type);
        return this.enqueueSignal({ 
            id: signalId, 
            type, 
            payload, 
            timestamp: Date.now(),
            priority: this.priorityOrder[type] || 5
        });
    }


    enqueueSignal(signal) {
        const MAX_QUEUE_SIZE = 10;
        if (this.signalQueue.length >= MAX_QUEUE_SIZE) {
            this.log(`[Reliability] Queue overflow - dropping oldest signal`);
            this.signalQueue.shift();
        }
        
        let insertIndex = this.signalQueue.length;
        for (let i = 0; i < this.signalQueue.length; i++) {
            if (signal.priority < this.signalQueue[i].priority) {
                insertIndex = i;
                break;
            }
        }
        
        this.signalQueue.splice(insertIndex, 0, signal);
        this.executionState.queuedCount = this.signalQueue.length;
        
        this.debounceExecution();
        return true;
    }


    debounceExecution() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            this.debounceTimer = null;
            this.executeQueue();
        }, this.controller.config.debounceDelay);
    }


    async executeQueue() {
        if (this.processingLock || this.signalQueue.length === 0) return;

        this.processingLock = true;
        
        try {
            while (this.signalQueue.length > 0) {
                const signal = this.signalQueue.shift();
                this.executionState.activeSignal = signal;
                this.executionState.queuedCount = this.signalQueue.length;

                await this.executeSignal(signal);
                this.executionState.lastProcessed = signal;
            }
        } catch (error) {
            this.log('[Reliability] Signal execution failed:', error);
        } finally {
            this.executionState.activeSignal = null;
            this.processingLock = false;
        }
    }


    async executeSignal(signal) {
        try {
            const adaptation = this.controller.signalInterpreter.interpret(signal.type, signal.payload);
            
            if (adaptation) {
                if (!this.safetyPolicy.canExecuteAdaptation(signal.type, adaptation)) {
                    this.log(`[Reliability] Signal ${signal.type} blocked by safety policy`);
                    return;
                }
                
                if (this.shouldExecuteAdaptation(adaptation)) {
                    this.log(`[Reliability] Executing signal: ${signal.type} (priority: ${signal.priority})`);
                    this.controller.uiMutator.apply(adaptation);
                    this.safetyPolicy.recordAdaptation(signal.type);
                } else {
                    this.log(`[Reliability] Signal ${signal.type} blocked by higher priority adaptation`);
                }
            } else {
                this.log(`[Reliability] No adaptation for signal: ${signal.type}`);
            }
        } catch (error) {
            this.log(`[Reliability] Signal execution error: ${error.message}`);
            try {
                this.controller.emergencyReset();
            } catch (resetError) {
                this.log(`[Reliability] Emergency reset failed: ${resetError.message}`);
            }
        }
    }
    

    shouldExecuteAdaptation(newAdaptation) {
        if (!this.controller.state.activeAdaptation) {
            return true;
        }
        

        const currentPatternName = Object.keys(this.controller.adaptationPatterns)
            .find(key => this.controller.adaptationPatterns[key].response === this.controller.state.activeAdaptation);
        
        if (!currentPatternName) {
            return true;
        }
        
        const currentPattern = this.controller.adaptationPatterns[currentPatternName];
        const currentPriority = currentPattern.priority ?? 5;
        const newPriority = newAdaptation.priority ?? 5;
        

        return newPriority < currentPriority;
    }


    isThrottled(signalType) {
        const throttleEntry = this.throttleMap.get(signalType);
        if (!throttleEntry) return false;
        
        const now = Date.now();
        if (now >= throttleEntry.expiry) {
            this.throttleMap.delete(signalType);
            return false;
        }
        
        return true;
    }


    setThrottle(signalType) {
        const expiry = Date.now() + this.controller.config.throttleDuration;
        this.throttleMap.set(signalType, { expiry, setAt: Date.now() });
    }


    getExecutionState() {
        return {
            ...this.executionState,
            isProcessing: this.processingLock,
            throttledSignals: Array.from(this.throttleMap.keys()),
            queueLength: this.signalQueue.length
        };
    }


    clearQueue() {
        this.signalQueue.length = 0;
        this.executionState.queuedCount = 0;
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }
    }


    reset() {
        this.clearQueue();
        this.processingLock = false;
        this.throttleMap.clear();
        this.safetyPolicy.reset();
        this.executionState = {
            activeSignal: null,
            queuedCount: 0,
            lastProcessed: null
        };
    }


    log(message) {
        if (window.adaptiveUI && window.adaptiveUI.log) {
            window.adaptiveUI.log(message);
        } else {
            console.log(message);
        }
    }
}

window.ReliabilityManager = ReliabilityManager;