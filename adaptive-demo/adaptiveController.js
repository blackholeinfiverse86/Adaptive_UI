class AdaptiveController {
    constructor() {
        this.config = {
            throttleDuration: 1000,
            adaptationDurations: {
                'highlight-main-action': 3000,  
                'pulse-relevant': 4000,         
                'dim-irrelevant': 5000          
            },
            maxConcurrentAdaptations: 1,
            debounceDelay: 100 
        };

        this.adaptationPatterns = {
            'focus-assist': {
                triggers: ['undo-loop'],
                response: 'highlight-main-action',
                duration: 3000
            },
            'hover-relief': {
                triggers: ['hover-repeat'],
                response: 'gentle-fade',
                duration: 4000
            },
            'navigation-guide': {
                triggers: ['backtrack'],
                response: 'breadcrumb-highlight',
                duration: 3500
            },
            'attention-recentering': {
                triggers: ['dwell'],
                response: 'pulse-relevant',
                duration: 4000
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
            throttledSignals: new Set(),
            adaptationTimeout: null,
            isProcessing: false  
        };

        this.eventCapture = new EventCapture(this);
        this.signalInterpreter = new SignalInterpreter(this);
        this.uiMutator = new UIMutator(this);
    }

    processSignal(type, payload = {}) {
        if (this.state.isProcessing) {
            console.log(`[AdaptiveController] Signal ${type} blocked - processing in progress`);
            return;
        }
        
        console.log(`[AdaptiveController] Processing signal: ${type}`, payload);
        
        if (this.isThrottled(type)) {
            console.log(`[AdaptiveController] Signal ${type} throttled`);
            return;
        }
        
        this.state.isProcessing = true;
        
        const adaptation = this.signalInterpreter.interpret(type, payload);
        if (adaptation) {
            console.log(`[AdaptiveController] Applying adaptation: ${adaptation.type}`);
            this.uiMutator.apply(adaptation);
            this.setThrottle(type);
        } else {
            console.log(`[AdaptiveController] No adaptation found for signal: ${type}`);
        }
        
        setTimeout(() => {
            this.state.isProcessing = false;
        }, this.config.debounceDelay);
    }

    isThrottled(signalType) {
        return this.state.throttledSignals.has(signalType);
    }

    setThrottle(signalType) {
        this.state.throttledSignals.add(signalType);
        setTimeout(() => {
            this.state.throttledSignals.delete(signalType);
        }, this.config.throttleDuration);
    }

    clearActiveAdaptation() {
        if (!this.state.activeAdaptation) return;
        
        if (this.state.adaptationTimeout) {
            clearTimeout(this.state.adaptationTimeout);
            this.state.adaptationTimeout = null;
        }
        
        this.uiMutator.clearAll();
        this.state.activeAdaptation = null;
        console.log('[AdaptiveController] Active adaptation cleared');
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
            duration: pattern.duration,
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
            payload
        };
    }

    selectTarget(targetId) {
        if (targetId !== undefined && targetId !== 'auto') {
            return document.getElementById(`tile-${targetId}`);
        }
        
        const tiles = document.querySelectorAll('.tile');
        if (tiles.length === 0) return null;
        return tiles[Math.floor(Math.random() * tiles.length)];
    }
}


class UIMutator {
    constructor(controller) {
        this.controller = controller;
    }

    apply(adaptation) {
        this.controller.clearActiveAdaptation();
        
        requestAnimationFrame(() => {
            this.controller.state.activeAdaptation = adaptation.pattern || adaptation.type;
            
            const responseType = adaptation.type;
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
            }

            this.controller.state.adaptationTimeout = setTimeout(() => {
                this.controller.clearActiveAdaptation();
            }, adaptation.duration);
        });
    }

    applyMainActionHighlight(tile) {
        tile.classList.add('main-action-highlight');
    }

    applyRelevantPulse(tile) {
        tile.classList.add('relevant-pulse');
    }

    applyGentleFade(targetTile) {
        document.querySelectorAll('.tile').forEach(tile => {
            if (tile !== targetTile) {
                tile.classList.add('soft-fade');
            }
        });
        targetTile.classList.add('gentle-glow');
    }

    applyBreadcrumbHighlight(targetTile) {
        targetTile.classList.add('breadcrumb-pulse');
        const allTiles = document.querySelectorAll('.tile');
        allTiles.forEach((tile, index) => {
            if (tile !== targetTile) {
                tile.classList.add('path-hint');
            }
        });
    }

    applyQuickCombo(tile) {
        tile.classList.add('quick-highlight', 'pulse');
        setTimeout(() => {
            tile.classList.remove('quick-highlight', 'pulse');
        }, 1000);
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