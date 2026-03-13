# Lesson 8: Checking and Divisibility

## Snapshot

- Course: Vedic Math
- Lesson code: `L8_YAVADUNAM`
- Duration: about 30 minutes
- Source: `Vedic Mathematics Manual | chap_8_checking_and_divisibility.pdf`

## Lesson Objective

- Check division and multiplication answers quickly before accepting them.
- Use approximate and last-digit checks to catch obvious mistakes fast.
- Apply divisibility rules for 4 and 11, including remainders from 11.

## Teaching Approach

- A quick check does not replace the original method, but it catches many mistakes before they spread.
- Different checks answer different questions: size, last digit, divisibility, or full consistency.
- Most of these checks work by reducing a big number to a smaller pattern on the board.

## Duolingo Lesson Architecture

- Entry onboarding: ask name, comfortable language, current Vedic Math level, and session goal before starting the mission.
- Mission promise: Check division and multiplication answers quickly before accepting them.
- Core loop: coach hook -> board model -> read aloud -> Niagh tries -> instant feedback -> quick review or reward.
- Reward loop: Award 10 to 20 XP per exercise group based on the step position in the lesson path. Keep the streak visible on every step and protect it with immediate retries instead of long explanations.
- Review rule: Advance only after the learner can answer the checkpoint and complete one try in the same subtopic. Weak steps should return in the next session as review cards before new content.

### Session Loop A-I

- A. Digit-sum check for division:
  Coach opens with: A division answer is checked by rebuilding the dividend from divisor times quotient plus remainder, then testing that statement with digit sums.
  Board model: Show 3456 ÷ 7 = 493 remainder 5, then rewrite it as 493 × 7 + 5 = 3456 and reduce each side to digit sums.
  Read aloud: How does the digit-sum check confirm 3456 ÷ 7 = 493 remainder 5?
  Student try: Niagh, try this one. Say your first step, then your answer.
  Reward and review: Correct. Digit-sum check for division is now stronger and ready for the next step. Check 70809 ÷ 6 = 11801 remainder 3 by rebuilding the dividend first.
- B. First by first for approximate answers:
  Coach opens with: First by first gives the leading part of an answer quickly by multiplying only the first significant figures and then judging the zeros.
  Board model: Show 32 × 41 ≈ 30 × 40 and 641 × 82 ≈ 600 × 80, then discuss rounding the first figure.
  Read aloud: Why is 641 × 82 about 50,000 rather than 48,000 as a final estimate?
  Student try: Niagh, try this one. Say your first step, then your answer.
  Reward and review: Correct. First by first for approximate answers is now stronger and ready for the next step. Estimate 39 × 63 and 383 × 88 using first by first.
- C. Last by last for the final digit:
  Coach opens with: Last by last predicts the final digit of an answer by using only the final digits of the numbers in the calculation.
  Board model: Show 72 × 83, 383 × 887, and 23 × 48 × 63, while isolating only the last digits.
  Read aloud: How do the last digits alone show that 23 × 48 × 63 ends in 2?
  Student try: Niagh, try this one. Say your first step, then your answer.
  Reward and review: Correct. Last by last for the final digit is now stronger and ready for the next step. Find the last digit of 456 × 567 and 5328 + 9845 without doing the full calculation.
- D. Divisibility by 4 using the ultimate and twice the penultimate:
  Coach opens with: To test divisibility by 4, add the last digit to twice the digit before it. If 4 divides that total, 4 divides the number.
  Board model: Show 12376, point to the 7 and 6, and compute 6 + 2 × 7 = 20, then contrast it with 5554.
  Read aloud: Why does 12376 pass the divisibility-by-4 test while 5554 fails?
  Student try: Niagh, try this one. Say your first step, then your answer.
  Reward and review: Correct. Divisibility by 4 using the ultimate and twice the penultimate is now stronger and ready for the next step. Test 246, 656, and 92 by using only the last two digits.
- E. Divisibility by 11 and remainders from 11:
  Coach opens with: For divisibility by 11, add the digits in odd positions, add the digits in even positions, and subtract the smaller total from the larger.
  Board model: Show 7282231 with odd-position digits and even-position digits in different colors, then compute 18 - 7 = 11.
  Read aloud: How does the alternating-sum rule show that 7282231 is divisible by 11?
  Student try: Niagh, try this one. Say your first step, then your answer.
  Reward and review: Correct. Divisibility by 11 and remainders from 11 is now stronger and ready for the next step. Test 5192 and 3476 for divisibility by 11 and then find the remainder of 38042 when divided by 11.
