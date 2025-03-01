// deno-lint-ignore-file
import { assertEquals, assertExists } from '@std/assert';
import banEnum from './ban_enum.ts';

const tSource = `enum Direction1 {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

enum Direction2 {
  Up,
  Down,
  Left,
  Right,
}

enum Direction3 { Up, Down, Left, Right }
enum Direction4 { Up = 'UP', Down = 'DOWN', Left = 'LEFT', Right = 'RIGHT' }
enum Direction5 { Up = 1, Down = 2, Left = 3, Right = 4 }

function something(dir: Direction1) {
  console.log(dir);
}`;

Deno.test('banEnum diagnostics checks', () => {
  const diagnostics = Deno.lint.runPlugin(banEnum, 'main.ts', tSource);
  assertEquals(diagnostics.length, 5);
});

Deno.test('banEnum fix test 1', () => {
  const diagnostics = Deno.lint.runPlugin(banEnum, 'main.ts', tSource);
  const d = diagnostics[0];
  assertExists(d.fix);
  const fixes = d.fix as any; // Should be array of {range:[number,number],text:''}
  assertEquals(fixes.length, 1); // Should only be one fix
  const first = fixes[0];
  assertEquals(
    first.text,
    'type Direction1 = "UP" | "DOWN" | "LEFT" | "RIGHT";'
  );
});

Deno.test('banEnum fix test 2', () => {
  const diagnostics = Deno.lint.runPlugin(banEnum, 'main.ts', tSource);
  const d = diagnostics[1];
  assertExists(d.fix);
  const fixes = d.fix as any;
  assertEquals(fixes.length, 1);
  const first = fixes[0];
  assertEquals(
    first.text,
    'type Direction2 = "Up" | "Down" | "Left" | "Right";'
  );
});

Deno.test('banEnum fix test 3', () => {
  const diagnostics = Deno.lint.runPlugin(banEnum, 'main.ts', tSource);
  const d = diagnostics[2];
  assertExists(d.fix);
  const fixes = d.fix as any;
  assertEquals(fixes.length, 1);
  const first = fixes[0];
  assertEquals(
    first.text,
    'type Direction3 = "Up" | "Down" | "Left" | "Right";'
  );
});

Deno.test('banEnum fix test 4', () => {
  const diagnostics = Deno.lint.runPlugin(banEnum, 'main.ts', tSource);
  const d = diagnostics[3];
  assertExists(d.fix);
  const fixes = d.fix as any;
  assertEquals(fixes.length, 1);
  const first = fixes[0];
  assertEquals(
    first.text,
    'type Direction4 = "UP" | "DOWN" | "LEFT" | "RIGHT";'
  );
});

Deno.test('banEnum fix test 5', () => {
  const diagnostics = Deno.lint.runPlugin(banEnum, 'main.ts', tSource);
  const d = diagnostics[4];
  assertExists(d.fix);
  const fixes = d.fix as any;
  assertEquals(fixes.length, 1);
  const first = fixes[0];
  assertEquals(
    first.text,
    'type Direction5 = 1 | 2 | 3 | 4;'
  );
});
