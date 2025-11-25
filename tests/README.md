# Snapshot Testing

This directory contains the snapshot testing framework for w2l.

## Overview

Snapshot tests run the example files in `playground/examples/tests/` and compare their output (SVG strings) against saved snapshots. When output changes, you can review and mark the changes as passed or failed.

## Usage

### Run tests interactively (default)

```bash
npm test
```

This will:
1. Run all tests from `playground/examples/tests/`
2. Compare output against saved snapshots in `tests/snapshots/`
3. Prompt you to accept/reject any changes
4. Show you a summary of test results

### Run tests non-interactively

```bash
npm test -- --no-interactive
```

This mode just reports changes without prompting for input. Useful for CI.

### Watch mode

```bash
npm test:watch
```

Automatically re-runs tests when:
- Library code changes (in `dist/`)
- Test files change (in `playground/examples/tests/`)

## How It Works

1. **Test Execution**: Each test file is dynamically imported and executed. Tests must `return artboard.render()` to produce output.

2. **Snapshot Comparison**: The output is compared against saved snapshots in `tests/snapshots/`. If no snapshot exists, one is created.

3. **Change Detection**: When output differs from the snapshot:
   - In interactive mode: You're prompted to accept or reject the change
   - In non-interactive mode: The change is reported

4. **Status Tracking**: Test status (passed/failed) is stored in `snapshot-status.json`

## File Structure

```
tests/
├── snapshot-runner.js      # Main test runner
├── snapshot-status.json    # Tracks pass/fail status
├── snapshots/              # Generated snapshots (gitignored)
│   ├── 01-basic-shapes.svg
│   ├── 02-triangles.svg
│   └── ...
└── README.md              # This file
```

## Adding New Tests

1. Add a new `.js` file to `playground/examples/tests/`
2. Make sure it imports from `"w2l"` and returns `artboard.render()`
3. Run `npm test` to generate initial snapshot
4. Mark it as passed or failed

## Example Test File

```javascript
import { NewArtboard, NewCircle } from "w2l";

const artboard = new NewArtboard({
  width: 400,
  height: 300,
});

const circle = new NewCircle({
  radius: 50,
  style: { fill: "#3498db" },
});

artboard.addElement(circle);

// Important: Return the render result
return artboard.render();
```

## Integration with Build System

Tests are automatically integrated with the build system:
- `npm run build` builds the library and runs tests
- `npm run dev:lib` watches for changes and runs tests in watch mode
- Tests ensure the latest built version from `dist/` is used

## Environment Variables

- `SHOW_LOGS=true`: Show console output from tests
- `NODE_ENV=test`: Suppress certain warnings

## Notes

- Snapshots are normalized for whitespace comparison
- All tests run in Node.js with ESM support
- Tests import from the built `dist/` directory
- Console output from tests is captured and can be shown with `SHOW_LOGS=true`

