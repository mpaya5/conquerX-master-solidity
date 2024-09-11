# Rust Basics

This document covers fundamental Rust concepts such as variables, data types, functions, and control flow, including examples.

## Common Programming Concepts

### Variables

- In Rust, variables are **immutable** by default, meaning their values cannot be changed after they're assigned.
- If you need to modify a variable, you can make it **mutable** by using the `mut` keyword:

```rust
let mut x = 5;
x = 6; // Now x can be changed.

```

### Constants

- Constants are similar to immutable variables, but their values must be explicitly typed and cannot be changed throughout the lifetime of a program.
- Constants are declared using the `const` keyword:

```rust
const MAX_POINTS: u32 = 100_000;

```

### Shadowing

- Rust allows the **shadowing** of variables, meaning you can declare a new variable with the same name as a previous one, effectively replacing it.

```rust
let x = 5;
let x = x + 1; // x is now 6.
let x = x * 2; // x is now 12.

```

## Data Types

Rust is a **statically typed** language, which means every value has a specific type that must be known at compile time.

### Scalar Types

Scalar types represent a single value. Rust has four main types of scalars:

1. **Integers**: Signed (`i`) and unsigned (`u`) integers.
    - Sizes: `i8`, `i16`, `i32`, `i64`, `i128`, `isize`, and `usize`.

```rust
let x: i32 = 42;

```

1. **Floating-point numbers**: `f32` (32-bit) and `f64` (64-bit).

```rust
let y: f64 = 3.14;

```

1. **Booleans**: Can be either `true` or `false`.

```rust
let is_active: bool = true;

```

1. **Characters**: Represent a Unicode scalar value, enclosed in single quotes.

```rust
let letter: char = 'A';
let emoji: char = '😊';

```

### Integer Overflow

If an integer overflows (i.e., exceeds its range), Rust provides several methods to handle this:

- `wrapping_*`, `checked_*`, `overflowing_*`.

### Compound Types

Compound types allow grouping multiple values into one type.

1. **Tuples**: Group values of different types. Tuples have a fixed length.

```rust
let tup: (i32, f64, bool) = (500, 6.4, true);

```

1. **Arrays**: Contain multiple values of the same type with a fixed length.

```rust
let arr: [i32; 3] = [1, 2, 3];

```

## Functions

- Functions are defined using the `fn` keyword followed by a name and parentheses. The function body is enclosed in curly braces `{}`.
- The entry point for a Rust program is the `main` function:

```rust
fn main() {
    println!("Hello, world!");
}

```

### Parameters

- Functions can take **parameters**, which are variables passed into the function:

```rust
fn add(x: i32, y: i32) -> i32 {
    x + y
}

```

### Statements and Expressions

- **Statements** perform actions and **do not return** values.
- **Expressions** evaluate to a value and **return** that value.

```rust
let y = {
    let x = 3;
    x + 1 // This is an expression.
}; // y is now 4.

```

### Return Values

- Functions can return values using an expression without a semicolon:

```rust
fn five() -> i32 {
    5
}

```

## Control Flow

Control flow structures allow conditional execution of code.

### `if` Expressions

- Rust's `if` expressions allow branching logic. `if` can be followed by an optional `else`.

```rust
let number = 5;

if number < 5 {
    println!("Condition was true");
} else {
    println!("Condition was false");
}

```

### Using `if` in a `let` Statement

- `if` expressions can return values that can be assigned to variables:

```rust
let condition = true;
let number = if condition { 5 } else { 6 }; // number is 5.

```

### Loops

Rust has three kinds of loops: `loop`, `while`, and `for`.

1. **`loop`**: Loops infinitely until explicitly told to stop using `break`.

```rust
loop {
    println!("Again!");
    break; // Stops the loop.
}

```

1. **`while`**: Repeats while a condition is true.

```rust
let mut number = 3;

while number != 0 {
    println!("{}!", number);
    number -= 1;
}

```

1. **`for`**: Iterates over a collection of items.

```rust
let array = [10, 20, 30, 40, 50];

for element in array {
    println!("The value is: {}", element);
}

```

## Comments

- Single-line comments start with `//`.

```rust
// This is a comment.

```

- Multi-line comments are enclosed between `/*` and `/`.

```rust
/*
This is a
multi-line comment.
*/

```