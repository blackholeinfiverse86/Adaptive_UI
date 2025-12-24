# Adaptive UI

An intelligent user interface system that recognizes user behavior patterns and responds with helpful visual adaptations to reduce confusion and improve user experience.

## Overview

Adaptive UI watches how users interact with your interface and automatically applies visual changes when it detects signs of confusion, hesitation, or uncertainty. Instead of static interfaces, your UI becomes responsive to human behavior patterns.

## Key Features

- **Behavior Recognition**: Detects user patterns like undo-loops, hover-repeats, and navigation backtracking
- **Intelligent Responses**: Applies contextual visual adaptations to guide users
- **Non-Intrusive**: Subtle animations and highlights that help without overwhelming
- **Automatic Cleanup**: All adaptations fade away naturally after a set duration
- **Throttling System**: Prevents adaptation spam and maintains smooth performance

## Adaptive Patterns

### 🎯 Focus Assist
**Triggers**: Repeated undo actions (undo-loop behavior)  
**Response**: Highlights main action button with bright colors and increased prominence  
**Use Case**: When users show confusion about what to do next

### 🌸 Hover Relief  
**Triggers**: Repeated hovering over same areas (hover-repeat)  
**Response**: Softly fades other options while highlighting the focused area with warm glow  
**Use Case**: When users show indecision between multiple options

### 🧭 Navigation Guide
**Triggers**: Back-and-forth navigation (backtrack behavior)  
**Response**: Pulses current area and adds directional hints on other tiles  
**Use Case**: When users appear lost or uncertain about navigation

### 💙 Attention Re-centering
**Triggers**: Extended focus on one area (dwell behavior)  
**Response**: Gentle pulsing with calming colors to reinforce attention  
**Use Case**: Supporting deep concentration without interruption

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Adaptive_UI/adaptive-demo
   ```

2. **Open the demo**
   ```bash
   # Simply open index.html in your browser
   open index.html
   ```

3. **Test the patterns**
   - Use the test buttons to trigger different behavior patterns
   - Watch how the UI responds with visual adaptations
   - Check the debug console for detailed logs

## Project Structure

```
adaptive-demo/
├── index.html              # Main demo interface
├── adaptiveController.js   # Core adaptive logic and pattern management
├── adaptive-new.js         # Main AdaptiveUI class
├── signal.js              # Behavior signal detection
├── styles.css             # Visual styling and animations
├── test-adaptations.js    # Testing utilities
├── stressTester.js        # Performance testing
└── Notes/
    ├── pattern_library.md  # Detailed pattern documentation
    ├── adaptation_map.md   # Behavior-to-pattern mappings
    └── usage_notes.md      # Implementation guidelines
```

## Integration

### Basic Setup
```javascript
// Initialize the adaptive system
const adaptiveUI = new AdaptiveUI();

// The system automatically starts monitoring user behavior
// No additional setup required for basic functionality
```

### Custom Configuration
```javascript
const adaptiveUI = new AdaptiveUI({
    throttleDuration: 1000,        // Minimum time between adaptations
    maxConcurrentAdaptations: 1,   // Prevent multiple simultaneous adaptations
    debounceDelay: 100            // Signal processing delay
});
```

### Manual Signal Triggering
```javascript
// Trigger specific behavior patterns for testing
adaptiveUI.controller.processSignal('undo-loop', { targetId: 'tile-0' });
adaptiveUI.controller.processSignal('hover-repeat', { targetId: 'auto' });
```

## Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Features Used**: CSS animations, ES6 classes, requestAnimationFrame
- **No Dependencies**: Pure JavaScript implementation

## Performance

- **Lightweight**: ~15KB total JavaScript
- **Efficient**: Throttled signal processing prevents performance issues
- **Memory Safe**: Automatic cleanup prevents memory leaks
- **Smooth Animations**: Uses requestAnimationFrame for optimal performance

## Customization

### Visual Styling
Modify `styles.css` to match your brand:
- Adjust colors in CSS custom properties
- Change animation durations and easing
- Customize tile layouts and spacing

### Behavior Patterns
Edit `adaptiveController.js` to:
- Add new behavior triggers
- Create custom visual responses
- Adjust pattern timing and intensity

### Signal Detection
Modify `signal.js` to:
- Add new user behavior detection
- Customize trigger thresholds
- Implement domain-specific patterns

## Testing

### Manual Testing
Use the built-in test buttons to trigger each pattern:
- **Undo Loop**: Tests focus assist pattern
- **Hover Repeat**: Tests hover relief pattern  
- **Dwell**: Tests attention re-centering
- **Backtrack**: Tests navigation guide
- **Run All Tests**: Sequential pattern testing

### Stress Testing
```javascript
// Run comprehensive stress tests
stressTester.runAllTests();

// Test specific scenarios
stressTester.testConcurrentSignals();
stressTester.testRapidFire();
```

## Best Practices

### When to Use
- Complex interfaces with multiple options
- First-time user experiences
- Decision-heavy workflows
- Learning and educational platforms

### When to Avoid
- Simple, obvious interfaces
- Fast-paced gaming applications
- Mobile-first touch interfaces
- Real-time collaboration tools

### Implementation Tips
- Start with one pattern and gradually add more
- Test with real users to validate effectiveness
- Monitor performance impact on your specific use case
- Customize timing based on your user base

