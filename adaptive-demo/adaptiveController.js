class AdaptiveController {
    constructor() {

        this.config = {
            throttleDuration: 1000,
            adaptationDurations: {
                'highlight-main-action': 3000,
                'pulse-relevant': 4000,
                'gentle-fade': 4000,
                'breadcrumb-highlight': 3500,
                'quick-combo': 1000
            },
            maxConcurrentAdaptations: 1,
            debounceDelay: 100
        };


        this.adaptationPatterns = {
            'focus-assist': {
                triggers: ['undo-loop'],
                response: 'highlight-main-action',
                priority: 1
            },
            'navigation-guide': {
                triggers: ['backtrack'],
                response: 'breadcrumb-highlight',
                priority: 2
            },
            'hover-relief': {
                triggers: ['hover-repeat'],
                response: 'gentle-fade',
                priority: 3
            },
            'attention-recentering': {
                triggers: ['dwell'],
                response: 'pulse-relevant',
                priority: 4
            },
            'quick-combo': {
                triggers: ['fast-action'],
                response: 'quick-combo',
                priority: 5
            }
        };


        this.adaptationMap = {
            'undo-loop': 'focus-assist',
            'hover-repeat': 'hover-relief',
            'dwell': 'attention-recentering',
            'backtrack': 'navigation-guide',
            'fast-action': 'quick-combo'
        };


        this.state = {
            activeAdaptation: null,
            adaptationTimeout: null,
            quickTimeouts: []
        };

        this.tileMap = {
            '0': 'tile-0',
            '1': 'tile-1', 
            '2': 'tile-2',
            '3': 'tile-3',
            '4': 'tile-4',
            '5': 'tile-5'
        };

        this.patternCache = this.buildPatternCache();
        this.throttleMap = new Map();
        this.eventCapture = new EventCapture(this);
        this.signalInterpreter = new SignalInterpreter(this);
        this.uiMutator = new UIMutator(this);
        this.reliabilityManager = this.initializeReliabilityManager();
        this.initialized = true;
    }


    buildPatternCache() {
        const cache = {};
        Object.entries(this.adaptationPatterns).forEach(([pattern, config]) => {
            cache[config.response] = pattern;
        });
        return cache;
    }

    initializeReliabilityManager() {
        try {
            return typeof ReliabilityManager !== 'undefined' ? new ReliabilityManager(this) : null;
        } catch (error) {
            console.error('[AdaptiveController] ReliabilityManager initialization failed:', error);
            return null;
        }
    }


    processSignal(type, payload = {}) {
        if (!this.initialized) {
            console.warn('[AdaptiveController] Controller not initialized');
            return Promise.resolve(false);
        }
        
        if (!this.reliabilityManager) {
            console.warn('[AdaptiveController] ReliabilityManager unavailable, using fallback');
            return this.fallbackProcessSignal(type, payload);
        }
        
        try {
            return this.reliabilityManager.processSignal(type, payload);
        } catch (error) {
            console.error('[AdaptiveController] Signal processing error:', error);
            return this.fallbackProcessSignal(type, payload);
        }
    }

    fallbackProcessSignal(type, payload = {}) {
        try {
            if (this.isThrottled(type)) return Promise.resolve(false);
            
            const adaptation = this.signalInterpreter.interpret(type, payload);
            if (adaptation && this.shouldExecuteAdaptation(adaptation)) {
                this.uiMutator.apply(adaptation);
                this.setThrottle(type);
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        } catch (error) {
            console.error('[AdaptiveController] Fallback processing failed:', error);
            return Promise.resolve(false);
        }
    }

    shouldExecuteAdaptation(newAdaptation) {
        if (!this.state.activeAdaptation) return true;
        
        let currentPatternName = this.state.activeAdaptation;
        if (!this.adaptationPatterns[currentPatternName]) {
            currentPatternName = this.patternCache[this.state.activeAdaptation];
        }
        
        if (!currentPatternName || !this.adaptationPatterns[currentPatternName]) {
            console.warn('[AdaptiveController] Unknown active adaptation detected');
            return true;
        }
        
        const currentPattern = this.adaptationPatterns[currentPatternName];
        const currentPriority = currentPattern.priority ?? 5;
        const newPriority = newAdaptation.priority ?? 5;
        
        return newPriority < currentPriority;
    }

    setThrottle(signalType) {
        const expiry = Date.now() + this.config.throttleDuration;
        this.throttleMap.set(signalType, { expiry });
    }


    isThrottled(signalType) {
        try {
            if (this.reliabilityManager) {
                return this.reliabilityManager.isThrottled(signalType);
            }
            
            const throttleEntry = this.throttleMap.get(signalType);
            if (!throttleEntry) return false;
            
            const now = Date.now();
            if (now >= throttleEntry.expiry) {
                this.throttleMap.delete(signalType);
                return false;
            }
            
            return true;
        } catch (error) {
            console.warn('[AdaptiveController] Error checking throttle status:', error);
            return false;
        }
    }


    getExecutionState() {
        try {
            return this.reliabilityManager?.getExecutionState() ?? { error: 'ReliabilityManager not available' };
        } catch (error) {
            console.warn('[AdaptiveController] Error getting execution state:', error);
            return { error: 'Execution state unavailable' };
        }
    }


    clearActiveAdaptation() {
        if (!this.state.activeAdaptation) return;
        
        if (this.state.adaptationTimeout) {
            clearTimeout(this.state.adaptationTimeout);
            this.state.adaptationTimeout = null;
        }
        
        this.state.quickTimeouts.forEach(timeout => clearTimeout(timeout));
        this.state.quickTimeouts = [];
        
        this.uiMutator.clearAll();
        this.state.activeAdaptation = null;
        console.log('[AdaptiveController] Active adaptation cleared');
    }
    

    emergencyReset() {
        let hasErrors = false;
        try {
            this.clearActiveAdaptation();
        } catch (error) {
            console.error('[AdaptiveController] Error clearing adaptation:', error);
            hasErrors = true;
        }
        
        try {
            this.reliabilityManager?.reset();
        } catch (error) {
            console.error('[AdaptiveController] Error during reliability manager reset:', error);
            hasErrors = true;
        }
        
        console.log(`[AdaptiveController] Emergency reset ${hasErrors ? 'completed with errors' : 'completed successfully'}`);
    }
}


class EventCapture {
    constructor(controller) {
        this.controller = controller;
        this.setupListeners();
    }

    setupListeners() {

        document.addEventListener('animationend', (e) => {
            if (e.target.classList.contains('tile')) {
                this.controller.uiMutator.cleanupAnimation(e.target);
            }
        });
    }
}


class SignalInterpreter {
    constructor(controller) {
        this.controller = controller;
    }

    interpret(signalType, payload) {
        const patternName = this.controller.adaptationMap[signalType];
        if (!patternName) return null;

        const pattern = this.controller.adaptationPatterns[patternName];
        if (!pattern) {
            return this.createLegacyAdaptation(patternName, payload);
        }

        const targetTile = this.selectTarget(payload.targetId);
        if (!targetTile) return null;

        return {
            pattern: patternName,
            type: pattern.response,
            target: targetTile,
            duration: this.controller.config.adaptationDurations[pattern.response] || 3000,
            priority: pattern.priority ?? 5,
            payload
        };
    }

    createLegacyAdaptation(adaptationType, payload) {
        const targetTile = this.selectTarget(payload.targetId);
        if (!targetTile) return null;

        return {
            type: adaptationType,
            target: targetTile,
            duration: this.controller.config.adaptationDurations[adaptationType] || 3000,
            priority: 5,
            payload
        };
    }

    selectTarget(targetId) {
        if (targetId !== undefined && targetId !== 'auto') {
            const elementId = this.controller.tileMap[String(targetId)];
            if (!elementId) {
                console.warn('[SignalInterpreter] Invalid target ID provided');
                return null;
            }
            const tiles = document.querySelectorAll('.tile');
            return Array.from(tiles).find(tile => tile.id === elementId) || null;
        }
        
        const tiles = document.querySelectorAll('.tile');
        if (tiles.length === 0) {
            console.warn('[SignalInterpreter] No tiles found for auto-selection');
            return null;
        }
        return tiles[Math.floor(Math.random() * tiles.length)];
    }
}


class UIMutator {
    constructor(controller) {
        this.controller = controller;
    }


    apply(adaptation) {
        if (!adaptation || !adaptation.target) {
            console.warn('[UIMutator] Invalid adaptation - skipping');
            return;
        }
        
        this.controller.clearActiveAdaptation();
        
        requestAnimationFrame(() => {
            if (!document.contains(adaptation.target)) {
                console.warn('[UIMutator] Target element no longer exists - skipping adaptation');
                return;
            }
            
            this.controller.state.activeAdaptation = adaptation.pattern || adaptation.type;
            
            const responseType = adaptation.type;
            try {
                switch (responseType) {
                    case 'highlight-main-action':
                        this.applyMainActionHighlight(adaptation.target);
                        break;
                    case 'pulse-relevant':
                        this.applyRelevantPulse(adaptation.target);
                        break;
                    case 'gentle-fade':
                        this.applyGentleFade(adaptation.target);
                        break;
                    case 'breadcrumb-highlight':
                        this.applyBreadcrumbHighlight(adaptation.target);
                        break;
                    case 'quick-combo':
                        this.applyQuickCombo(adaptation.target);
                        break;
                    default:
                        console.warn('[UIMutator] Unknown response type detected');
                        return;
                }

                this.controller.state.adaptationTimeout = setTimeout(() => {
                    this.controller.clearActiveAdaptation();
                }, adaptation.duration);
            } catch (error) {
                console.error('[UIMutator] Adaptation application failed:', error);
                this.controller.clearActiveAdaptation();
            }
        });
    }


    applyMainActionHighlight(tile) {
        if (!tile || !document.contains(tile)) return;
        tile.classList.add('main-action-highlight');
    }

    applyRelevantPulse(tile) {
        if (!tile || !document.contains(tile)) return;
        tile.classList.add('relevant-pulse');
    }

    applyGentleFade(targetTile) {
        if (!targetTile || !document.contains(targetTile)) return;
        
        document.querySelectorAll('.tile').forEach(tile => {
            if (tile !== targetTile) {
                tile.classList.add('soft-fade');
            }
        });
        
        targetTile.classList.add('gentle-glow');
    }


    applyBreadcrumbHighlight(targetTile) {
        if (!targetTile || !document.contains(targetTile)) return;
        
        targetTile.classList.add('breadcrumb-pulse');
        const allTiles = document.querySelectorAll('.tile');
        allTiles.forEach((tile) => {
            if (tile !== targetTile) {
                tile.classList.add('path-hint');
            }
        });
    }


    applyQuickCombo(tile) {
        if (!tile || !document.contains(tile)) return;
        tile.classList.add('quick-highlight', 'pulse');
        const timeout = setTimeout(() => {
            if (document.contains(tile)) {
                tile.classList.remove('quick-highlight', 'pulse');
            }
        }, this.controller.config.adaptationDurations['quick-combo'] || 1000);
        this.controller.state.quickTimeouts.push(timeout);
    }


    cleanupAnimation(tile) {
        const animationClasses = ['pulse', 'nudge', 'quick-highlight'];
        animationClasses.forEach(cls => tile.classList.remove(cls));
    }


    clearAll() {
        requestAnimationFrame(() => {
            const allClasses = ['main-action-highlight', 'relevant-pulse', 'soft-fade', 'gentle-glow', 'breadcrumb-pulse', 'path-hint', 'quick-highlight', 'pulse'];
            document.querySelectorAll('.tile').forEach(tile => {
                allClasses.forEach(cls => tile.classList.remove(cls));
            });
        });
    }
}

window.AdaptiveController = AdaptiveController;