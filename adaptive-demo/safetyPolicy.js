class SafetyPolicy {
    constructor() {
        this.limits = {
            maxAdaptationsPerMinute: 10,
            maxConcurrentAdaptations: 1,
            minTimeBetweenSameSignal: 1000,
            maxAdaptationDuration: 5000,
            maxOpacityReduction: 0.3
        };
        
        this.adaptationHistory = [];
        this.lastSignalTimes = new Map();
    }

    canExecuteAdaptation(signalType, adaptation) {
        // Rule: "If unsure, do nothing"
        if (!signalType || !adaptation) {
            console.log('[Safety] Blocked: Invalid signal or adaptation');
            return false;
        }

        // Check frequency limits
        if (this.isOverFrequencyLimit()) {
            console.log('[Safety] Blocked: Frequency limit exceeded');
            return false;
        }

        // Check signal throttling
        if (this.isSignalTooFrequent(signalType)) {
            console.log('[Safety] Blocked: Signal too frequent');
            return false;
        }

        // Check duration limits
        if (adaptation.duration > this.limits.maxAdaptationDuration) {
            console.log('[Safety] Blocked: Duration too long');
            return false;
        }

        return true;
    }

    isOverFrequencyLimit() {
        const oneMinuteAgo = Date.now() - 60000;
        const recentAdaptations = this.adaptationHistory.filter(
            time => time > oneMinuteAgo
        );
        return recentAdaptations.length >= this.limits.maxAdaptationsPerMinute;
    }

    isSignalTooFrequent(signalType) {
        const lastTime = this.lastSignalTimes.get(signalType);
        if (!lastTime) return false;
        
        return (Date.now() - lastTime) < this.limits.minTimeBetweenSameSignal;
    }

    recordAdaptation(signalType) {
        const now = Date.now();
        this.adaptationHistory.push(now);
        this.lastSignalTimes.set(signalType, now);
        
        // Cleanup old history
        const oneMinuteAgo = now - 60000;
        this.adaptationHistory = this.adaptationHistory.filter(time => time > oneMinuteAgo);
    }

    preventSensoryOverload(element) {
        if (!element) return false;
        
        // No rapid flashing
        if (element.style.animation && element.style.animation.includes('flash')) {
            return false;
        }
        
        // Limit opacity changes
        const computedStyle = window.getComputedStyle(element);
        const currentOpacity = parseFloat(computedStyle.opacity) || 1;
        if (currentOpacity < (1 - this.limits.maxOpacityReduction)) {
            return false;
        }
        
        return true;
    }

    reset() {
        this.adaptationHistory = [];
        this.lastSignalTimes.clear();
    }
}

window.SafetyPolicy = SafetyPolicy;