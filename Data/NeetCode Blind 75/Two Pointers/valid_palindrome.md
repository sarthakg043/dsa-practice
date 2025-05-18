# Valid Palindrome

## Problem Statement
[LeetCode: Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)

A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.

### Examples:
```
Example 1:
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.

Example 2:
Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.

Example 3:
Input: s = " "
Output: true
Explanation: s is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.
```

## Solution Approach

### Two Pointers Approach
The most efficient approach is to use two pointers, one starting from the beginning and one from the end of the string. We skip non-alphanumeric characters and compare the characters at both pointers. If at any point the characters don't match, we return `false`. If the pointers cross without finding a mismatch, we return `true`.

- Time Complexity: O(n) - we potentially traverse the entire string once
- Space Complexity: O(1) - we use constant extra space

### Python Implementation
```python
def isPalindrome(s):
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric characters
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        # Compare characters (case-insensitive)
        if s[left].lower() != s[right].lower():
            return False
        
        # Move pointers
        left += 1
        right -= 1
    
    return True
```

### Alternative Approaches

#### Cleaning the String First
We could also clean the string first by removing all non-alphanumeric characters and converting to lowercase, then check if the cleaned string equals its reverse.

```python
def isPalindrome(s):
    # Clean the string
    cleaned = ''.join(char.lower() for char in s if char.isalnum())
    
    # Check if the cleaned string equals its reverse
    return cleaned == cleaned[::-1]
```
- Time Complexity: O(n) - we process each character once
- Space Complexity: O(n) - we create a new string

## Notes
- The two-pointer approach is more space-efficient
- Be careful about edge cases: empty strings, strings with only non-alphanumeric characters
- This problem tests string manipulation and the two-pointer technique
- Python's string slicing ([::-1]) is convenient but creates a copy of the string
