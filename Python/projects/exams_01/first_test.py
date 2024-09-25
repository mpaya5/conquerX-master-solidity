# Question 1:
# Implement a function that takes a list of integers and returns a list of all unique pairs (a, b)
# where 'a + b = target'. Your solution should be efficient in terms of time and space complexity.
# 
# Example:
# Input: nums = [1, 3, 2, 2, 3, 4, 5], target = 5
# Output: [(1, 4), (2, 3)]
#
# Considerations:
# - The function should avoid duplicate pairs, e.g., (2, 3) and (3, 2) should be treated as the same.
# - Try to achieve an O(n) time complexity.

def find_pairs(nums, target):
    result = set()
    seen = set()

    for n in nums:
        compliment = target - n
        if compliment in nums:
            result.add((min(n, compliment), max(compliment, n)))
            
        seen.add(n)

    return list(result)

nums = [1, 3, 2, 2, 3, 4, 5]
target = 5

print(find_pairs(nums, target))

# Question 2:
# You are given an API that receives multiple asynchronous requests to retrieve data from a blockchain network.
# Implement a Python function using async/await that fetches data from this API for a list of given IDs
# and returns the results once all requests are completed.
#
# You can assume there's a function `async def fetch_data(id):` that retrieves data for a specific ID.
# Your task is to create an `async def fetch_all_data(ids)` function that efficiently fetches data for all IDs.
# 
# Example:
# Input: ids = [1, 2, 3]
# Output: [{"id": 1, "data": ...}, {"id": 2, "data": ...}, {"id": 3, "data": ...}]
#
# Considerations:
# - Handle potential exceptions that may arise during the fetching process.
# - Ensure that the program runs efficiently, even with many IDs.
import asyncio
async def fetch_data(id):
    await asyncio.sleep(0.2)
    return {"id": id, "data": f"Data for ID {id}"}

async def fetch_all_data(ids):
    tasks = [fetch_data(id) for id in ids]
    results = await asyncio.gather(*tasks)
    return results

ids = [1, 2, 3, 4, 5]
results = asyncio.run(fetch_all_data(ids))
print(results)

# Question 3:
# You are working on a microservices-based architecture where different services need to communicate using a message queue.
# Implement a simple Producer-Consumer example using Python that uses a queue to share data between a producer and a consumer.
# 
# - The producer should generate a list of numbers from 1 to 100 and place each number in the queue.
# - The consumer should read from the queue, square each number, and print it.
#
# Considerations:
# - Use the `queue.Queue` class for managing the queue.
# - Implement multi-threading to simulate concurrent execution of the producer and consumer.
# - Ensure that the consumer stops when all numbers have been processed.

from queue import Queue
import threading
import time

def producer(q):
    for i in range(1, 101):
        q.put(i)
        print(f"Produced: {i}")
        time.sleep(0.1)  # Simulate a small pause

    q.put(None) # To indicate is finshe

def consumer(q):
    while True:
        num = q.get()
        if num is None:
            break

        squared = num ** 2
        print(f"Consumed: {num} squared is {squared}")
        q.task_done()


def start_producer_consumer():
    q = Queue()
    
    producer_thread = threading.Thread(target=producer, args=(q,))
    consumer_thread = threading.Thread(target=consumer, args=(q,))
    
    producer_thread.start()
    consumer_thread.start()
    
    producer_thread.join()
    q.join() 


start_producer_consumer()
