# Visibility of Variables, Functions, and Events in Solidity

This repository contains a guide on the visibility of variables, functions, and events in Solidity, the programming language used to develop smart contracts on the Ethereum blockchain.

## Contents

1. [Visibility and Access Modifiers](#visibility-and-access-modifiers)
   - Types of visibility
   - Variable modifiers
   - Function modifiers
2. [Events](#events)
   - Declaration and usage of events
3. [Practice](#practice)
   - Practical exercise

## Visibility and Access Modifiers

### Types of Visibility

In Solidity, there are four main types of visibility that apply to both functions and state variables:

- **Public:** The variable or function is fully accessible from anywhere, regardless of the origin.
- **Private:** The variable or function is only accessible from within the smart contract in which it is declared.
- **Internal:** The variable or function is accessible from the contract in which it is declared and from contracts that inherit from it.
- **External:** Functions that are part of the contract's interface, meaning they can be called from other contracts or via transactions, but not internally within the same contract.

### Variable Modifiers

The access modifiers for variables are:

- **Public:** The variable is fully accessible from anywhere.
- **Private:** The variable is only accessible within the contract in which it is declared.
- **Internal:** The variable is accessible from the contract in which it is declared and from inherited contracts.
- **Memory:** The variable is temporarily stored in memory.
- **Storage:** The variable is permanently stored on the blockchain.
- **Payable:** The variable allows receiving and sending ethers.

> Note: If no modifier is specified, variables are `internal` by default.

### Function Modifiers

The access modifiers for functions are:

- **Public:** The function can be called from anywhere.
- **Private:** The function can only be called from within the contract.
- **Internal:** The function can be called from the contract and from inherited contracts.
- **External:** The function can only be called from outside the contract.
- **View:** The function does not modify data but can access it.
- **Pure:** The function neither modifies nor accesses the data.
- **Payable:** The function allows receiving and sending ethers.

> Note: If no modifier is specified, functions are `public` by default.

## Events

### What are They?

Events in Solidity are data structures that allow information to be sent from the blockchain to external users. They are useful for communicating that something has happened on the blockchain.

### Declaration and Usage

- **Declaration:** 
  ```solidity
  event EventName(type var1, type var2 …);
  ```
- **Usage:**
  ```solidity
  emit EventName(value1, value2 …);
  ```