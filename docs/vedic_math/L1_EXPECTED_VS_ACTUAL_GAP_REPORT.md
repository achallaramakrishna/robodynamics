# Lesson 1 Expected vs Actual Flow Gap Report

- Generated: 2026-03-12T14:02:52.980746+00:00
- Tutor Tester: `Asha`
- Student Simulator: `Niagh`
- Lesson: `L1_COMPLETING_WHOLE`
- Exercise groups reviewed: `9`
- Gaps found: `27`

## Expected Test Scenario

`Asha` reviews the lesson as if Raj is teaching `Niagh` in a real session.

Expected turn order for every step A-I:
1. Raj introduces the pattern briefly.
2. Raj reads the actual exercise shown on screen.
3. Raj asks Niagh to try.
4. Niagh answers.
5. Raj gives spoken feedback and either moves on or reteaches.

## Group Comparison

### Step A: Introduction to Completing the Whole

- Runtime question: `9 + 6 = ?  Show your two steps.`
- Runtime questionId: `L1_A_M_d877ab`
- Read-aloud prompt: `In one sentence, what does 'completing the whole' mean?`

Expected sequence:
- Raj: Scene 1: Introduction to Completing the Whole. We focus on friendly numbers and mental structure.
- Raj reads the actual exercise: 9 + 6 = ?  Show your two steps.
- Raj asks Niagh to try: Niagh, try this one. Say your first step, then your answer.
- Niagh: answers the shown exercise.
- Raj: Correct. Introduction to Completing the Whole is now stronger and ready for the next step.

Actual implemented sequence:
- Raj: Scene 1: Introduction to Completing the Whole. We focus on friendly numbers and mental structure.
- Board demo: Write the chapter theme and show one quick whole: 24 + 26 = 50.
- Raj currently reads: In one sentence, what does 'completing the whole' mean?
- Raj currently asks in one long turn: Niagh, try this one. Say your first step, then your answer. In one sentence, what does 'completing the whole' mean? Micro-practice: explain how 24 + 26 becomes 50 using whole completion.
- Niagh: 15
- UI feedback card: verdict=True | line=Correct. Introduction to Completing the Whole is now stronger and ready for the next step. | explanation=9 + 1 = 10; 10 + 5 = 15

Gaps:
- Tutor reads `readAloudPrompt`, not the actual runtime question text.
- Tutor combines try prompt, mastery check, and review prompt into one turn instead of asking one clean question first.
- Feedback is shown as a UI card after answer check; it is not guaranteed to be spoken as a natural tutor reply.

### Step B: Pairs That Make 10

- Runtime question: `8 + 9 = ?  Use base-10 completion. Give two-step working.`
- Runtime questionId: `L1_B_H_0af896`
- Read-aloud prompt: `What pairs with 7 to make 10? What pairs with 4 to make 10?`

Expected sequence:
- Raj: Scene 2: Pairs That Make 10. Instant complements build speed.
- Raj reads the actual exercise: 8 + 9 = ?  Use base-10 completion. Give two-step working.
- Raj asks Niagh to try: Niagh, try this one. Say your first step, then your answer.
- Niagh: answers the shown exercise.
- Raj: Correct. Pairs That Make 10 is now stronger and ready for the next step.

Actual implemented sequence:
- Raj: Scene 2: Pairs That Make 10. Instant complements build speed.
- Board demo: List 1+9, 2+8, 3+7, 4+6, 5+5 and highlight instant recall.
- Raj currently reads: What pairs with 7 to make 10? What pairs with 4 to make 10?
- Raj currently asks in one long turn: Niagh, try this one. Say your first step, then your answer. What pairs with 7 to make 10? What pairs with 4 to make 10? Micro-practice: answer five complement-to-10 prompts in under 20 seconds.
- Niagh: 17
- UI feedback card: verdict=True | line=Correct. Pairs That Make 10 is now stronger and ready for the next step. | explanation=8 + 2 = 10; 10 + 7 = 17

