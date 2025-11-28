/**
 * Autoimport Test Example
 * 
 * This example demonstrates the autoimport feature.
 * 
 * How it works:
 * - When autoimport is ON and you click "Run", the import statement is automatically 
 *   added to the top of your code if it's missing
 * - Monaco editor always has proper imports for full IntelliSense
 * - You never need to write imports manually when autoimport is ON
 * 
 * Try this:
 * 1. Delete the import line at the top
 * 2. Click "Run" - the import will be automatically added back!
 * 3. Start typing "new Artboard" - you get full autocomplete
 * 4. Toggle autoimport OFF - you'll need to manage imports manually
 */

import { Artboard, Circle, Rect, Square, Triangle, Quadrilateral, Line, RegularPolygon, Text, TextArea, Latex, FunctionGraph, Side, Image, BezierCurve, Arrow, Angle, BarChart, Bar, DonutChart, DonutSlice, LineChart, DataPoint, Chart, BarLayer, LineLayer, AreaLayer, ScatterLayer, RadarChart, Container, Grid, Columns, Element, Shape, Rectangle, BoxAccessor, parseBoxValue, parseBoxModel } from "w2l";

const artboard = new Artboard({
  width: 400,
  height: 300,
  backgroundColor: "#f0f0f0",
  boxModel: { padding: 20 },
});

const circle = new Circle({
  radius: 50,
  style: {
    fill: "#4a90e2",
    stroke: "#2e5f8a",
    strokeWidth: 3,
  },
});

circle.position({
  relativeFrom: circle.center,
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0,
});

artboard.addElement(circle);

return artboard.render();