- F. Alternative check by remainders after division by 11:
  Coach opens with: The remainder-from-11 idea can also check multiplication, just like digit sums check remainders from 9.
  Board model: Show 2434 × 32 = 77888, then replace each number by its remainder from 11 and verify the reduced equation.
  Read aloud: Why does replacing numbers by their remainders from 11 still preserve the truth of the check?
  Student try: Niagh, try this one. Say your first step, then your answer.
  Reward and review: Correct. Alternative check by remainders after division by 11 is now stronger and ready for the next step. Test 234 × 234 = 54756 and 3741 × 45 = 186345 using the remainder-from-11 check.


## Worked Examples

- `3451 + 5 = ?` -> This rebuilds the dividend from quotient, divisor, and remainder. 493 Ã— 7 = 3451, then adding 5 gives 3456. -> answer: `3456`
- `30 * 40 = ?` -> This is the first-by-first estimate for 32 Ã— 41. 30 Ã— 40 = 1200, so the full product is about 1000. -> answer: `1200`
- `14 + 6 = ?` -> This is the divisibility-by-4 test for 12376. The total is 20, and because 20 is divisible by 4, so is 12376. -> answer: `20`
- `18 - 7 = ?` -> This is the divisibility-by-11 test for 7282231. The result is 11, so the full number is divisible by 11. -> answer: `11`

## Session Map

### A. Digit-sum check for division

- Teacher does: A division answer is checked by rebuilding the dividend from divisor times quotient plus remainder, then testing that statement with digit sums.
- Board shows: Show 3456 Ã· 7 = 493 remainder 5, then rewrite it as 493 Ã— 7 + 5 = 3456 and reduce each side to digit sums.
- Student checkpoint: How does the digit-sum check confirm 3456 Ã· 7 = 493 remainder 5?
- Micro-practice: Check 70809 Ã· 6 = 11801 remainder 3 by rebuilding the dividend first.
- Expected outcome: Student can respond correctly to a short checkpoint on digit-sum check for division and apply the method once without heavy prompting.

### B. First by first for approximate answers

- Teacher does: First by first gives the leading part of an answer quickly by multiplying only the first significant figures and then judging the zeros.
- Board shows: Show 32 Ã— 41 â‰ˆ 30 Ã— 40 and 641 Ã— 82 â‰ˆ 600 Ã— 80, then discuss rounding the first figure.
- Student checkpoint: Why is 641 Ã— 82 about 50,000 rather than 48,000 as a final estimate?
- Micro-practice: Estimate 39 Ã— 63 and 383 Ã— 88 using first by first.
- Expected outcome: Student can respond correctly to a short checkpoint on first by first for approximate answers and apply the method once without heavy prompting.

### C. Last by last for the final digit

- Teacher does: Last by last predicts the final digit of an answer by using only the final digits of the numbers in the calculation.
- Board shows: Show 72 Ã— 83, 383 Ã— 887, and 23 Ã— 48 Ã— 63, while isolating only the last digits.
- Student checkpoint: How do the last digits alone show that 23 Ã— 48 Ã— 63 ends in 2?
- Micro-practice: Find the last digit of 456 Ã— 567 and 5328 + 9845 without doing the full calculation.
- Expected outcome: Student can respond correctly to a short checkpoint on last by last for the final digit and apply the method once without heavy prompting.

### D. Divisibility by 4 using the ultimate and twice the penultimate

- Teacher does: To test divisibility by 4, add the last digit to twice the digit before it. If 4 divides that total, 4 divides the number.
- Board shows: Show 12376, point to the 7 and 6, and compute 6 + 2 Ã— 7 = 20, then contrast it with 5554.
- Student checkpoint: Why does 12376 pass the divisibility-by-4 test while 5554 fails?
- Micro-practice: Test 246, 656, and 92 by using only the last two digits.
- Expected outcome: Student can respond correctly to a short checkpoint on divisibility by 4 using the ultimate and twice the penultimate and apply the method once without heavy prompting.

### E. Divisibility by 11 and remainders from 11

