"""
Towers of Hanoi:

    You have a set of disks numbered from 1 to N and three towers labeled A, B, and C. 
    Initially, tower A holds all the disks stacked in descending order, 
    with disk N on the bottom and disk 1 on the top.

    The objective is to implement a recursive solution to move all the disks from tower A 
    to tower C, following the classical rules of the Towers of Hanoi puzzle:

    1. You can move only one disk at a time to an adjacent tower.
    2. You can only move a disk to the top of another stack if the stack is empty or if the disk
    on top of the target tower is larger than the one you're placing.

    The function 'torres_de_hanoi(n, origen, destiny, auxiliar)' takes the total number of disks n, 
    the source tower (origen), the destination tower (destiny), and an auxiliary tower (auxiliar).
    The function should recursively print the steps required to move all the disks from tower A to tower C.

    Example input and output:
    Input:
    - Number of disks: N
    - Towers: source (A), destination (C), auxiliary (B)

    Example output (for N = 2):
    Move disk from tower A to tower B
    Move disk from tower A to tower C
    Move disk from tower B to tower C
"""

def main(n: int):
    def torres_de_hanoi(n: int, origen: str, destiny: str, auxiliar: str):
        if n == 1:
            print(f"Move disk {n} from tower {origen} to tower {destiny}")
            return
        # Move n-1 disks from origen to auxiliar, using destiny as auxiliary tower
        torres_de_hanoi(n-1, origen, auxiliar, destiny)
        print(f"Move disk {n} from tower {origen} to tower {destiny}")
        
        # Move n-1 disks from auxiliar to destiny, using origen as auxiliary tower
        torres_de_hanoi(n-1, auxiliar, destiny, origen)

    origen = 'A'
    destiny = 'C'
    auxiliar = 'B'

    torres_de_hanoi(n, origen, destiny, auxiliar)


main(5)