Gaps:
- Tutor reads `readAloudPrompt`, not the actual runtime question text.
- Tutor combines try prompt, mastery check, and review prompt into one turn instead of asking one clean question first.
- Feedback is shown as a UI card after answer check; it is not guaranteed to be spoken as a natural tutor reply.

### Step C: Ten Point Circle

- Runtime question: `6 + ? = 10`
- Runtime questionId: `L1_C_E_33eb2f`
- Read-aloud prompt: `On the ten-point circle, which branch does 32 lie on?`

Expected sequence:
- Raj: Scene 3: Ten Point Circle. We use visual branches to track patterns.
- Raj reads the actual exercise: 6 + ? = 10
- Raj asks Niagh to try: Niagh, try this one. Say your first step, then your answer.
- Niagh: answers the shown exercise.
- Raj: Correct. Ten Point Circle is now stronger and ready for the next step.

Actual implemented sequence:
- Raj: Scene 3: Ten Point Circle. We use visual branches to track patterns.
- Board demo: Draw the ten-point circle and label branch families (1,11,21...) and tens branch (10,20,30...).
- Raj currently reads: On the ten-point circle, which branch does 32 lie on?
- Raj currently asks in one long turn: Niagh, try this one. Say your first step, then your answer. On the ten-point circle, which branch does 32 lie on? Micro-practice: place 12, 25, 38, and 40 on the correct branches.
- Niagh: 4
- UI feedback card: verdict=True | line=Correct. Ten Point Circle is now stronger and ready for the next step. | explanation=10 - 6 = 4

Gaps:
- Tutor reads `readAloudPrompt`, not the actual runtime question text.
- Tutor combines try prompt, mastery check, and review prompt into one turn instead of asking one clean question first.
- Feedback is shown as a UI card after answer check; it is not guaranteed to be spoken as a natural tutor reply.

### Step D: Completing the Next Ten

- Runtime question: `What gap must you add to 78 to reach the next multiple of 10?`
- Runtime questionId: `L1_D_H_5bd71d`
- Read-aloud prompt: `Solve 49 + 5 by first completing the next ten.`

Expected sequence:
- Raj: Scene 4: Completing the Next Ten. Reach the nearest ten first, then add the remainder.
- Raj reads the actual exercise: What gap must you add to 78 to reach the next multiple of 10?
- Raj asks Niagh to try: Niagh, try this one. Say your first step, then your answer.
- Niagh: answers the shown exercise.
- Raj: Correct. Completing the Next Ten is now stronger and ready for the next step.

Actual implemented sequence:
- Raj: Scene 4: Completing the Next Ten. Reach the nearest ten first, then add the remainder.
- Board demo: Solve 49 + 5 as 50 + 4 and mark the split on a number jump.
- Raj currently reads: Solve 49 + 5 by first completing the next ten.
- Raj currently asks in one long turn: Niagh, try this one. Say your first step, then your answer. Solve 49 + 5 by first completing the next ten. Micro-practice: solve 37 + 6 and say how much was used to reach 40.
- Niagh: 2
- UI feedback card: verdict=True | line=Correct. Completing the Next Ten is now stronger and ready for the next step. | explanation=10 - 8 = 2

Gaps:
- Tutor reads `readAloudPrompt`, not the actual runtime question text.
- Tutor combines try prompt, mastery check, and review prompt into one turn instead of asking one clean question first.
- Feedback is shown as a UI card after answer check; it is not guaranteed to be spoken as a natural tutor reply.

### Step E: Deficiency from Ten

- Runtime question: `10 - 6 = ?`
- Runtime questionId: `L1_E_E_568628`
- Read-aloud prompt: `Fill in: 68 is close to ___ and is ___ below.`

Expected sequence:
- Raj: Scene 5: Deficiency from Ten. State how far a number is below the next base.
- Raj reads the actual exercise: 10 - 6 = ?
- Raj asks Niagh to try: Niagh, try this one. Say your first step, then your answer.
- Niagh: answers the shown exercise.
- Raj: Correct. Deficiency from Ten is now stronger and ready for the next step.

