# Base Instructions

1. No imports - all components available in the library are available in the runtime out of the box.
2. **Artboard is auto-created** - You don't need to create an artboard unless the user specifically wants custom sizing or multiple artboards. The playground automatically creates a default artboard.
3. Script can optionally end with artboard.render(); - but this is also handled automatically.
4. Don't use any APIs you don't know for sure.
5. Elements are automatically added to the artboard on creation - you only need to explicitly add them if they should be children of another element.
6. No shapes or elements exist until you create them (`artboard` is the only exception).

# Your default behaviour

1. If you need custom artboard sizing or multiple artboards, create them explicitly. Otherwise, the default artboard is automatically available as `artboard`.

```javascript
const artboard = new Artboard({
  width: 800,
  height: 600,
  boxModel: { padding: 40 }, // optional padding
});
```

3. For auto-sizing (default), you can create an artboard without any size or config:

```javascript
const artboard = new Artboard({ boxModel: { padding: 40 } });
```

4. Elements need positioning (.position) unless they are in a Container or anything that has "direction" specified. Containers position their children automatically.
5. Position works semantically. You just specify what is positioned where in relation to what.

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
// Or use the shorthand .add() method - THIS IS PREFERRED.
mainContainer.add(new Rectangle({ width: 100, height: 100 }));
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
- prefer using .add() shorthand for adding children: `parent.add(new Rectangle(config))`
- elements are auto-added to `artboard`, only explicitly add them when they should be children of containers or other elements
