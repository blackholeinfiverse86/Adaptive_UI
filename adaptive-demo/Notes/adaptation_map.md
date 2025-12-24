# Adaptation Map

## How Behaviors Connect to UI Changes

This document shows the complete flow from user behavior to visual response.

---

## Behavior → Pattern → UI Effect

### 1. Undo Loop Behavior
**What the user does:**
- Clicks undo repeatedly (3+ times in quick succession)
- Shows confusion about what action to take

**Pattern triggered:** Focus Assist

**UI effect:**
- Target element gets bright highlight with warm colors
- Scales up slightly (8% larger)
- Adds visible border
- Lasts 3 seconds

**Visual cue:** "This is the main action you should take"

---

### 2. Hover Repeat Behavior
**What the user does:**
- Hovers over the same area multiple times
- Mouse moves back and forth without clicking
- Shows indecision

**Pattern triggered:** Hover Relief

**UI effect:**
- Other elements fade and blur slightly
- Focused element gets soft pink glow
- Gentle breathing animation (slow pulse)
- Lasts 4 seconds

**Visual cue:** "Take your time, focus here"

---

### 3. Long Dwell Behavior
**What the user does:**
- Stays focused on one area for extended time
- Minimal mouse movement
- Shows deep concentration

**Pattern triggered:** Attention Re-centering

**UI effect:**
- Element pulses with calm blue colors
- Smooth, continuous animation
- Reinforces current focus
- Lasts 4 seconds

**Visual cue:** "You're in the right place, keep going"

---

### 4. Backtrack Behavior
**What the user does:**
- Navigates back and forth between sections
- Revisits previous areas repeatedly
- Shows navigation uncertainty

**Pattern triggered:** Navigation Guide

**UI effect:**
- Current element pulses with teal/green
- Other elements show subtle arrow hints
- Directional visual guidance
- Lasts 3.5 seconds

**Visual cue:** "Here's where you are, these are your options"

---

## Technical Flow

```
User Behavior
    ↓
Signal Detection (event capture)
    ↓
Signal Interpretation (pattern matching)
    ↓
Pattern Selection (named pattern)
    ↓
UI Mutation (CSS class application)
    ↓
Automatic Cleanup (timeout-based)
```

---

## Timing and Throttling

- **Throttle duration:** 1 second between same signals
- **Debounce delay:** 100ms for processing
- **Pattern durations:** 3-4 seconds (varies by pattern)
- **Only one pattern active at a time**

---

## Why This Matters

Each behavior reveals something about the user's mental state:
- **Confusion** needs guidance
- **Indecision** needs calm
- **Focus** needs reinforcement
- **Lost navigation** needs direction

The UI responds with appropriate emotional support through visual design.
