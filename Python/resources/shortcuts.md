# Python Shortcuts and Conventions

## Overview

This document serves as a quick reference for commonly used Python shortcuts, built-in functions, and conventions. It's intended to help you remember useful methods and idiomatic ways of writing Python code.

## Table of Contents

1. Common Built-in Functions
2. List Comprehensions
3. Lambda Functions
4. Sorting
5. Enumerate and Zip
6. Unpacking
7. Set and Dictionary Operations
8. Useful Libraries

## Common Built-in Functions

These are some of the most frequently used built-in functions in Python:

| Function | Description |
| --- | --- |
| `len()` | Returns the length of an object (list, string, etc.). |
| `sum()` | Returns the sum of all elements in an iterable. |
| `min()` | Returns the smallest element in an iterable or among arguments. |
| `max()` | Returns the largest element in an iterable or among arguments. |
| `sorted()` | Returns a sorted list of the specified iterable. |
| `any()` | Returns`True`if any element of the iterable is true. |
| `all()` | Returns`True`if all elements of the iterable are true. |
| `abs()` | Returns the absolute value of a number. |
| `round()` | Rounds a number to a specified number of decimal places. |
| `range()` | Returns a sequence of numbers, typically used in loops. |
| `reversed()` | Returns a reversed iterator. |
| `enumerate()` | Returns an iterator that produces pairs (index, value). |
| `zip()` | Aggregates elements from multiple iterables. |
| `map()` | Applies a function to all items in an input list. |
| `filter()` | Filters elements based on a function. |

## List Comprehensions

List comprehensions provide a concise way to create lists. The basic syntax is:

```python
# Example: Creating a list of squares from 0 to 9
squares = [x**2 for x in range(10)]

# Example: Only include even squares
even_squares = [x**2 for x in range(10) if x % 2 == 0]
```

## Lambda Functions

Lambda functions are small anonymous functions defined using lambda. They are often used for short, simple operations:

```python
# Example: Create a lambda function that multiplies a number by 2
double = lambda x: x * 2
print(double(5))  # Output: 10
```

## Sorting

You can sort lists using the sorted() function or the sort() method for in-place sorting.

```python
# Sort a list of numbers
numbers = [5, 2, 9, 1]
sorted_numbers = sorted(numbers)  # Returns a new sorted list

# Sort in reverse order
sorted_numbers_desc = sorted(numbers, reverse=True)

# Sort based on a key
items = [('apple', 3), ('banana', 2), ('cherry', 1)]
sorted_items = sorted(items, key=lambda x: x[1])
```

## Enumerate and Zip

enumerate() adds a counter to an iterable:

```python
# Example
names = ['Alice', 'Bob', 'Charlie']
for index, name in enumerate(names):
    print(index, name)
```

zip() combines multiple iterables into a single iterator:

```python
# Example
list1 = [1, 2, 3]
list2 = ['a', 'b', 'c']
combined = list(zip(list1, list2))
# Output: [(1, 'a'), (2, 'b'), (3, 'c')]
```

## Unpacking

Python allows unpacking of iterables for cleaner and more readable code:

```python
# Example: Unpacking a list into variables
a, b, c = [1, 2, 3]

# Example: Using '*' to unpack
numbers = [1, 2, 3, 4, 5]
first, *rest = numbers
# first = 1, rest = [2, 3, 4, 5]
```

## Set and Dictionary Operations

Set Operations

Sets are unordered collections of unique elements:

```python
# Common operations
a = {1, 2, 3}
b = {3, 4, 5}
union = a | b         # {1, 2, 3, 4, 5}
intersection = a & b  # {3}
difference = a - b    # {1, 2}
```

Dictionary Comprehensions

You can create dictionaries using a similar syntax to list comprehensions:

```python
# Example: Create a dictionary with squares of numbers
squares = {x: x**2 for x in range(5)}
# Output: {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

## Useful Libraries

These libraries come in handy for various common tasks:

| Library | Description |
| --- | --- |
| collections | Provides specialized data structures like deque, Counter, defaultdict. |
| itertools | Functions for creating iterators for efficient looping. |
| functools | Higher-order functions like reduce() and lru_cache. |
| operator | Functions that correspond to standard operators (e.g., operator.add). |

## Final Notes

This guide provides a quick overview of useful Python shortcuts and conventions to help you write cleaner, more efficient code. Keep it handy as you work through your projects, and feel free to add more tips and tricks as you continue to learn!