# Comment

This is the prompt used to create the playground.

# Prompt

Given this project (reference to Architecture.md) and its documentation (explore `/lib`), create an interactive playground.

1. Key features for the playgorund

- I want to have a zoomable renderer (our library outputs SVG). Renderer should have grey background by default, and default background for Canvas should be white - it's not a property of the Canvas, but our way of handling transparency.
- I want resizable screen split (bottom/top) where on top I can see the rendered state, and at the bottom I have my console.
- I want an autocomplete that is able to highlight potential choices similarly to what VSCode does
