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

# Prompt 2

Step 2:

Let's follow up on our layouting. Let's add a concept of parent and a child:

- things are by default positioned relatively (like in HTML/CSS) to their parent
- there's box model - border, margin, padding, content
- we should add it as a separate type allowed for all rectangle-like objects, e.g. a key in config that says `boxModel`
- for the above, we need a Rectangle, which inherits from Shape, which inherits from Element. Right now Shape won't give us any functionality, but we can move the `Stylable` estensibility there.
- we should remember that Circle should inherit from the above
- we should introduce concept of children to Elements - just like now we are adding things to artboard, it should be possible to add them to other elements.
- by default using .position should position in relation to content part of box model, but it should be possible to choose between the 4 modes

# Feedback

We've got our first bug. The centre of the circle is shifted by padding in our example of centering with box-model. and .center is always the center! So it should be taking that center from the content zone.

Let's introduce a convention:

- by default, when we take .center (or any other "easy access" query for point in an element), we take the semantic meaning of it. In this case, .center is always going to be center of the content.
- if we want to be explicit, we should ALSO be able to write .borderBox.center or .paddingBox.center (even though they're all the same - a better example would be .paddingBox.centerLeft etc)

Let's try to do another thing - and add a debug rectangle that is width, height of the respective parts of the artboard (padding zone and content zone). Do it by retrieving them in the example, don't change the implementation. This way I will be able to see where is the padding zone.

---

So the visible debuggin problem here is that we didn't reduce the arboards content size to match the 800x600! 800x600 - padding \*2 in each dimension should be the content size. it should fit into the total dimensions of it.

# Prompt 3

Let's create an example which illustrates positioning in regards to different box model elements (as mentioned above). The border box, the padding box, the margin box, and the content box should be marked with a debugging element generated in-example.

# Prompt 4

It works! It's time to introduce positioning multiple items as a child. We need to have a default strategy for what to do if an element has multiple children.

This, in turn, introduces a hard concept: a parent is positioning children, which is closely tied to sizing. My idea for this is the following: parent only tells the children what is the _strategy_ of positioning it takes.

There are two different types of strategies (and we should write a compact, general guide on this).

- reactive strategies: parent needs recalculation after the children are rendered. For instance, we make the parent match the size of children.
- proactive strategies: children need recalculation when parent renders them

An element never can be both.

These strategies divide between:

- sizing
- positioning

---

Alignment:

- There should be hierarchy to how children are positioned

1. if the parent has a claim on how it wants to position children, it tells them by passing all relevant information for the children to alter their position
2. the children actually implement the relative positioning - that's because triangle might want to behave slightly differently than a rectangle
