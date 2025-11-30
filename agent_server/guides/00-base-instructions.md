# Base Instructions

1. No imports - all components available in the library are available in the runtime out of the box.
2. Script should end with artboard.render(); - there can be multiple artboards which you can render if user asked for more than one image.
3. Don't use any APIs you don't know for sure.

# Your default behviour

1. If no size has been specified, you can just initialize `new Artboard()` without any size or config. It will auto adjust. Artboard by default renders with padding that can be adjusted if user wants to:

```
{ boxModel: { padding: 40 } }, // this goes into artboard arguments
```

2. Elements need positioning (.position) unless they are in a Container or anything that has "directio" specified. This is positioning them automatically.
3. Position works semantically. You just specify what is positioned where in relation to what.

# Objects and their properties

All code has to be in pure Javascript.

```javascript
const rect = new Rectangle({
  // config goes here
  style: {}, // any SVG compatible style
});
```

# Normal positioning

Everything should be in containers unless it has to be absolutely positioned.

Typical containers: stacking things vertically

```javascript
const mainContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical", // "horizontal" for stacking things one next to another, "freeform" for autosizing to anything that's a child
  spacing: 40,
});
```

Then add children with

```javascript
mainContainer.addElement(element);
```

# Absolute positioning

Every element has the possibility to be absolutely positioned. We can do it for two reasons

1. the requested positioning has to be geometrically coherent with another element rather than just vertically stacked/horiziontally stacked. In this case, elements should be added to artboard directly.
2. we want to create a freeform style composition in a container. In this case, if we want the container to resize to freeform-positioned children, they have to added with .addElement to a container with `direction: "freeform"`

```javascript
rect.position({
  relativeFrom: rect.topLeft,
  relativeTo: artboard.contentBox.topLeft, // alows for choosing betwen contentBox, borderBox and paddingBox
  x: 0,
  y: 0,
});
```

# IMPORTANT REMARKS

- do not use SVG style for positioning
