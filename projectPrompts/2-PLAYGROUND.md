# Comment

This is the prompt used to create the playground.

# Prompt

Given this project (reference to Architecture.md) and its documentation (explore `/lib`), create an interactive playground.

1. Key features for the playgorund

- I want to have a zoomable renderer (our library outputs SVG). Renderer should have grey background by default, and default background for Canvas should be white - it's not a property of the Canvas, but our way of handling transparency.
- I want resizable screen split (bottom/top) where on top I can see the rendered state, and at the bottom I have my console.
- I want an autocomplete that is able to highlight potential choices similarly to what VSCode does
- I want the playground to execute my code on demand (not automatically)
- I want the playground to have the ability to save code and SVGs (both splits should have a separate "save" button) to a folder; add that folder to .gitignore

2. Specifics

- I want the playground to be in `/playground`
- Add an npm command to run the playground

# Feedback

- The split of the screen should start with 50% renderer, 50% console
- Remove all emojis from the playground
- Make buttons smaller with very dark grey colors (Linear style)
- Make the split vertical rather than horizontal - I was wrong about this idea.

# Feedback 2

- Code on the left, result on the right please.
