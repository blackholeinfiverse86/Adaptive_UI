# Adaptive UI

An intelligent user interface system that recognizes user behavior patterns and responds with helpful visual adaptations to reduce confusion and improve user experience.

## Features

- **Behavior Recognition**: Detects user patterns like undo-loops, hover-repeats, and navigation backtracking
- **Intelligent Responses**: Applies contextual visual adaptations to guide users
- **Non-Intrusive**: Subtle animations and highlights that help without overwhelming
- **Automatic Cleanup**: All adaptations fade away naturally after a set duration

## Adaptive Patterns

- **Focus Assist**: Highlights main action when users show confusion (undo-loop behavior)
- **Hover Relief**: Fades other options when users hover repeatedly (indecision)
- **Navigation Guide**: Pulses current area when users navigate back-and-forth
- **Attention Re-centering**: Gentle pulsing during extended focus (dwell behavior)

## Quick Start

1. Open `index.html` in your browser
2. Use test buttons to trigger specific patterns
3. Check debug console for logs

## Integration

```javascript
// Initialize the adaptive system
const adaptiveUI = new AdaptiveUI();

// Trigger patterns manually
adaptiveUI.controller.processSignal('undo-loop', { targetId: 'tile-0' });
```

## Performance

- Lightweight
- Memory safe with automatic cleanup
- Throttled signal processing