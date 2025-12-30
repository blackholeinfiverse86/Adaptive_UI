class AdaptiveUI {
    constructor() {
        this.controller = new AdaptiveController();
        this.logPatterns = [
            { pattern: /error/i, level: 'log-error' },
            { pattern: /warn/i, level: 'log-warning' },
            { pattern: /executing|cleared/i, level: 'log-info' }
        ];
        this.log('AdaptiveUI initialized with new controller architecture');
    }

    onSignal(type, payload = {}) {
        this.log(`Signal received: ${type}`, payload);
        this.controller.processSignal(type, payload);
    }

    log(message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        
        console.log(logEntry, data || '');
        
        const debugLog = document.getElementById('debugLog');
        if (debugLog) {
            const logLine = document.createElement('div');
            let dataStr = '';
            if (data !== null && data !== undefined) {
                try {
                    dataStr = ` ${JSON.stringify(data)}`;
                } catch (error) {
                    dataStr = ` [${typeof data}: ${String(data).substring(0, 50)}]`;
                }
            }
            logLine.textContent = `${logEntry}${dataStr}`;
            logLine.className = this.getLogLevel(message);
            debugLog.appendChild(logLine);
            debugLog.scrollTop = debugLog.scrollHeight;
            
            if (debugLog.children.length > 100) {
                debugLog.removeChild(debugLog.firstChild);
            }
        }
    }
    
    getLogLevel(message) {
        for (const { pattern, level } of this.logPatterns) {
            if (pattern.test(message)) return level;
        }
        return 'log-debug';
    }
}

window.AdaptiveUI = AdaptiveUI;