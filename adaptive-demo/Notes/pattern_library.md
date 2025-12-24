# Adaptive UI Pattern Library

## Overview
This library contains reusable intelligence patterns that help interfaces adapt to human behavior. Each pattern recognizes when someone is struggling and responds with helpful visual changes.

---

## Pattern 1: Focus Assist

**What triggers it:**
- User repeatedly undoes actions (undo-loop behavior)
- Shows confusion or uncertainty about what to do next

**How the UI responds:**
- Highlights the main action button with bright colors
- Makes it larger and more prominent
- Adds a subtle border to draw attention

**Why this helps:**
When people are confused, they need clear guidance. By making the most important action obvious, we reduce their mental effort and help them move forward confidently.

**Duration:** 3 seconds

---

## Pattern 2: Hover Relief

**What triggers it:**
- User hovers over the same areas repeatedly (hover-repeat)
- Shows indecision or uncertainty about options

**How the UI responds:**
- Softly fades other tiles with gentle blur
- Highlights the focused area with warm pink glow
- Creates gentle breathing animation to calm anxiety

**Why this helps:**
When people hover repeatedly, they're often feeling uncertain. The soft, warm response reduces pressure and creates a calming environment for decision-making.

**Duration:** 4 seconds

---

## Pattern 3: Navigation Guide

**What triggers it:**
- User navigates back and forth between options (backtrack behavior)
- Shows navigation uncertainty or lost feeling

**How the UI responds:**
- Pulses the current area with teal/green colors
- Adds subtle arrow hints on other tiles
- Creates directional visual cues for guidance

**Why this helps:**
When someone is backtracking, they need gentle guidance. The arrows and directional pulses help them understand their path without being overwhelming.

**Duration:** 3.5 seconds

---

## Pattern 4: Attention Re-centering

**What triggers it:**
- User stays focused on one area for an extended time (dwell behavior)
- Shows deep concentration or careful consideration

**How the UI responds:**
- Gently pulses the focused area with soft animation
- Uses calming blue colors to reinforce attention
- Provides subtle feedback without interruption

**Why this helps:**
When someone is deeply focused, we want to support that state without breaking their concentration. The gentle pulse confirms they're in the right place and encourages continued engagement.

**Duration:** 4 seconds

---

## Implementation Notes

### Pattern Recognition
- Each pattern watches for specific user behaviors
- Behaviors are detected through interaction signals
- Only one pattern can be active at a time to avoid chaos

### Response Timing
- All patterns have automatic timeouts
- Visual changes fade away naturally
- System returns to normal state cleanly

---

## Usage Guidelines

**When to use these patterns:**
- In complex interfaces where users might get lost
- During important decision-making moments
- When user testing shows confusion or hesitation

**When NOT to use:**
- In simple interfaces with obvious actions
- During fast, confident user workflows
- When visual changes might be distracting

**Customization:**
- Adjust timing based on your users' pace
- Modify visual intensity for your brand
- Test with real users to validate effectiveness

---

## Technical Integration

These patterns work with any web interface by:
1. Detecting user behavior signals
2. Mapping signals to appropriate patterns
3. Applying visual responses through CSS classes
4. Automatically cleaning up after timeout

