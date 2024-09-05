# ERC20 Token

## Contents

1. What is an ERC20 token?
2. Variables
3. Functions

## What is an ERC20 Token?

- An ERC20 token is a smart contract that contains a predefined data structure.
- The Ethereum blockchain introduced the ERC20 standard for creating other tokens on its network.
- EIP-20: Ethereum Improvement Proposal.
- ERC20 is one of the most widely used tokens in the cryptocurrency world today (for example, BNB is an ERC20 token).
- Its purpose is to standardize the interface for creating and issuing new tokens on the network.
- It offers interoperability, compatibility, and security.
- Explore ERC20 tokens: https://etherscan.io/tokens

## Interface

- An interface in Solidity allows using an external contract without having its source code or without inheriting functionalities from another contract.
- Indexed parameters for logged events help search and filter these events.

## Variables

### ERC20 Variables

- A `mapping` stores the number of tokens owned by an address.

```solidity
mapping(address => uint256) private _balances;
```

- A second `mapping` allows assigning a certain number of tokens for a third party (spender) to manage. This can be seen as a loan.

```solidity
mapping(address => mapping(address => uint256)) private _allowances;
```

- An unsigned integer stores the total number of tokens in circulation.

```solidity
uint256 private _totalSupply;
```

- A string stores the name of the token (e.g., 'Ethereum', 'Polkadot').

```solidity
string private _name;
```

- A string stores the symbol of the token (e.g., 'ETH', 'DOT').

```solidity
string private _symbol;
```

## Functions

### Constructor

- The token needs a name and a symbol, which are defined when deploying the contract.

```solidity
constructor(string memory name_, string memory symbol_) {
    _name = name_;
    _symbol = symbol_;
}
```

### `virtual` and `override`

- **Virtual:** A virtual function allows a child contract to override its behavior.
- **Override:** The `override` functions replace the behavior of the base function.
- Functions declared in the interface are `virtual` by default and are overridden with `override`, making them customizable in inherited contracts.

### Unchecked

- This internal Solidity function is used to handle potential overflows, such as when subtracting from an unsigned integer, which can cause an overflow.

```solidity
uint8 num = 4;
unchecked { 
    num -= value;
}
```

- It is used to optimize gas consumption in situations where an overflow is expected but can be handled appropriately.

### Access Functions

- **`name()`**, **`symbol()`**, **`decimals()`**:
- Since the variables `_name` and `_symbol` are private, functions are defined to access their values.
- Solidity does not support decimal numbers, so a certain number of decimals is established (usually 18).

```solidity
function name() public view returns (string memory) {
    return _name;
}

function symbol() public view returns (string memory) {
    return _symbol;
}

function decimals() public view returns (uint8) {
    return 18;
}
```

### Supply and Balances

- **`totalSupply()`**: Returns the total number of tokens in circulation.

```solidity
function totalSupply() public view returns (uint256) {
    return _totalSupply;
}
```

- **`balanceOf()`**: Returns the number of tokens owned by an address using the `_balances` `mapping`.

```solidity
function balanceOf(address account) public view returns (uint256) {
    return _balances[account];
}
```

### Token Transfer

- **`transfer()`**: Allows sending tokens to another address. Internally calls `_transfer()`.

```solidity
function transfer(address recipient, uint256 amount) public returns (bool) {
    _transfer(msg.sender, recipient, amount);
    return true;
}
```

- **`_transfer()`**: Handles the logic of transferring tokens between addresses, ensuring that neither the sender nor the recipient is the zero address and that the sender has sufficient tokens. Then, it subtracts from the sender's balance and adds to the recipient's, emitting a `Transfer` event.

```solidity
function _transfer(address sender, address recipient, uint256 amount) internal {
    require(sender != address(0), "ERC20: transfer from the zero address");
    require(recipient != address(0), "ERC20: transfer to the zero address");

    uint256 senderBalance = _balances[sender];
    require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
    _balances[sender] = senderBalance - amount;
    _balances[recipient] += amount;

    emit Transfer(sender, recipient, amount);
}
```

### Allowance and Approval

- **`allowance()`**: Allows delegating a number of tokens to a third party (spender). Checks how many tokens the `spender` can use.

```solidity
function allowance(address owner, address spender) public view returns (uint256) {
    return _allowances[owner][spender];
}
```

- **`approve()`**: The token owner can give permission to a `spender` to manage a certain amount of tokens.

```solidity
function approve(address spender, uint256 amount) public returns (bool) {
    _approve(msg.sender, spender, amount);
    return true;
}
```

- **`_approve()`**: Handles the internal logic of approval. Verifies addresses and updates the nested `_allowances` `mapping`, emitting an `Approval` event.

```solidity
function _approve(address owner, address spender, uint256 amount) internal {
    require(owner != address(0), "ERC20: approve from the zero address");
    require(spender != address(0), "ERC20: approve to the zero address");

    _allowances[owner][spender] = amount;
    emit Approval(owner, spender, amount);
}
```

### Token Usage

- **`transferFrom()`**: This function allows the `spender` to transfer tokens from the owner's account to another address.

```solidity
function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
    _spendAllowance(sender, msg.sender, amount);
    _transfer(sender, recipient, amount);
    return true;
}
```

- **`_spendAllowance()`**: Handles the logic of token usage by checking the `spender`'s `allowance` and updating it if there are sufficient tokens. Then calls `_approve()`.

```solidity
function _spendAllowance(address owner, address spender, uint256 amount) internal {
    uint256 currentAllowance = allowance(owner, spender);
    require(currentAllowance >= amount, "ERC20: insufficient allowance");
    _approve(owner, spender, currentAllowance - amount);
}
```

### Allowance Adjustments

- **`increaseAllowance()`**: Adds more tokens to a `spender`'s allowance, calling `_approve()` to update the new allowance.

```solidity
function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
    _approve(msg.sender, spender, _allowances[msg.sender][spender] + addedValue);
    return true;
}
```

- **`decreaseAllowance()`**: Reduces a `spender`'s allowance, checking if they have enough tokens before updating the `mapping` with `_approve()`.

```solidity
function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
    uint256 currentAllowance = _allowances[msg.sender][spender];
    require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
    _approve(msg.sender, spender, currentAllowance - subtractedValue);
    return true;
}
```

### Token Creation and Burning

- **`_mint()`**: Creates a certain number of tokens and assigns them to an account, increasing the total number of tokens in circulation and emitting a `Transfer` event.

```solidity
function _mint(address account, uint256 amount) internal {
    require(account != address(0), "ERC20: mint to the zero address");

    _totalSupply += amount;
    _balances[account] += amount;
    emit Transfer(address(0), account, amount);
}
```

- **`_burn()`**: Destroys a certain number of tokens from an account, reducing the total number of tokens in circulation and emitting a `Transfer` event.

```solidity
function _burn(address account, uint256 amount) internal {
    require(account != address(0), "ERC20: burn from the zero address");

    uint256 accountBalance = _balances[account];
    require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
    _balances[account] = accountBalance - amount;
    _totalSupply -= amount;

    emit Transfer(account, address(0), amount);
}
```

### Hooks

- **`_beforeTokenTransfer()`** and **`_afterTokenTransfer()`**: These hooks are empty so that inherited contracts can define behavior before or after token transfers. As they are virtual, they can be overridden.

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual { }

function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual { }
```