# 3.1: Implement a producer-consumer model where the producer generates the first 50 prime numbers
# and adds them to a queue, and the consumer reads the numbers from the queue and prints their squares.
#
# Use multi-threading and the `queue.Queue` class to manage the communication.
#
# Considerations:
# - Ensure that the consumer stops once all prime numbers are processed.

from queue import Queue
import threading

def prime_producer(q):
    pass

def prime_consumer(q):
    pass

def start_prime_producer_consumer():
    pass


# 3.2: Create a producer-consumer model where the producer generates random floating-point numbers
# between 0 and 1 and places them in a queue. The consumer reads each number, multiplies it by 100,
# and prints the result rounded to 2 decimal places.
#
# Considerations:
# - The producer should generate 30 numbers and then signal the consumer to stop.

import random

def float_producer(q):
    pass

def float_consumer(q):
    pass

def start_float_producer_consumer():
    pass


# 3.3: Implement a producer-consumer model where the producer reads lines from a text file
# and places them in a queue, and the consumer reads each line, converts it to uppercase, and prints it.
#
# Use multi-threading and ensure that the consumer stops once all lines have been processed.

def file_producer(q, file_path):
    pass

def line_consumer(q):
    pass

def start_file_producer_consumer(file_path):
    pass