Actual implemented sequence:
- Raj: Scene 5: Deficiency from Ten. State how far a number is below the next base.
- Board demo: Model deficiency statements: 68 is close to 70 and is 2 below; 58 + 7 = 60 + 5.
- Raj currently reads: Fill in: 68 is close to ___ and is ___ below.
- Raj currently asks in one long turn: Niagh, try this one. Say your first step, then your answer. Fill in: 68 is close to ___ and is ___ below. Micro-practice: write deficiency statements for 49, 68, and 79.
- Niagh: 4
- UI feedback card: verdict=True | line=Correct. Deficiency from Ten is now stronger and ready for the next step. | explanation=4

Gaps:
- Tutor reads `readAloudPrompt`, not the actual runtime question text.
- Tutor combines try prompt, mastery check, and review prompt into one turn instead of asking one clean question first.
- Feedback is shown as a UI card after answer check; it is not guaranteed to be spoken as a natural tutor reply.

### Step F: Mental Addition with Carry

- Runtime question: `30 - 23 = ?`
- Runtime questionId: `L1_F_E_b18450`
- Read-aloud prompt: `Solve 56 + 26 using tens-and-ones split.`

Expected sequence:
- Raj: Scene 6: Mental Addition with Carry. Split tens and ones, then recombine calmly.
- Raj reads the actual exercise: 30 - 23 = ?
- Raj asks Niagh to try: Niagh, try this one. Say your first step, then your answer.
- Niagh: answers the shown exercise.
- Raj: Correct. Mental Addition with Carry is now stronger and ready for the next step.

Actual implemented sequence:
- Raj: Scene 6: Mental Addition with Carry. Split tens and ones, then recombine calmly.
- Board demo: Show 56 + 26 = (50+20) + (6+6) = 70 + 12 = 82.
- Raj currently reads: Solve 56 + 26 using tens-and-ones split.
- Raj currently asks in one long turn: Niagh, try this one. Say your first step, then your answer. Solve 56 + 26 using tens-and-ones split. Micro-practice: solve 48 + 45 by splitting tens and ones.
- Niagh: 7
- UI feedback card: verdict=True | line=Correct. Mental Addition with Carry is now stronger and ready for the next step. | explanation=7

Gaps:
- Tutor reads `readAloudPrompt`, not the actual runtime question text.
- Tutor combines try prompt, mastery check, and review prompt into one turn instead of asking one clean question first.
- Feedback is shown as a UI card after answer check; it is not guaranteed to be spoken as a natural tutor reply.

### Step G: Grouping Numbers into Wholes

- Runtime question: `9 + 5 = ?  (Hop 1: 9 + 1 = 10. Hop 2: 10 + ? = ?)`
- Runtime questionId: `L1_G_E_bf3069`
- Read-aloud prompt: `Reorder 19 + 8 + 1 to make a whole first.`

Expected sequence:
- Raj: Scene 7: Grouping Numbers into Wholes. Reorder to create easy whole sums first.
- Raj reads the actual exercise: 9 + 5 = ?  (Hop 1: 9 + 1 = 10. Hop 2: 10 + ? = ?)
- Raj asks Niagh to try: Niagh, try this one. Say your first step, then your answer.
- Niagh: answers the shown exercise.
- Raj: Correct. Grouping Numbers into Wholes is now stronger and ready for the next step.

Actual implemented sequence:
- Raj: Scene 7: Grouping Numbers into Wholes. Reorder to create easy whole sums first.
- Board demo: Demonstrate 19 + 8 + 1 = (19+1)+8 and 33+28+4+32 = (28+32)+33+4.
- Raj currently reads: Reorder 19 + 8 + 1 to make a whole first.
- Raj currently asks in one long turn: Niagh, try this one. Say your first step, then your answer. Reorder 19 + 8 + 1 to make a whole first. Micro-practice: group 6 + 7 + 4 and solve by forming 10 first.
- Niagh: 14
- UI feedback card: verdict=True | line=Correct. Grouping Numbers into Wholes is now stronger and ready for the next step. | explanation=14

