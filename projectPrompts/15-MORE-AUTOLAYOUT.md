# Comment

We need more autolayout.

# Prompt

Referring to prompts 5- and 11-, I would like to enhance our libraries (`/lib`) layout abilities.

Currently, `position` method called on most elements just sets their absolute position in relation to another object and that's the typical way of going about things.

We have deep nesting, relative positioning, etc. There's reactive positioning example in `/playground/examples`, too.

We should have a general ability to cater to the following scenarios:

- "spread in the container" positioning. horizontally, vertically, alignt to top, align to left
- create a grid
- children behaviour (fill size, align to top, etc - this already exists with columns)

Implement this and try to make the most of this behaviour generic for the `Element` if it affects children. Layout elements also should expose methods that are allowing for retrieving their characteristic points, etc.

This includes changing position of those layout elements into "absolute, non layout mode". it shouldn't destroy the existing layout if i render 8 nice columns and decide to pick one and move it 20px to the left, the remainig 7 shouldn't react to it. By default they should be in "i am a layout element" mode, but if i choose to move one, that's also fine. This to an extent implies we don't really have a way of changing the amount of columns once drawn - once drawn, drawn and that's it. Validate that this is true for our columns now, and if not, make it happen.

# Feedback 1

OK, unfortunately there are bugs to be fixed.

Let's go example by example.

- In example 26., everything works correctly.
- In example 27, " Object literal may only specify known properties, and 'width' does not exist in type 'SpreadLayoutConfig'.(2345)" even though it does seem to render to 900px. We should use explicit units in pixels by the way.
- in 27, only circles in the first spreadLayout render at all, and they're sticking to the bottom of the spreadlayout, shifted by about 40-50px from the left.

Let's start with these bugs and take it from there.
