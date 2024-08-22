# 1) Value Types and Functions in Solidity

## Contents

1. Value Types
2. Complex Data Structures
3. Functions
4. Practical Exercise

## Value Types

### Integer Variables

Represent integers without decimals.

- **Unsigned Integer Types (uint):**
  - `uint`, `uint8`, `uint32`, `uint256`
  - Bit size configurable in increments of 8. The default is 256 bits.
- **Signed Integer Types (int):**
  - `int`, `int8`, `int32`, `int256`

### Strings

Represent character strings.

- Value enclosed in double quotes (" ") or single quotes (' ').
- Example: `string variable_name;`

### Booleans

Two possible values: `true` or `false`.

- Example: `bool variable_name;`

### Addresses

Hold a 20-byte value (Ethereum addresses).

- Example: `address variable_name;`

### Bytes

Types: `bytes1`, `bytes4`, `bytes32`, `bytes256`

### Enums

User-defined data types.

- Restrict the variable to one of the predefined values.
- Example:

```solidity
enum NewType {Name1, Name2, Name3};
NewType variable_name;

```

## Complex Data Structures

### Structs

Allow creating custom data types.

Example:

```solidity
struct Example {
    address property1;
    string property2;
    uint8 property3;
}
```

### Arrays

A collection of elements of the same type.

- **Static Array:** Fixed size.

```solidity
uint32 strict_array[15];
```

- **Dynamic Array:** Variable size.

```solidity
uint32 dinamyc_array[];
```

### Mappings

Act as hash tables.

- Store data in key-value pairs.
- Example:

```solidity
mapping(keyType => valueType) variable_name;
```

- `keyType` (the key) can be any simple value type.
- `valueType` (the value) can be any value type, including structs, arrays, or another mapping.

## Functions

### Definition

Executable units of code within a contract.

- They can return values.
- **Example without return values:**

```solidity
function functionName(dataType parameter1, dataType parameter2) modifiers {
    // code
}
```