- Teacher does: For divisibility by 11, add the digits in odd positions, add the digits in even positions, and subtract the smaller total from the larger.
- Board shows: Show 7282231 with odd-position digits and even-position digits in different colors, then compute 18 - 7 = 11.
- Student checkpoint: How does the alternating-sum rule show that 7282231 is divisible by 11?
- Micro-practice: Test 5192 and 3476 for divisibility by 11 and then find the remainder of 38042 when divided by 11.
- Expected outcome: Student can respond correctly to a short checkpoint on divisibility by 11 and remainders from 11 and apply the method once without heavy prompting.

### F. Alternative check by remainders after division by 11

- Teacher does: The remainder-from-11 idea can also check multiplication, just like digit sums check remainders from 9.
- Board shows: Show 2434 Ã— 32 = 77888, then replace each number by its remainder from 11 and verify the reduced equation.
- Student checkpoint: Why does replacing numbers by their remainders from 11 still preserve the truth of the check?
- Micro-practice: Test 234 Ã— 234 = 54756 and 3741 Ã— 45 = 186345 using the remainder-from-11 check.
- Expected outcome: Student can respond correctly to a short checkpoint on alternative check by remainders after division by 11 and apply the method once without heavy prompting.

## Conversation Review

Use this section to review how the lesson should sound as a live teacher-student exchange.

### A. Digit-sum check for division

- Teacher says: "Today we focus on digit-sum check for division. A division answer is checked by rebuilding the dividend from divisor times quotient plus remainder, then testing that statement with digit sums."
- Teacher reads the exercise question: "How does the digit-sum check confirm 3456 Ã· 7 = 493 remainder 5"
- Teacher asks Niagh to try: "Niagh, try this one. Say your first step, then your answer."
- Ideal student says: Student answers correctly and explains the reasoning in one short sentence.
- Likely wrong student answer: Student gives a partial answer but misses the key pattern or adjustment.
- If student hesitates: "I know the answer is close, but I am not sure what step comes first in digit-sum check for division."
- Tutor recovery line: "Use the board pattern again: Show 3456 Ã· 7 = 493 remainder 5, then rewrite it as 493 Ã— 7 + 5 = 3456 and reduce each side to digit sums."
- If student is wrong: "Let us correct the method: first identify the pattern in digit-sum check for division, then compute from that pattern."
- If student is correct: "Correct. You are using the pattern in digit-sum check for division, not just guessing the result."
- Transition: "Good. Now let us carry that same confidence into first by first for approximate answers."

### B. First by first for approximate answers

- Teacher says: "Today we focus on first by first for approximate answers. First by first gives the leading part of an answer quickly by multiplying only the first significant figures and then judging the zeros."
- Teacher reads the exercise question: "Why is 641 Ã— 82 about 50,000 rather than 48,000 as a final estimate"
- Teacher asks Niagh to try: "Niagh, try this one. Say your first step, then your answer."
- Ideal student says: Student answers correctly and explains the reasoning in one short sentence.
- Likely wrong student answer: Student gives a partial answer but misses the key pattern or adjustment.
- If student hesitates: "I know the answer is close, but I am not sure what step comes first in first by first for approximate answers."
- Tutor recovery line: "Use the board pattern again: Show 32 Ã— 41 â‰ˆ 30 Ã— 40 and 641 Ã— 82 â‰ˆ 600 Ã— 80, then discuss rounding the first figure."
- If student is wrong: "Let us correct the method: first identify the pattern in first by first for approximate answers, then compute from that pattern."
- If student is correct: "Correct. You are using the pattern in first by first for approximate answers, not just guessing the result."
- Transition: "Good. Now let us carry that same confidence into last by last for the final digit."

### C. Last by last for the final digit

- Teacher says: "Today we focus on last by last for the final digit. Last by last predicts the final digit of an answer by using only the final digits of the numbers in the calculation."
- Teacher reads the exercise question: "How do the last digits alone show that 23 Ã— 48 Ã— 63 ends in 2"
- Teacher asks Niagh to try: "Niagh, try this one. Say your first step, then your answer."
- Ideal student says: Student answers correctly and explains the reasoning in one short sentence.
- Likely wrong student answer: Student gives a partial answer but misses the key pattern or adjustment.
- If student hesitates: "I know the answer is close, but I am not sure what step comes first in last by last for the final digit."
- Tutor recovery line: "Use the board pattern again: Show 72 Ã— 83, 383 Ã— 887, and 23 Ã— 48 Ã— 63, while isolating only the last digits."
- If student is wrong: "Let us correct the method: first identify the pattern in last by last for the final digit, then compute from that pattern."
- If student is correct: "Correct. You are using the pattern in last by last for the final digit, not just guessing the result."
- Transition: "Good. Now let us carry that same confidence into divisibility by 4 using the ultimate and twice the penultimate."

