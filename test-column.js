import { ColumnsLayout } from './dist/layout/ColumnsLayout.js';

const layout = new ColumnsLayout({
  count: 3,
  width: "900px",
  height: "400px"
});

console.log('Columns array:', layout.columns);
console.log('First column:', layout.columns[0]);
console.log('First column topLeft:', layout.columns[0]?.topLeft);
console.log('First column center:', layout.columns[0]?.center);
console.log('First column topCenter:', layout.columns[0]?.topCenter);
