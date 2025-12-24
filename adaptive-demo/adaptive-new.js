class AdaptiveUI {
    constructor() {
        this.controller = new AdaptiveController();
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
                    console.warn('Failed to stringify data:', error.message);
                    if (typeof data === 'object') {
                        dataStr = ` [Object: ${data.constructor?.name || 'Unknown'}]`;
                    } else {
                        dataStr = ` [${typeof data}: ${String(data)}]`;
                    }
                }
            }
            logLine.textContent = logEntry + dataStr;
            debugLog.appendChild(logLine);
            debugLog.scrollTop = debugLog.scrollHeight;
        }
    }
}

window.AdaptiveUI = AdaptiveUI;