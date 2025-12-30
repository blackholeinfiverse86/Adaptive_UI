function runAdaptationTests() {

    setTimeout(() => {
        console.log('Test 1: Undo Loop (highlight main action)');
        testSignal('undo-loop');
    }, 1000);
    

    setTimeout(() => {
        console.log('Test 2: Dwell (pulse relevant area)');
        testSignal('dwell');
    }, 4000);
    

    setTimeout(() => {
        console.log('Test 3: Hover Repeat (dim irrelevant panels)');
        testSignal('hover-repeat');
    }, 9000);
    

    setTimeout(() => {
        console.log('Test 4: Backtrack (dim irrelevant panels)');
        testSignal('backtrack');
    }, 15000);
    

    setTimeout(() => {
        console.log('Test 5: Fast Action (quick combo)');
        testSignal('fast-action');
    }, 20000);
    
    console.log('All tests scheduled. Watch for visual changes!');
}

