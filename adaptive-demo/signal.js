function testSignal(signalType) {
    const targetSelect = document.getElementById('targetTile');
    const targetId = targetSelect.value;
    
    const payload = {
        targetId: targetId === 'auto' ? undefined : parseInt(targetId),
        timestamp: Date.now(),
        source: 'manual-test'
    };
    
    window.adaptiveUI.onSignal(signalType, payload);
}

function clearLog() {
    const debugLog = document.getElementById('debugLog');
    if (debugLog) {
        debugLog.innerHTML = '';
    }
    console.clear();
}
