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

3. Let's implement the column logic as visible
