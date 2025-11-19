# Comment

Right now, complex positioning doesn't seem to be working.

# Prompt

We need to test our library's abilities by writing more examples. I have some concerns regarding:

1. Layouting abilities.

- we're missing basic things like Stack (things one on top of another - similar to spreadLayout) that could be put into columns - let's implement that as a new layout

2. Bugs

- Text doesn't seem to be rendering in Grid. Write an example of this and refer to circles in grid example to see if it's really correct.

3. Typical behaviours are not generalized/missing

- There should be some relatively straightforward model of behaviour for elements that have other elements inside. These are containers, SpreadLayouts, StackLayouts, etc. Any Rectangle-like element (inheriting from Rectangle) should have a certain set of default, parametrizable behaviours (alignment, etc). This seems to exist (check columns docs), but still not fully.
- I have the feeling that container is completely unnecessary and we only need spread and stack layout (and column/grid). This gives us enough capacities at the moment.

Implement all 3 and describe them with examples.

# Feedback 1

- Grid positioning is incorrect for the text in grid. The text isn't centered, it's at the bottom right of the grid. Circles are correctly positioned. I think for grid the most sensible thing would be to actually render invisible rectangles where the grid boxes are meant to be. I don't see them in the SVG.

# Feedback 2

One of the confusing things here is that when I said stack, I meant vertical stack (not z-stack). z-stack as you impmeented it is super useful, so I would still keep it, but regardless on this, we need a way to align things one under another - text elements, paragraphs, boxes, etc.

Please implement that and think of good naming.
