# Lint Rule: Ban-Enum

Forbids usage of enums & attempts to provide a fix for replacing enum with type unions. The right side of enums with values is used at the type union values.

## Examples

Found enum:
```ts
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
```

Suggested fix:
```ts
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
```

Found enum:
```ts
enum Direction {
  Up = 1,
  Down = 2,
  Left = 3,
  Right = 4,
}
```

Suggested fix:
```ts
type Direction = 1 | 2 | 3 | 4;
```