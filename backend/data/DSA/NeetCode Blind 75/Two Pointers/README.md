# Two Pointers

This directory contains solutions to two-pointer technique problems from the Blind 75 list.

## Problem List

| # | Problem | Difficulty | Solution | Notes |
|---|---------|------------|----------|-------|
| 1 | [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/) | Easy | [Solution](./valid_palindrome.py) | Two Pointers from Ends |
| 2 | [3Sum](https://leetcode.com/problems/3sum/) | Medium | [Solution](./3sum.py) | Sorting + Two Pointers |
| 3 | [Container With Most Water](https://leetcode.com/problems/container-with-most-water/) | Medium | [Solution](./container_most_water.py) | Two Pointers from Ends |
| 4 | [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) | Hard | [Solution](./trapping_rain_water.py) | Two Pointers with Max Height Tracking |
| 5 | [Two Sum II - Input array is sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) | Medium | [Solution](./two_sum_sorted.py) | Two Pointers from Ends |

## Completion Status

- Completed: 0/5
- Progress: 0%

## Key Concepts

### Two Pointer Technique
- Uses two pointers to iterate through an array
- Reduces time complexity from O(n²) to O(n) for many problems
- Common patterns: start-end, fast-slow, sliding window

## Common Patterns

1. **Two pointers from opposite ends**
   - Example: Valid Palindrome - left pointer starts at beginning, right pointer at end
   
2. **Fast and slow pointers**
   - Used in linked list problems like cycle detection
   
3. **Multiple pointers with sorting**
   - Example: 3Sum - fix one element, use two pointers for the rest

4. **Height-based two pointers**
   - Example: Container With Most Water - maximize area between two pointers

## Solving Approach

For two pointer problems, consider:
1. Can the problem be solved by working from both ends?
2. Would sorting the input help?
3. Can we eliminate possibilities by moving pointers in a specific direction?
4. Is there an invariant that can be maintained while moving pointers?
