# Safety Rules I Live By

## My Core Rule
**"When in doubt, do nothing."**

I'd rather miss helping someone than annoy them. This principle guides every decision.

## The Three Pillars
1. **Restraint over reaction**: Subtle guidance beats dramatic changes
2. **User respect**: Their actions always come first
3. **System stability**: Errors mean no action, not broken states

## Hard Limits I Set
```
Throttle: 1000ms minimum between same signals
Debounce: 100ms processing delay
Queue: 10 signals max
Concurrent: 1 adaptation only
Duration: 1-5 seconds, then auto-fade
Opacity: 30% fade maximum (never hide completely)
```

## Preventing Sensory Overload
- No rapid flashing (smooth transitions only)
- Limited color palette (consistent and calming)
- One focus point at a time
- Respect accessibility preferences
- Never block user actions

## When Things Go Wrong
1. **Unknown signal**: Log it, ignore it
2. **Missing element**: Skip silently
3. **Bad config**: Use safe defaults
4. **DOM error**: Clear everything, reset

## Emergency Reset
```javascript
adaptiveController.emergencyReset();
```
Always available. Always works.

## Resource Protection
- Queue limits prevent memory leaks
- Timers get cleaned up on reset
- DOM checks before every manipulation
- Event listeners managed properly

## My Pre-Launch Checklist
- [ ] Duration limits everywhere
- [ ] Throttling actually works
- [ ] Error handling tested
- [ ] DOM safety verified
- [ ] Memory cleanup confirmed
- [ ] Accessibility compliant

## The Promise I Make
1. Never overwhelm users
2. Always respect their actions
3. Fail safely when uncertain
4. Maintain performance
5. Preserve accessibility
6. Work predictably everywhere

