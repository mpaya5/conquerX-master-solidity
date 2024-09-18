"""
Inventory Management Problem:

    Imagine you work for a logistics company, and your task is to develop an inventory management system. 
    The inventory is represented as a list of products, sorted by their 'code' (code). 
    Each product is described as a dictionary with the keys 'code' (product code) and 'quantity' (quantity).

    Your objective is to implement a recursive function that performs a binary search on this inventory 
    to return the available quantity of a specific product, given its 'code'.

    The function 'search_product(inventary, code)' should take two inputs:
    - 'inventary': a sorted list of dictionaries, each dictionary representing a product with 'code' and 'quantity' keys.
    - 'code': the product code you're searching for.

    The function should return the quantity ('quantity') of the product that matches the given 'code'.

    Example input and output:
    Input:
    - Inventory of products (a list of dictionaries, each containing 'code' and 'quantity')
    - Product code (code) you're searching for

    Output:
    - The quantity (quantity) of the product that matches the given 'code'

"""

def main(inventory: list[dict], code: int):
    def search_product(inventory: list[dict], code: int, izq: int, der: int):
        if izq > der:
            return -1  # Return -1 if the product is not found
        
        medio = (izq + der) // 2
        
        if inventory[medio]['code'] == code:
            return inventory[medio]['quantity']
        elif inventory[medio]['code'] > code:
            return search_product(inventory, code, izq, medio - 1)
        else:
            return search_product(inventory, code, medio + 1, der)
        
    return search_product(inventory, code, 0, len(inventory) - 1)


inventory = [
    {"code": 1, "quantity": 8954},
    {"code": 2, "quantity": 2312},
    {"code": 3, "quantity": 5436},
    {"code": 4, "quantity": 456},
    {"code": 5, "quantity": 223},
    {"code": 6, "quantity": 45},
    {"code": 7, "quantity": 665},
    {"code": 8, "quantity": 785}
]

assert(main(inventory, 4) == 456)
assert(main(inventory, 7) == 665)
assert(main(inventory, 2) == 2312)

print("All tests passed!")