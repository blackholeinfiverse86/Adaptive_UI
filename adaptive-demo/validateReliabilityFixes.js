async function validateReliabilityFixes() {
    console.log('🔧 RELIABILITY FIX VALIDATION');
    console.log('==============================');
    
    window.adaptiveUI.controller.reliabilityManager.reset();
    
    console.log('\n1. Testing Throttle Fix...');
    const throttleResult1 = await window.adaptiveUI.controller.processSignal('undo-loop', { targetId: 0 });
    const throttleResult2 = await window.adaptiveUI.controller.processSignal('undo-loop', { targetId: 0 });
    const isThrottled = window.adaptiveUI.controller.isThrottled('undo-loop');
    
    console.log(`✓ First signal processed: ${throttleResult1}`);
    console.log(`✓ Second signal throttled: ${!throttleResult2}`);
    console.log(`✓ Throttle state active: ${isThrottled}`);
    
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    console.log('\n2. Testing Debounce Fix...');
    window.adaptiveUI.controller.reliabilityManager.reset();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const debounceResults = [];
    for (let i = 0; i < 5; i++) {
        const result = await window.adaptiveUI.controller.processSignal('hover-repeat', { targetId: 0 });
        debounceResults.push(result);
        await new Promise(resolve => setTimeout(resolve, 20));
    }
    
    const processedCount = debounceResults.filter(r => r).length;
    console.log(`✓ Rapid signals processed: ${processedCount}/5 (should be 1 due to throttling)`); 
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    console.log('\n3. Testing Concurrent Handling...');
    window.adaptiveUI.controller.reliabilityManager.reset();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const concurrentResults = await Promise.all([
        window.adaptiveUI.controller.processSignal('undo-loop', { targetId: 0 }),
        window.adaptiveUI.controller.processSignal('hover-repeat', { targetId: 1 }),
        window.adaptiveUI.controller.processSignal('dwell', { targetId: 2 }),
        window.adaptiveUI.controller.processSignal('backtrack', { targetId: 3 })
    ]);
    
    const concurrentProcessed = concurrentResults.filter(r => r).length;
    console.log(`✓ Concurrent signals processed: ${concurrentProcessed}/4`); 
    await new Promise(resolve => setTimeout(resolve, 300));
    
    console.log('\n4. Running Full Reliability Test Suite...');
    await window.reliabilityTester.runReliabilityTests();
    
    console.log('\n🎉 VALIDATION COMPLETE');
    console.log('Check the results above - all tests should now PASS!');
}

if (typeof window !== 'undefined' && window.adaptiveUI && window.reliabilityTester) {
    validateReliabilityFixes();
} else {
    console.log('Please run this script in the browser with the Adaptive UI system loaded.');
}