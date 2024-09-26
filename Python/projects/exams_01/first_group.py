# 1.1: Implement a function that receives a list of strings and returns the longest common prefix.
# If there is no common prefix, return an empty string.
#
# Example:
# Input: ["flower", "flow", "flight"]
# Output: "fl"
#
# Considerations:
# - The function should be efficient in handling long lists with varying string lengths.

def longest_common_prefix(strs):
    if not strs:
        return ""
     
    prefix = strs[0]
            
    for string in strs[1:]:
        while not string.startswith(prefix):
            prefix = prefix[:-1]
            if prefix == "":
                return ""
    
    return prefix


assert(longest_common_prefix(["flower", "flow", "flight"]) == 'fl')


# 1.2: Given a list of integers, implement a function that finds all unique triplets (a, b, c)
# such that a + b + c = 0.
#
# Example:
# Input: nums = [-1, 0, 1, 2, -1, -4]
# Output: [[-1, 0, 1], [-1, -1, 2]]
#
# Considerations:
# - Avoid duplicate triplets.
# - The function should be optimized for large lists.

def find_triplets(nums):
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue  # Skip duplicate elements
        
        left, right = i + 1, len(nums) - 1
        
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                
                while left < right and nums[left] == nums[left + 1]:
                    left += 1  # Skip duplicates
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1  # Skip duplicates
                
                left += 1
                right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    
    return result

nums = [-1, 0, 1, 2, -1, -4]
assert(find_triplets(nums) == [[-1, -1, 2], [-1, 0, 1]])


# 1.3: Write a function that takes a list of integers and returns the product of the maximum
# and minimum integers in the list. You cannot use the built-in min() or max() functions.
#
# Example:
# Input: [1, -3, 4, 2, -1]
# Output: -3 (product of -3 and 1)
#
# Considerations:
# - Ensure that the solution handles both positive and negative numbers.

"""
def max_min_product(nums):
    nums.sort()
    max_num = nums[-1]
    min_num = nums[0]
    
    return max_num * min_num
    
This function is way slower: O(n^log^n) than the function below
"""
def max_min_product(nums):
    max_num = nums[0]
    min_num = nums[0]
    
    for num in nums:
        if num > max_num:
            max_num = num
        if num < min_num:
            min_num = num
    
    return max_num * min_num

nums = [1, -3, 4, 2, -1]
assert(max_min_product(nums) == -12)