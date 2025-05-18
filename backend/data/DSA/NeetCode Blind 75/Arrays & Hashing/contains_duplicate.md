# Contains Duplicate

## Problem Statement
[LeetCode: Contains Duplicate](https://leetcode.com/problems/contains-duplicate/)

Difficulty: Medium

Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.

### Examples:
```
Example 1:
Input: nums = [1,2,3,1]
Output: true

Example 2:
Input: nums = [1,2,3,4]
Output: false

Example 3:
Input: nums = [1,1,1,3,3,4,3,2,4,2]
Output: true
```

## Solution Approach

### Hash Set Approach
The most efficient approach is to use a hash set to keep track of numbers we've seen. As we iterate through the array, if we encounter a number that's already in our set, we return `true`. If we get through the entire array without finding a duplicate, we return `false`.

- Time Complexity: O(n) - we iterate through the array once
- Space Complexity: O(n) - in the worst case, we store n-1 elements in our set

### Python Implementation
```python
def containsDuplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False
```

### Alternative Approaches

#### Sorting
We could also sort the array and check for adjacent duplicates.
```python
def containsDuplicate(nums):
    nums.sort()
    for i in range(1, len(nums)):
        if nums[i] == nums[i-1]:
            return True
    return False
```
- Time Complexity: O(n log n) - dominated by the sorting operation
- Space Complexity: O(1) or O(n) depending on the sorting algorithm

#### Brute Force
Compare each element with every other element in the array.
```python
def containsDuplicate(nums):
    n = len(nums)
    for i in range(n):
        for j in range(i+1, n):
            if nums[i] == nums[j]:
                return True
    return False
```
- Time Complexity: O(n²) - we have nested loops
- Space Complexity: O(1) - no extra space used

## Notes
- The hash set approach is optimal for this problem in terms of time complexity
- If memory is extremely constrained, the sorting approach might be preferable
- This is a fundamental problem that tests understanding of hash sets and their time complexity advantages