Gaps:
- Tutor reads `readAloudPrompt`, not the actual runtime question text.
- Tutor combines try prompt, mastery check, and review prompt into one turn instead of asking one clean question first.
- Feedback is shown as a UI card after answer check; it is not guaranteed to be spoken as a natural tutor reply.

### Step H: Add Near a Base

- Runtime question: `37 + 6 = ?`
- Runtime questionId: `L1_H_M_22a8d1`
- Read-aloud prompt: `Solve 54 + 39 using +40 -1.`

Expected sequence:
- Raj: Scene 8: Add Near a Base. Add the base value, then adjust by the deficiency.
- Raj reads the actual exercise: 37 + 6 = ?
- Raj asks Niagh to try: Niagh, try this one. Say your first step, then your answer.
- Niagh: answers the shown exercise.
- Raj: Correct. Add Near a Base is now stronger and ready for the next step.

Actual implemented sequence:
- Raj: Scene 8: Add Near a Base. Add the base value, then adjust by the deficiency.
- Board demo: Work 54 + 39 as 54 + 40 - 1 and 66 + 19 as 66 + 20 - 1.
- Raj currently reads: Solve 54 + 39 using +40 -1.
- Raj currently asks in one long turn: Niagh, try this one. Say your first step, then your answer. Solve 54 + 39 using +40 -1. Micro-practice: solve 33 + 9 using +10 -1.
- Niagh: 43
- UI feedback card: verdict=True | line=Correct. Add Near a Base is now stronger and ready for the next step. | explanation=43

Gaps:
- Tutor reads `readAloudPrompt`, not the actual runtime question text.
- Tutor combines try prompt, mastery check, and review prompt into one turn instead of asking one clean question first.
- Feedback is shown as a UI card after answer check; it is not guaranteed to be spoken as a natural tutor reply.

### Step I: Subtract Near a Base

- Runtime question: `48 + 9 = ?  Show Path A and Path B. Both must give the same answer.`
- Runtime questionId: `L1_I_H_46de89`
- Read-aloud prompt: `Solve 72 - 48 using -50 +2.`

Expected sequence:
- Raj: Scene 9: Subtract Near a Base. Subtract the base and add back the deficiency.
- Raj reads the actual exercise: 48 + 9 = ?  Show Path A and Path B. Both must give the same answer.
- Raj asks Niagh to try: Niagh, try this one. Say your first step, then your answer.
- Niagh: answers the shown exercise.
- Raj: Correct. Subtract Near a Base is now stronger and ready for the next step.

Actual implemented sequence:
- Raj: Scene 9: Subtract Near a Base. Subtract the base and add back the deficiency.
- Board demo: Work 72 - 48 as 72 - 50 + 2 and 55 - 19 as 55 - 20 + 1.
- Raj currently reads: Solve 72 - 48 using -50 +2.
- Raj currently asks in one long turn: Niagh, try this one. Say your first step, then your answer. Solve 72 - 48 using -50 +2. Micro-practice: solve 61 - 38 using -40 +2.
- Niagh: 57
- UI feedback card: verdict=True | line=Correct. Subtract Near a Base is now stronger and ready for the next step. | explanation=57

Gaps:
- Tutor reads `readAloudPrompt`, not the actual runtime question text.
- Tutor combines try prompt, mastery check, and review prompt into one turn instead of asking one clean question first.
- Feedback is shown as a UI card after answer check; it is not guaranteed to be spoken as a natural tutor reply.

## Summary

Primary launch blocker for Lesson 1:
- Raj does not consistently read the literal exercise question shown to the student.

Secondary blockers:
- Raj asks too much in one turn by combining try, mastery, and review prompts.
- Feedback is still partly UI-first instead of tutor-conversation-first.

Recommended fix order:
1. Read `question.questionText` first.
2. Ask one clean `tryPrompt` only.
3. Hold `reviewPrompt` for retry only.
4. Speak feedback as a tutor reply after answer evaluation.
