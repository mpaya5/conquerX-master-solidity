# Rust Introduction

This document provides an overview and study notes for **Rust**, a general-purpose, compiled programming language that has gained immense popularity among developers for its performance, safety, and ease of use.

## What is Rust?

Rust is a:

- **Compiled programming language**: Rust's compiler translates source code into machine code that can be executed by a processor.
- **General-purpose language**: Rust is designed to solve a wide range of problems using various data structures, procedures, and instructions.
- **Strongly typed language**: It emphasizes clear, strict types and ownership rules to ensure memory safety.
- **Multi-paradigm**: Supports multiple programming styles:
    - **Functional programming**
    - **Imperative programming**
    - **Object-oriented programming**

### Why Choose Rust?

- **Open-source**: Rust is free software, allowing anyone to contribute to its development and use it without restrictions.
- **Simple interface**: Rust provides high-level abstractions that ease the programmer's workload while still offering low-level control.
- **Performance and stability**: Rust programs are fast and efficient, while the compiler's checks guarantee the stability of the code, even through refactorings.

### Who Should Learn Rust?

- **Development teams**: Rust offers tools that enhance both productivity and safety in large development environments.
- **Students**: Rust is ideal for those learning systems programming or needing experience with low-level programming while maintaining safety guarantees.

## Tools for Rust

1. **Cargo**: Rust’s package manager and build system, which simplifies dependency management and project setup.
2. **rustfmt**: A formatting tool that ensures consistent code style.
3. **rust-analyzer**: Provides integrations with IDEs for code autocompletion and intelligent suggestions.

## Setting Up the Environment

### Windows Installation

1. Go to [Rust installation page](https://www.rust-lang.org/tools/install).
2. Download and run the installer.
3. Follow the on-screen instructions, and you may need to install Visual Studio C++ Build Tools.

### Linux/macOS/WSL Installation

1. Run the following command in your terminal to download rustup:
    
```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```
    
2. Execute the script:
    
```bash
sh rustup.sh    
```
    
3. Verify that Rust is installed:
    
```bash
rustc --version
    
```

## Using Cargo to Create a Project

To use **Cargo** for project management:

1. Verify Cargo is installed:
    
```bash
cargo --version    
```
    
2. Create a new project:
    
```bash
cargo new hello_cargo
cd hello_cargo    
```
    

Cargo will create a `Cargo.toml` file and a `src` directory with `main.rs`. The code in `main.rs` will be similar to the basic Hello World example.

1. Compile and run the project:
    - To check if the code compiles correctly:
        
    ```bash
    cargo check
    ```
        
    - To build the project:
        
    ```bash
    cargo build
    ```
        
    - To run the project:
        
    ```bash
    cargo run
    ```
        
    
    The terminal should display:
    
    ```
    Copiar código
    Hello, world!
    
    ```
    

## Basic Concepts in Rust

In the next lessons, the following Rust concepts will be covered:

- **Variables and mutability**: Learn how to declare and modify variables.
- **Data types**: Understand Rust’s primitive and compound types.
- **Functions**: Define reusable blocks of code.
- **Control flow**: Implement decision-making logic in your programs.