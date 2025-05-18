# Arrays & Hashing

This directory contains solutions to array and hash table problems from the Blind 75 list.

## Problem List

| # | Problem | Difficulty | Solution | Notes |
|---|---------|------------|----------|-------|
| 1 | [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) | Easy | [Solution](./contains_duplicate.md) | Hash Set |
| 2 | [Valid Anagram](https://leetcode.com/problems/valid-anagram/) | Easy | [Solution](./valid_anagram.md) | Hash Map, Counting |
| 3 | [Two Sum](https://leetcode.com/problems/two-sum/) | Easy | [Solution](./two_sum.py) | Hash Map |
| 4 | [Group Anagrams](https://leetcode.com/problems/group-anagrams/) | Medium | [Solution](./group_anagrams.py) | Hash Map, Sorting |
| 5 | [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) | Medium | [Solution](./top_k_frequent.py) | Hash Map, Heap |
| 6 | [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) | Medium | [Solution](./product_except_self.py) | Prefix & Suffix Products |
| 7 | [Valid Sudoku](https://leetcode.com/problems/valid-sudoku/) | Medium | [Solution](./valid_sudoku.py) | Hash Sets |
| 8 | [Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings/) | Medium | [Solution](./encode_decode_strings.py) | String Manipulation |
| 9 | [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) | Medium | [Solution](./longest_consecutive.py) | Hash Set |

## Completion Status

- Completed: 2/9
- Progress: 11.11%

## Key Concepts

### Hash Tables
- O(1) average time complexity for insertion, deletion, and lookup
- Used for quick lookups and avoiding nested loops
- Common implementations: HashSet, HashMap/Dictionary

### Arrays
- Contiguous memory locations
- O(1) access time with index
- Common operations: traversal, insertion, deletion, searching

## Common Patterns

1. **Using Hash Tables to avoid O(n²) time complexity**
   - Example: Two Sum - use a hash map to store previously seen values
   
2. **Frequency counting**
   - Example: Valid Anagram - count occurrences of each character
   
3. **String manipulation techniques**
   - Example: Group Anagrams - use sorted strings or character counts as keys

4. **Multiple passes through an array**
   - Example: Product of Array Except Self - use prefix and suffix products

## Solving Approach

For most array and hashing problems, consider:
1. Can a hash table help avoid brute force?
2. Is sorting helpful?
3. Can the problem be solved in a single pass?
4. Is there a way to solve without extra space?
