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

It works! It's time to introduce positioning multiple items as a child. We need to have a default strategy for what to do if an element has children to position.

This, in turn, introduces a hard concept: a parent is positioning children, which is closely tied to sizing. My idea for this is the following: parent tells the children what is the _strategy_ of positioning it takes, and children do the work of positioning themselves.

There are two different types of strategies (and we should write a compact, general guide on this).

- reactive strategies: parent needs recalculation after the children are positioned and sized. For instance, we make the parent match the size of children.
- proactive strategies: children need recalculation when parent renders them

An element never can be both.

These strategies divide between:

- sizing
- positioning

---

Hierarchy:

1. if the parent has a claim on how it wants to position children, it tells them by passing all relevant information for the children to alter their position
2. the children actually implement the relative positioning - that's because triangle might want to behave slightly differently than a rectangle
3. the children can overwrite the positioning preference of the parent, but never the type of it's strategy

Implementation

- Separate measure and layout phases.
- We can move objects around with .translate (and it updates its external information about where it is, but doesn't affect the layouting measurements etc)

First implementation example:

- start with implementing vertical stack with spacing as a proactive strategy and create an example with a few rectangles. that's gonna be a proactive strategy. we should take note of this in the code somehow.
- remember to respect box model - positioned children should be padded.
- don't implement any other infrastructure just yet. let's first test this.

# Feedback

Something very strange is happening around the last element, that is shifted horizontally to the center of the VStack (its top left corner leaves a gap sized of the previous element above it, and is horizontally centered to the center of vstack, instead to the left padding). When comment out the last element, it again applies to the last element.

# Prompt 5

Let's add a zIndex system and document MAXIMALLY BRIEFLY in guides (subfolder /new) what we've achieved so far.

# Feedback

With nested VStacks, we ran into an interesting problem: the inner VStack is weirdly shifted, e.g. it does not align left edges with the rectangle above (that one is positioned correctly). I don't quite understand why - we don't set the position on it, and on top of it, it overlaps its top edge with the bottom edge of the topRect. looks like the VStack implements some of its positioning methods differently than a normal rectangle (Which.. isn't correct, as after all, VStack is just a rectangle, but with VStack positioning ability). Stacking two rectangles one above another works nicely.

# Prompt 6

This works. Let's now create, in the simple nesting example, some debugging circles that confirm our position-retrieval helpers return correct absolute positions.

# Prompt 7

Let's add alignment to our VStack - alignment to the bottom, right, left, center, etc. This effectively means that differently sized elements should "stick" to a certain line.

The way I see this being implemented is that each child returns an alignment point based on the "where do align to", so for instance if we ask a rectangle to be aligned to the left, it returns it's leftCenter point.

We enter another interesting territory right now: if we would like to align items _vertically_ in a VStack, we'd effectively need to know how much space they take altogether. That means we could instead just add a property that makes it's vertical size _reactive_, meaning once it lays out children, only then we know its size.

Let's lay it out systematically:

- if VStack is given a size, we stick to that size. items within it are just aligned to the top.
- we can however make the VStack "auto adjust" to size of it's children (this shuold be on a per-axis basis and implemented on rectangle level). We can set its wight (or its width can be set by a parent), but its height may be reactive. This is a change in thinking from when I said "Element can't be both reactive and proactive" - a _dimension_ of element can't be.

Let's impement it and give it some intuitive name, and create a relevant example. Size alignment should respect the boxModel.

# Prompt 8

There's a bug. If the first element is the widest, it correctly auto-aligns. If not, it actually aligns items to the right or center - hard to tell why

// remember to respect box model in spacing - this doesnt happen now (looks like it does thougj)
// remember to respect the positioning point in autosizing - TBD (e.g i positioned the center of my thing to the artboard, and im autoresizing it, what now?)

# Prompt 9

Let's create a new example/experiment: a VStack with static size that aligns things to the center, and another VStack inside that has dynamic size and a few rectangles inside.

# Prompt 10

Let's refactor our VStack object to just be a Stack object, and allow choosing the direction. (horizontal vs. vertical.)

Let's then create an example that shows the simple horizontal direction, and another one, when we nest them

# Feedback

// we should refactor everything to be a VStack/HStack by default but first, let's make HStack

# Prompt 11

Brilliant! Things seem to work.

I would like you to reproduce the structure of "layout/core/etc" in "new" folder (rename newLayout to new).

# Prompt 12

Let's add new ability to our Container - to spread items along its width/height. It should only work if there's a fixed width attached to it, otherwise, it should just fit-to-size. Let's create an according example and add debug circles to make sure the elements return correct positions after the spread, including nesting horizontally spread and vertically spread things. Remember following our reactive/proactive philoopshy. (this is proactive positioning)

# Prompt 13

One thing that is special about artboard is that it should capture - in its autosizing - everything that is positioned absolutely. Probably this means simply traversing the entire tree of parents/children, checking what has been positioned absolutely, and grabbing its coordinates - in case we want to reactively size the artboard.
