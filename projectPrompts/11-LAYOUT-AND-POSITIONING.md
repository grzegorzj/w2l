# Comment

Peparation for creating more complicated layout things

# Prompt

Based on our documentation (in `/docs` and `/guides`), I want you to extend the library (source in `/lib`).

I want to add more positioning ability to our library.

- primitives should expose all their points (eg. rectangles should expose their corners, and those should give their positions), and typical geometric constructs like heights, diagonals (with outward and inward separation), etc. Create playground examples of it. Add a comment above each example with a prompt that could lead to its creation.

  - this means that all the transforms, translates, etc. have to update those positions. This has to happen on the level of element, it has to store a record of all points and make their positions retrievable.

- create another example displaying the ability to retrieve this points by drawing a line connecting two points. Add a primitive "line" for this.
