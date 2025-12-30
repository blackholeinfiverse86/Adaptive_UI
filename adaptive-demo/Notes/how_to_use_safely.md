# How to Use This Safely

### 1. Always Set Limits
```javascript
const adaptiveUI = new AdaptiveUI({
    throttleDuration: 2000,  
    maxConcurrentAdaptations: 1  
});
```

### 2. Emergency Reset
```javascript
adaptiveUI.controller.emergencyReset();
```

### 3. Monitor System State
```javascript
const state = adaptiveUI.controller.getExecutionState();
console.log('Queue:', state.queueLength);
console.log('Throttled:', state.throttledSignals);
```

### 4. Test Before Deploy
```javascript
await reliabilityTester.runReliabilityTests();
```

## Red Flags - Stop Immediately If:
- Adaptations firing rapidly (throttling broke)
- Memory usage climbing over time
- Console errors during signal processing
- Users complaining about distractions

## Essential Rules
1. Start conservative (you can always speed up later)
2. Test with real users
3. Monitor continuously
4. Have an escape hatch (emergency reset)
5. Respect your users (subtle beats flashy)