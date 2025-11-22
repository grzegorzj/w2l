# Commet

Layout engine needs a rewrite.

# Prompt 1

In our library, we have an existing layout engine with box model and arboard.

I would like to create an entirely new folder inside of `/lib` - `newLayout` and try to rebuild the layout functionality, as the old one is problematic and very likely does't work. We will do it step by step, by starting with the most basic functionality.

We aim to maintain similar (ideally, identical) public API, but this is not forced if it's for whatever reason impossible.

Step 1:

Task:
Hirearchy. Let's start with a very simple idea that we can put an Element into an Element. That isn't going to be a property of _every_ Element, only a specific type that is of kind Layout.

We need to temporarily prepend our new elements with `New` (e.g. `NewLayout`) to avoid naming conflicts.

Let's also create a new Arboard that has no particular functionality other than rendering a 800x600px SVG by default, taking size, and being Stylable (we can use the old Stylable interface from Core, I think this doesn't conflict with what we're building).

Requirements:

- Let's start a healthy hierarchy of objects with basic functions:
  - Element (everything is an element, and has position - this can set and return position)
  - Rectangle (anything rectangular has some extra properties like topLeft, width, height, etc.)
  - Artboard (working as now, but with less position-related properties - only style and size for now, no autoresizing etc)

Coding guidelines:

- be brief, don't add excessive logging
