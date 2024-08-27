# Operations with Ethers and Advanced Functions in Solidity

This repository contains a comprehensive guide on handling Ether transactions and advanced functions in Solidity, the programming language used for developing smart contracts on the Ethereum blockchain.

## Contents

1. [Using the `payable` Modifier](https://www.notion.so/Modificador-P-a47080c7dc1f40d5ad500304c715c18c?pvs=21)
2. [Fallback and Receive Functions](https://www.notion.so/Modificador-P-a47080c7dc1f40d5ad500304c715c18c?pvs=21)
3. [Advanced Functions](https://www.notion.so/Modificador-P-a47080c7dc1f40d5ad500304c715c18c?pvs=21)

## Using the `payable` Modifier

### Ether Transactions

In Solidity, there are three primary functions to send Ethers to an Ethereum address. When transferring Ethers between contracts, the `transfer` function is recommended as it automatically reverts the transaction in case of failure.

- **Transfer**
- **Send**
- **Call**

### `transfer`

The `transfer` function delegates 2300 units of gas and is used as follows:

```solidity
transfer(amount);
transfer(1 ether);
```

### `send`

The `send` function also delegates 2300 units of gas and returns a boolean indicating the success of the transaction:

```solidity
solidityCopiar código
bool status = send(amount);
bool status = send(1 ether);

```

### `call`

The `call` function allows for customizing the amount of gas delegated and returns both the transaction status as a boolean and additional data in a bytes variable:

```solidity
solidityCopiar código
(bool status, bytes data) = call{value: amount, gas: gasUnits}("DATA");
(bool status, bytes data) = call{value: 1 ether, gas: 2300}("");
(bool status, bytes data) = call{value: 1 ether}("");

```

### Ether Units

Solidity uses different denominations of Ether, with `wei` being the smallest unit:

| Unit Name | Wei Value |
| --- | --- |
| Wei | 1 |
| Kwei | 1E+03 |
| Mwei | 1E+06 |
| Gwei | 1E+09 |
| Twei | 1E+12 |
| Pwei | 1E+15 |
| Ether | 1E+18 |

By default, Solidity operates in `wei`.

## Fallback and Receive Functions

### Overview

These functions are automatically triggered when a smart contract receives Ethers. The specific function that is activated depends on the content of `msg.data`.

### Function Selection

- If `msg.data` is empty, the `receive()` function is called if it exists. Otherwise, the `fallback()` function is triggered.
- If `msg.data` contains data, only the `fallback()` function is called.

### Declaration

```solidity
solidityCopiar código
fallback() external payable {
    // Fallback logic
};

receive() external payable {
    // Receive logic
};

```

## Advanced Functions

### `require`

The `require` function sets a condition that must be met. If the condition is not satisfied, an error is thrown, and the execution of the function is halted.

```solidity
solidityCopiar código
require(<condition>, "Error message if the condition is not met");

```

### `modifier`

The `modifier` function allows you to change the behavior of functions in a flexible manner by including additional logic before and/or after the main function code.

```solidity
solidityCopiar código
modifier name_modifier(type var1, type var2 ...) {
    require(<condition>);
    _;
}

function function_name()[public][view] name_modifier(var1, var2 ...) {
    // Function logic
}

```

---