# Pattern Library

These are the UI patterns I've built to help users when they get stuck. Each one watches for specific behaviors and responds with helpful visual changes.

## Focus Assist
When someone keeps hitting undo (usually means they're confused), the system highlights the main action button. Makes it bigger, brighter, with a subtle border. Basically says "hey, try this one." Lasts about 3 seconds.

## Hover Relief  
If I see someone hovering back and forth over options, they're probably deciding. So I fade out the other stuff and give the focused area a warm pink glow with a gentle breathing effect. Helps them focus without pressure. Goes for 4 seconds.

## Navigation Guide
When users bounce between sections (classic "I'm lost" behavior), I pulse the current area in teal and add little arrow hints elsewhere. Kind of like breadcrumbs but more visual. Runs for 3.5 seconds.

## Attention Re-centering
Sometimes people just need encouragement to keep going. When they're dwelling on something (good sign of focus), I give it a gentle blue pulse. Not distracting, just supportive. 4 second duration.

## Quick Combo
For the power users who click fast - I flash a quick highlight to acknowledge their speed. Keeps up with their pace instead of getting in the way. Short and sweet at 1.5 seconds.

## How It Works
Pretty straightforward: watch for behavior → match to pattern → apply CSS classes → clean up automatically. Only one pattern runs at a time to avoid chaos.

## When to Use This
- Complex dashboards where people get lost
- During important decisions
- Anywhere user testing shows confusion

Skip it for simple apps, gaming interfaces, or when users are already moving fast.

## Notes
All patterns fade out naturally. The system always returns to normal. I've found it works best when you start with just one pattern and add more gradually.

