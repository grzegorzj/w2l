# Comment

We need a box model for elements

# Prompt

We "forgot" box model for elements. Right now, most out elements deeply rely on positions - those positions are absolute. I reckon they should remain so, but we should just consider a "BoxModel" element to be something that can affect, align, and move around its children (so essentially layout similar to what Grid, VStack, HStack, etc is). In that sense, we could copy the model of CSS:

- border box
- margin
- padding
- content

And by default, for we return positions of "borderBox" (like now), but we could add parameters to return positions of other things.

By the way, currently the padding of artboard does not exactly work - it doesn't translate the contents by padding.
Try to fix this as possibly uninvasively and extend the model by those (ideally, for anything that's Rectangle like - we could extend Rectangle by those).

Write an example that uses those methods to highlight different parts of that box model.
