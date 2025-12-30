# How Behaviors Connect to UI Changes

This shows the complete flow from what users do to how the interface responds.

## The Connections

### Undo Loop → Focus Assist
**What I see:** User clicks undo repeatedly 
**What I do:**
- Bright highlight with warm colors
- Add visible border
- Duration: 3 seconds
**Message:** "Try this one"

### Hover Repeat → Hover Relief
**What I see:** User hovers over same area multiple times
**What I do:**
- Fade other elements with blur
- Give focused element soft pink glow
- Add gentle breathing animation
- Duration: 4 seconds
**Message:** "Take your time here"

### Long Dwell → Attention Re-centering
**What I see:** User stays focused on one area for extended time
**What I do:**
- Pulse element with calm blue colors
- Smooth, continuous animation
- Reinforce current focus
- Duration: 4 seconds
**Message:** "You're on the right track"

### Backtrack → Navigation Guide
**What I see:** User navigates back and forth between sections
**What I do:**
- Pulse current element with teal/green
- Show arrow hints on other elements
- Provide directional guidance
- Duration: 3.5 seconds
**Message:** "Here's where you are and where you can go"

## The Technical Flow
```
User does something → I detect the pattern → I pick a response → CSS changes happen → Auto cleanup
```

## Timing Rules I Follow
- **Throttle**: 1 second between same signals (no spam)
- **Debounce**: 100ms processing delay (smooth operation)
- **Duration**: 3-4 seconds per pattern (not too long)
- **Limit**: Only one pattern at a time (no chaos)

## What Each Behavior Tells Me
- **Confusion** → needs clear guidance
- **Indecision** → needs calm focus
- **Deep focus** → needs gentle reinforcement
- **Lost navigation** → needs directional help

