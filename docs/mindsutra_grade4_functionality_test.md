# MindSutra AI Tutor - Grade 4 Functional Test Notes

Date: 2026-03-19
Product: MindSutra Vedic Math AI Tutor
Scope for this round: Grade 4 only

## 1. What Grade 4 lesson plan is expected

Grade 4 currently has these lessons in the local lesson content:

1. VM_G4_L1_FAST_ADDITION
   Title: All From 9, Last From 10 - Magic Subtraction
   Expected outcome: child learns complements and subtraction from 100 and 1000 without borrowing.

2. VM_G4_L2_TABLES_11_TO_19
   Title: Lightning Tables 11-19 - Ekadhikena Pattern
   Expected outcome: child learns fast table patterns for 11 to 19.

3. VM_G4_L3_DOUBLING_HALVING
   Title: Double Fast, Half Fast - Multiplication Secrets
   Expected outcome: child learns doubling, halving, x4 and x8 shortcuts.

4. VM_G4_L4_MULT_BY_11
   Title: The 11-Trick - Multiply Any 2-Digit Number by 11
   Expected outcome: child learns split-and-add rule and carry handling.

5. VM_G4_L5_SUBT_BORROW_FREE
   Title: No More Borrowing! - Vedic Subtraction
   Expected outcome: child learns borrow-free subtraction idea and larger subtraction practice.

6. VM_G4_L6_MULT_BY_5_25
   Title: x5 and x25 in a Flash - Base Multiplication
   Expected outcome: child learns x5 and x25 shortcuts using divide-first logic.

7. VM_G4_L7_NEAR_100
   Title: Near 100 Magic - Add and Subtract Close Numbers
   Expected outcome: child learns deviation-from-100 thinking.

8. VM_G4_L8_CRISS_CROSS_2DIG
   Title: The X-Factor - Urdhva Criss-Cross Multiplication
   Expected outcome: child learns 2-digit x 2-digit criss-cross multiplication.

## 2. What the Grade 4 delivery mode should be

Simple expected delivery mode in plain English:

1. The tutor should greet the student.
2. The tutor should say the topic name clearly.
3. The tutor should explain what the trick means in one simple line.
4. The tutor should show one worked example on the board.
5. The tutor should ask one guided question.
6. Only after that should the first real question appear for the student.
7. If the student is wrong, the tutor should explain the exact wrong step and retry with help.
8. The lesson should move exercise-group by exercise-group, not jump suddenly.

For Grade 4 Lesson 1 specifically, the expected first topic is:
- Complement pairs to 10
- All From 9, Last From 10 rule
- 100 minus 2-digit number
- 1000 minus 3-digit number

## 3. Expected Grade 4 Lesson 1 flow

Lesson code: VM_G4_L1_FAST_ADDITION
Expected title: Lesson 1: All From 9, Last From 10 - Fast Addition Trick

Expected simple flow:

1. Welcome the child.
2. Say: today we will learn complements and a fast subtraction trick.
3. Explain what a complement is.
4. Show easy pairs like 7 and 3 make 10.
5. Teach the rule: all from 9, last from 10.
6. Show 100 - 37 on the board step by step.
7. Ask a guided practice question.
8. Then show the student's first question.

## 4. What production is doing right now

Production test date: 2026-03-19
Production URL tested:
- https://robodynamics.in/ai-tutor/demo?grade=4&chapter=VM_G4_L1_FAST_ADDITION&fresh=1

Production API result observed:
- Demo token requested chapter: VM_G4_L1_FAST_ADDITION
- Production start API returned courseId: vedic_math
- Production activeChapterCode returned: L1_COMPLETING_WHOLE
- Production first question returned immediately in group A
- Production first question observed: 9 + 6 = ? Show your two steps.

This means production is not loading the new Grade 4 lesson package.
It is falling back to the old generic Vedic Math lesson.

## 5. Gap between expected and actual

Expected:
- Grade 4 should open VM_G4_L1_FAST_ADDITION.
- The tutor should introduce complements and the sutra first.
- The student should see the topic before the first question.

Actual in production:
- Grade 4 opens legacy chapter L1_COMPLETING_WHOLE.
- The first question is shown immediately.
- The Grade 4-specific topic intro is not the one being delivered.

## 6. Fix applied locally for Grade 4

Local code changes made in this round:

1. Grade 4 requests are routed to the Grade 4 MindSutra course instead of the legacy generic vedic_math course.
2. Catalog requests now pass grade and chapter so the client can load the right Grade 4 chapter list.
3. The UI now keeps the first question hidden until the intro/teaching flow hands control to the student.

## 7. Functional test checklist for Grade 4

Use this checklist when re-testing after deploy:

1. Open the Grade 4 demo link.
2. Confirm returned courseId is vedic_math_g4.
3. Confirm activeChapterCode is VM_G4_L1_FAST_ADDITION.
4. Confirm lesson title matches Grade 4 Lesson 1.
5. Confirm coach intro mentions complements or All From 9, Last From 10.
6. Confirm board explanation appears before the student question card.
7. Confirm the first student question appears only after intro/guided flow.
8. Confirm wrong answer gives step-specific help.
9. Confirm lesson path starts from exercise group A and progresses in order.

## 8. Main conclusion

The current production gap is real.
It is not only a presentation issue.
Grade 4 production is loading the wrong lesson engine first, and the UI also exposes the question too early.

This round fixes Grade 4 locally first.
