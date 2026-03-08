Teacher Sprite Components

What is included:
- svg/: individual SVG wrappers for each extracted sprite
- png/: individual transparent PNG sprites
- teacher_spritesheet.svg: one combined inline symbol sheet
- manifest.json: IDs, categories, sizes, and file paths
- TeacherSprite.jsx: minimal React helper component
- demo_usage.html: simple usage example

Important:
- The original source was not layered vector art. It was a single poster image with embedded PNG artwork.
- These files are extracted crops, so they are reusable sprites, not true separately drawn vector parts.
- Some board-based poses keep board background intentionally.

Suggested IDs:
- Views: view_front, view_side, view_three_quarter
- Visemes: viseme_a, viseme_e, viseme_o, viseme_u, viseme_mbp, viseme_fv, viseme_l, viseme_sz, viseme_chj, viseme_r, viseme_wq, viseme_rest
- Gestures: gesture_greeting, gesture_explain_1, gesture_explain_2, gesture_point_to_board, gesture_write_on_board, gesture_hold_book, gesture_ask_question, gesture_answer, gesture_emphasize, gesture_ok_good, gesture_count, gesture_look_at_students
- Expressions: expression_neutral, expression_smile, expression_happy, expression_serious, expression_surprise, expression_thinking, expression_encouraging, expression_concerned, expression_thinking_soft
- Head movements: head_look_board, head_head_nod, head_head_tilt, head_blink, head_look_left, head_look_right, head_head_turn
- Idle: idle_hold_book, idle_hand_pocket, idle_hands_clasped
