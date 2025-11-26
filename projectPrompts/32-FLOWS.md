# Comment

Flowcharts!

# Prompt

Let's create a couple of elements that are complex and designed to create flowcharts. 

We are entering the territory of needing theming. Let's create a concept of theme. There should be a default theme and then we should be able to supply a theme object to the artboard to style everything that's capable of using it. 

- Let's create some swiss design, cold, nice theming (black on white, some minimal double-borders with one accent border, not extremely strong contrast, etc) and API for that object
- Let's make artboard use our default theme
- And let's create a set of objects for flowcharts: 
1. Boxes (essentially styled containers) that can be anchored one to the other; would be cool if we can give them tints and content in Text
2. Node connectors we can use to connect them along a line that we can generate to avoid overlapping (that's like an evolution of an arrow that we can modify, add labels to, etc. They should be able to split in two, we should be probably able to guide them too.

Let's do those two and create a flowchart example.

# Prompt 2

Let's improve our example by having Flowchart as a generic element that adds steps and each step is connected to another with connetor, but the Flowchart is capable of planning the node connectors so that they don't collide. Find an algorithm that can do that and implement it in another example. (advanced example has an arrow run through the middle of "fix bugs"). Let's also make sure it accomodates the labels correctly. in terms of distance between nodes (e.g. approve/reject are too big and they touch both of the nodes). We can introduce some concept of minimum spacing between elements, basically, to guide that algorithm, and have a good default.