### D. Divisibility by 4 using the ultimate and twice the penultimate

- Teacher says: "Today we focus on divisibility by 4 using the ultimate and twice the penultimate. To test divisibility by 4, add the last digit to twice the digit before it. If 4 divides that total, 4 divides the number."
- Teacher reads the exercise question: "Why does 12376 pass the divisibility-by-4 test while 5554 fails"
- Teacher asks Niagh to try: "Niagh, try this one. Say your first step, then your answer."
- Ideal student says: Student answers correctly and explains the reasoning in one short sentence.
- Likely wrong student answer: Student gives a partial answer but misses the key pattern or adjustment.
- If student hesitates: "I know the answer is close, but I am not sure what step comes first in divisibility by 4 using the ultimate and twice the penultimate."
- Tutor recovery line: "Use the board pattern again: Show 12376, point to the 7 and 6, and compute 6 + 2 Ã— 7 = 20, then contrast it with 5554."
- If student is wrong: "Let us correct the method: first identify the pattern in divisibility by 4 using the ultimate and twice the penultimate, then compute from that pattern."
- If student is correct: "Correct. You are using the pattern in divisibility by 4 using the ultimate and twice the penultimate, not just guessing the result."
- Transition: "Good. Now let us carry that same confidence into divisibility by 11 and remainders from 11."

### E. Divisibility by 11 and remainders from 11

- Teacher says: "Today we focus on divisibility by 11 and remainders from 11. For divisibility by 11, add the digits in odd positions, add the digits in even positions, and subtract the smaller total from the larger."
- Teacher reads the exercise question: "How does the alternating-sum rule show that 7282231 is divisible by 11"
- Teacher asks Niagh to try: "Niagh, try this one. Say your first step, then your answer."
- Ideal student says: Student answers correctly and explains the reasoning in one short sentence.
- Likely wrong student answer: Student gives a partial answer but misses the key pattern or adjustment.
- If student hesitates: "I know the answer is close, but I am not sure what step comes first in divisibility by 11 and remainders from 11."
- Tutor recovery line: "Use the board pattern again: Show 7282231 with odd-position digits and even-position digits in different colors, then compute 18 - 7 = 11."
- If student is wrong: "Let us correct the method: first identify the pattern in divisibility by 11 and remainders from 11, then compute from that pattern."
- If student is correct: "Correct. You are using the pattern in divisibility by 11 and remainders from 11, not just guessing the result."
- Transition: "Good. Now let us carry that same confidence into alternative check by remainders after division by 11."

### F. Alternative check by remainders after division by 11

- Teacher says: "Today we focus on alternative check by remainders after division by 11. The remainder-from-11 idea can also check multiplication, just like digit sums check remainders from 9."
- Teacher reads the exercise question: "Why does replacing numbers by their remainders from 11 still preserve the truth of the check"
- Teacher asks Niagh to try: "Niagh, try this one. Say your first step, then your answer."
- Ideal student says: Student answers correctly and explains the reasoning in one short sentence.
- Likely wrong student answer: Student gives a partial answer but misses the key pattern or adjustment.
- If student hesitates: "I know the answer is close, but I am not sure what step comes first in alternative check by remainders after division by 11."
- Tutor recovery line: "Use the board pattern again: Show 2434 Ã— 32 = 77888, then replace each number by its remainder from 11 and verify the reduced equation."
- If student is wrong: "Let us correct the method: first identify the pattern in alternative check by remainders after division by 11, then compute from that pattern."
- If student is correct: "Correct. You are using the pattern in alternative check by remainders after division by 11, not just guessing the result."
- Transition: "Good. That completes the lesson, so now we can review the whole chapter with confidence."

## End-of-Lesson Expectation

- Student should be able to check division and multiplication answers quickly before accepting them.
- Student should be able to use approximate and last-digit checks to catch obvious mistakes fast.
- Student should be able to apply divisibility rules for 4 and 11, including remainders from 11.

## Suggested On-the-Spot Checks

- Warm-up: rebuild 3456 from 493, 7, and remainder 5.
- Guided: find the last digit of 72 Ã— 83 without multiplying the full numbers.
- Independent: test whether 7282231 is divisible by 11.
