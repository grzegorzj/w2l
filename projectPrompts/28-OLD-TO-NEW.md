# Comment

We need elements

# Prompt

We now need a broader move from the old elements to the new ones. We had a lot of interesting features in our old elements that inherit from the old box model. I want to bring these elements to our new version of the library. At the end of this refactoring, we'll simply get rid of "old", and change imports. I'll let you know when time comes.

1. Let's start with shapes. Create a new folder in playground/examples, and recreate all shape-related examples. To achieve this, you will need to move the shapes behaviour to our new style of positoining - but remember don't carry over their old positioning. To test if this works correctly, it would be best if we put them in columns just to demonstrte we're not breaking things invisibly.

# Feedback

OK! So we have two problems here

1. we specify the height of the column _container_, and the padding. this means that our children should be adjusted to that - it's proactive sizing (parent doesn't rerender that measure after their sizing). they should adopt to fill this (or: we could add an option that says contentHeight: fill, or something like that). right now they're just fixed to the same size, but they don't include the boxModel padding. it may be that in the future their height will be some sort of "auto" adjusted size to the content - totally fine, this would probably mean the parent has identical sizing.

2. the width of the column is explicitly defined, yet our container doesn't include it's own padding into size.

# Prompt 2

OK, now, the columns "alignment" actually doesn't really work. it does nothing to the children of the columns in question. also the naming alignment/columnAlignment is super confusing - can we simply rename it to vertical and horizontal alignment and give them intuitive values (top, center, botom etc, vs left, center, right)

i also understand that partly it's because one of them is COLUMNS alignment, but the differentiation there is so hard to make.

there's:

how we align columns (together to the top line, together to the bottom line of the biggest column)

columns is literally just a wrapper on the conatiner which works perfectly well, and container already has all the possibility to do this alignment, so that's how it should work. however, it doesnt have the ability to align items in the direction of its own stacking (e.g. if we say - we center items, and container has 3 items distributed vertically, their center is at the center of the container). we should implememnt that.

// TODO shouldn't be possible to set both column width and width to auto, it will explode in the future.

// TODO artboard should be able to resize to the absolutely positioned elements with 'auto'.

# Prompt 3

The autoresize of our artboard isnt reliable just yet. it affects positioning of other items, plus it
only works in the arboard element in a very hacky way as we call .render(). Let's get rid of this, and think through reactive sizing.

We earlier decided about some layouting principles:

# Prompt 2

- things are by default positioned relatively (like in HTML/CSS) to their parent
- there's box model - border, margin, padding, content
- by default using .position should position in relation to content part of box model, but it should be possible to choose between the 4 modes

THere is also mention of hierarchy in our prior docs;

There are two different types of strategies.

- reactive strategies: parent needs recalculation after the children are positioned and sized. For instance, we make the parent match the size of children.
- proactive strategies: children need recalculation when parent renders them

An element never can be both in a specific dimension (e.g. reactive and proactive height at the same time).

These strategies divide between:

- sizing
- positioning

Hierarchy:

1. if the parent has a claim on how it wants to position children, it tells them by passing all relevant information for the children to alter their position
2. the children actually implement the relative positioning - that's because triangle might want to behave slightly differently than a rectangle
3. the children can overwrite the positioning preference of the parent, but never the type of it's strategy

So far we did not have a lot of reactive sizing. Container can be sized reactively if it has elements that are autoarranged by itself, but there's no logic of adding elements to it and the Container adopting itself to them.

I propose a simple flow:

- we have been using ".addElement" syntax that deferred the decision/information of who is whose child. I suggest we change this to a parent-at-initialization strategy. This conceptually simplifies the whole thing. Let's write a short guide on that and rewrite the existing examples in `/playground/examples/new`
- we can change the position and sizing attrubutes of elements to setters, and setters would let know any parent that has any reactive sizing that it's about the time to change its size. It would then size itself in such way that the final computation of where the elements are about to get positioned aren't out of bounds.

Before we do that, I would like you to break down for me again how does our container's vertical/horizontal alignment work, as it works perfectly well and I don't want this to interfere with it - we're in brainstorming mode.
