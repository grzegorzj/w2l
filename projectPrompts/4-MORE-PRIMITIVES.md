# Comment

Before we go into sophistication, we need more primitives.

# Prompt

Have a look at the current `lib/geometry` folder, as much as the 1-SCAFFOLDING file that shows the purpose of the library. The geometry file shows an implmenetation of a triangle.

Your task:

- grow the implementation of the triangle. Add readable parameters to each of the sides, like outwardNormal, inwardNormal, generally create the possibility of reading them (these normals shouldn't be visible for the users). Unsure, but I could see how this should be a property of some generically used thing called "Side" in `/geometry` that just has this parameter (knows the direction inward/outward and can generate the normals, etc.)
- implement other primitives like circle, rectangle (add roundwd corners and squircle logic), square that inherits from rectangle
