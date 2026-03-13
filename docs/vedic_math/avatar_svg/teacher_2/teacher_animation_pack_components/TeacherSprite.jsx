import React from "react";

const sizes = {
  "hero_main": {
    "width": 265,
    "height": 335
  },
  "expression_pose_1": {
    "width": 155,
    "height": 225
  },
  "expression_pose_2": {
    "width": 153,
    "height": 225
  },
  "gesture_greeting": {
    "width": 155,
    "height": 228
  },
  "gesture_explain": {
    "width": 155,
    "height": 228
  },
  "gesture_point": {
    "width": 155,
    "height": 228
  },
  "gesture_board_work": {
    "width": 155,
    "height": 228
  },
  "gesture_question": {
    "width": 155,
    "height": 235
  },
  "gesture_encourage": {
    "width": 155,
    "height": 235
  },
  "gesture_emphasize": {
    "width": 155,
    "height": 235
  },
  "gesture_conclude": {
    "width": 155,
    "height": 235
  },
  "head_blink_look": {
    "width": 150,
    "height": 215
  },
  "head_nod_tilt": {
    "width": 150,
    "height": 215
  }
};

export default function TeacherSprite({ sprite = "hero_main", width, height, ...props }) {
  const size = sizes[sprite] || sizes.hero_main;
  const w = width || size.width;
  const h = height || height || size.height;
  return <img src={`./${sprite}.png`} alt={sprite} width={w} height={h} {...props} />;
}
