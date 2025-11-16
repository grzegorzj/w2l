# Comment

Let's try to include more complicated text primitives

# Prompt

Text is the essence of many graphics.

First of all, I would like to create the possibiliy of highlighting text in a way that allows programmatic querying.

This means that we need to give ourselves the possibility to retrieve coordinates of a concrete word, or even move the glyphs. Given we're rendering to SVG, we could do two things:

- a trivial highlight (we can do that and let's do that)
- querying for an individual word and wrapping it with more complicated elements on demand.

the latter would be also great if we later want to, for example, retrieve bounding box of the word. I don't know how can this work with our positioning that is currently stored _in our API_ is there a way to retrieve positions of individual words and expose them into our API? e.g. invisibly render them when the position is retrieved and retrieve it directly from browser-level APIs?

# Feedback 1

wouldnt it make more sense to, rather than estimate, just lazy-render the text, e.g. the moment when it's asked for any position, we render it where it should be and check?

this is slightly different to our existing positioning/rendering strategy, but im willing to change it

ideally, the smallest change would be basically render-at-each step behaviour. not too stupid, i honestly think that artboard.render() behaviour makes no sense (we always want to render it anyway, it's only saving the cycles). so i would lazy render - render when browser feedback needed + at the end when artboard.render() is called.

what do you think?

# Feedback 2

In your highlighting (with position) examples, positioning works but z-indices are such that the highlights overlay the words rather than are behind them. We should add the possibility of setting them manually for both text and the highlights. Update the example.

I also adjusted it to not export the SVG. It's enough you call artboard.render();
