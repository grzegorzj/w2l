# Comment

This prompt will create a broader prompt/structure to implement more functions.

# Prompt

Given the existing library setup (have a look at 1-SCAFFOLDING), I want to grow the library.
There are two things I want to focus on right now: layout and positioning.

Let's create new folder in our library (layout) that will be taking care of the following concepts

- auto layouts of all forms:
  - columns
  - auto-spacing (align to somewhere, etc.)
  - repeated relationships (e.g. 20 dots that have to be anchored to one another with a margin)
  - etc.

Action plan:

1. Before we get to the main task, we should implement an abstract primitive called Element. Shape right now has some
   methods that are generally going to be used for everything (like translate, rotate, etc.). Elements may not be shapes, they can be points, text, and other things. Therefore, Shape should inherit those.

   Thre's also "Size" type that directly applies to Artboard at the moment. Let's rename this to RectangleSize as this is realistically true for all rectangles, and we can also make sure that our Rectangle uses this.

2. We need to come up with a good separation criteria between visible and invisible elements and spatial relationships.

Right now, a good example of an invisible element is side.outwardNormal. The separation of it isn't entirely clear,
but the idea is that for a side of each shape, you can produce a normal that goes outside of the shape and therefore move things along that line (useful for translations).

We are going to take it a notch further, and we probably will want to do something like:

```js
const container = new Container({ // an invisible container
    size: {width: "200px", height: "320px"}, // RectangleSize
    padding: "20px"; // works like in SVG CSS - this should be probably an extension of object that has LayoutableObject,
    // which allows for padding, margin, etc.
  });

container.position({ // centers the layout element in the center of the artboard
  relativeTo: artboard.center,
  relativeFrom: container.center,
  x: 0,
  y: 0,
});

const columns = new ColumnsLayout({ // columns are now inside of our container and fill it
  gutter: "20px",
  count: 3,
  style: // add style like in SVG CSS - this should be a propery of something like StylableObject
});

container.addElement(columns); // this automatically makes the columns fill the container

```

So we see a lot to implement here.

3. Let's implement the column logic as visible in the example above - we should add a new folder called "layouts" in "/lib" for this.

It would be also nice if our /docs generation actually has a index-of-content style of separation of what is in which folder, as the current separation is only along technical lines, and the code is growing fast.

Column (and overall Layouts) implementation:

- Layouts are rectangular Elements - they should derive from Rectangles. Investigate how Rectangle inherits its abilities
- Layouts should have the possibility of adding something _to them_. For instance, entire layout should expose each of its columns (.columns), and these columns should act like a container with extra abilities - anything added there is by default positioned inside of them, and _moving/translating/rotating/etc. the layout moves the contents_ (this is something that containers don't do now, but should).

Hierarchy of positioning when Layouts are involved should be as follows:

1. layouts; if something has no translations, it just renders inside of a layout it's been placed into. We essentially create a layout link between the element inside of the layout and the layout item. The behaviour of object is dependend on layout and their type. For instance, for most elements, columns would simply resize them to fit horizontally (or overflow, depending on the config), and align top top/bottom/left/right depending on config of the column.

Essentially, these are column styles - implement them simply as Stylable.

2. if something is inside of a Layout, but we call "position" on it, there's the difficulty of determining what has priority - and how do we act going forward. This means we are removing the thing from the layout and going forward, all subsequent movement happens in absolute terms.

We should write a documentation MD about positioning after we implmement this.

## ✅ COMPLETED

All tasks from this prompt have been successfully implemented:

1. ✅ Element base class created with positioning/transformation methods
2. ✅ RectangleSize type created and used across library
3. ✅ Container and Layout classes with child transformation
4. ✅ ColumnsLayout with automatic column management
5. ✅ Layout positioning hierarchy (layout-bound vs absolute)
6. ✅ Intelligent alignment system with `getAlignmentPoint()`
7. ✅ Full documentation created (POSITIONING.md, INTELLIGENT-ALIGNMENT.md)
8. ✅ Playground examples created and working
9. ✅ All tests passing

### Intelligent Alignment (Latest Addition)

Elements now intelligently choose their alignment point:

- **Left align**: Uses center of left edge (not center of element)
- **Right align**: Uses center of right edge
- **Top/Bottom**: Uses center of respective edge
- **Center**: Uses geometric center

This creates natural, intuitive alignment behavior in columns and layouts.

See:

- `INTELLIGENT-ALIGNMENT.md` - Full documentation
- `playground/examples/intelligent-alignment-demo.ts` - Visual demonstration

# Feedback 1

Let's improve the horizontalAlign: "left", verticalAlign: "center", etc. with the possibility of telling _what_ to align. right now its aligning centers of objects to the left, it would be cool if:

- every element had a property/function that says "if you align me to the X side of layout, that's the point you should take" f(alignTo: "left") => // returns coords of the left edge since we are aligning to the left;
- and we add a reasonable default to Element (center of the left edge if you align to the left, center)
- later we can implement some custom self-positioning behaviour to the elements, but it's not needed now.
