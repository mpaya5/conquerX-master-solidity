// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

/**
 * @title ERC20 Token Contract
 * @dev Implementation of the ERC20 interface based on the OpenZeppelin standard.
 * The contract defines basic token functionality including balance management,
 * transfers, allowances, and minting/burning mechanisms.
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    // Events
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed from, address indexed to, uint256 amount);
}

/**
 * @title ERC20
 * @dev Implementation of the IERC20 interface with additional functionality 
 * such as minting, burning, and allowance management.
 */
contract ERC20 is IERC20 {
    // Stores the balances of each address
    mapping(address => uint256) private _balances;
    // Stores the allowances (spending limits) for each address
    mapping(address => mapping(address => uint256)) private _allowances;

    // The total supply of tokens
    uint256 private _totalSupply;
    // The name of the token
    string private _name;
    // The symbol of the token
    string private _symbol;

    /**
     * @dev Constructor sets the token name and symbol upon deployment.
     * @param name_ The name of the token.
     * @param symbol_ The symbol of the token.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals the token uses. Default is 18.
     */
    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    /**
     * @dev Returns the total supply of tokens.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev Returns the balance of a specific account.
     * @param account The address of the account to query the balance for.
     */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev Transfers tokens from the caller to a specified address.
     * @param to The recipient address.
     * @param amount The amount of tokens to transfer.
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = msg.sender;
        _transfer(owner, to, amount);
        return true;
    }

    /**
     * @dev Returns the remaining number of tokens that the spender is allowed
     * to spend on behalf of the owner.
     * @param owner The address of the token owner.
     * @param spender The address of the spender.
     */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev Sets the allowance for a spender to spend the owner's tokens.
     * @param spender The address of the spender.
     * @param amount The amount of tokens the spender is allowed to spend.
     */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, amount);
        return true;
    }

    /**
     * @dev Transfers tokens from one account to another, based on the allowance mechanism.
     * @param from The address of the sender.
     * @param to The address of the recipient.
     * @param amount The amount of tokens to transfer.
     */
    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Increases the allowance granted to a spender.
     * @param spender The address of the spender.
     * @param addedValue The amount to increase the allowance by.
     */
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    /**
     * @dev Decreases the allowance granted to a spender.
     * @param spender The address of the spender.
     * @param subtractedValue The amount to decrease the allowance by.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        address owner = msg.sender;
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }
        return true;
    }

    /**
     * @dev Internal function to transfer tokens.
     * @param from The address sending the tokens.
     * @param to The recipient address.
     * @param amount The number of tokens to transfer.
     */
    function _transfer(address from, address to, uint256 amount) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;

        emit Transfer(from, to, amount);
    }

    /**
     * @dev Internal function to approve tokens for spending.
     * @param owner The address of the owner of the tokens.
     * @param spender The address allowed to spend the tokens.
     * @param amount The amount of tokens approved for spending.
     */
    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Internal function to manage spending of allowances.
     * @param owner The address of the token owner.
     * @param spender The address allowed to spend the tokens.
     * @param amount The number of tokens to spend.
     */
    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= amount, "ERC20: insufficient allowance");
        unchecked {
            _approve(owner, spender, currentAllowance - amount);
        }
    }

    /**
     * @dev Internal function to mint new tokens.
     * @param account The address receiving the newly minted tokens.
     * @param amount The number of tokens to mint.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply += amount;
        unchecked {
            _balances[account] += amount;
        }

        emit Transfer(address(0), account, amount);
    }

    /**
     * @dev Internal function to burn tokens.
     * @param account The address holding the tokens to burn.
     * @param amount The number of tokens to burn.
     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
            _totalSupply -= amount;
        }

        emit Transfer(account, address(0), amount);
    }

    // Hooks to be overridden in derived contracts
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual {}
    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual {}
}
