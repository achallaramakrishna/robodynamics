const SVG_CATEGORY_TO_FILES = {
  arrows: [
    "arrow_up.svg",
    "arrow_therefore.svg",
    "arrow_sw.svg",
    "arrow_se.svg",
    "arrow_right.svg",
    "arrow_nw.svg",
    "arrow_ne.svg",
    "arrow_left.svg",
    "arrow_down.svg",
    "arrow_double.svg",
    "arrow_curved.svg",
  ],
  clocks: [
    "clock_face.svg",
    "clock_9oclock.svg",
    "clock_6oclock.svg",
    "clock_3oclock.svg",
    "clock_12oclock.svg",
  ],
  coding: [
    "alphabet_grid.svg",
    "shift_plus3.svg",
    "shift_minus2.svg",
  ],
  data: [
    "bar_chart.svg",
    "line_graph.svg",
    "pie_chart_4.svg",
    "table_3x4.svg",
  ],
  directions: [
    "compass.svg",
    "person.svg",
    "turn_left.svg",
    "turn_right.svg",
  ],
  logic: [
    "analogy_frame.svg",
    "grid_2x2.svg",
    "grid_3x3.svg",
    "syllogism.svg",
    "venn_2.svg",
    "venn_3.svg",
  ],
  patterns: [
    "fold_symmetry.svg",
    "mirror_line.svg",
    "rotation_90.svg",
    "rotation_180.svg",
  ],
  relations: [
    "blood_relation_node.svg",
    "family_tree.svg",
  ],
  seating: [
    "seat_circle.svg",
    "seat_square.svg",
    "seating_circular_6.svg",
    "seating_circular_8.svg",
    "seating_linear_5.svg",
  ],
  series: [
    "box_correct.svg",
    "box_empty.svg",
    "box_highlight.svg",
    "box_question.svg",
    "box_wrong.svg",
    "circle_highlight.svg",
    "series_row.svg",
    "series_row_6.svg",
  ],
  shapes: [
    "circle.svg",
    "hexagon.svg",
    "oval.svg",
    "parallelogram.svg",
    "pentagon.svg",
    "rectangle.svg",
    "rhombus.svg",
    "square.svg",
    "star.svg",
    "trapezoid.svg",
    "triangle.svg",
    "triangle_right.svg",
  ],
  vedic: [
    "complement_all_from_9.svg",
    "criss_cross_2x2.svg",
    "cubing_2digit.svg",
    "doubling_chain.svg",
    "eleven_trick.svg",
    "linear_eq_sutra.svg",
    "nikhilam_base100.svg",
    "paravartya_division.svg",
    "square_root_inspection.svg",
    "squaring_near_base.svg",
    "vinculum_bar.svg",
    "vm_algebra_balance.svg",
    "vm_borrow_free_subtraction.svg",
    "vm_complements_whole.svg",
    "vm_criss_cross_2dig.svg",
    "vm_criss_cross_4x4.svg",
    "vm_decimal_shift.svg",
    "vm_difference_squares.svg",
    "vm_division_flag.svg",
    "vm_divisibility_rule.svg",
    "vm_doubling_chain.svg",
    "vm_doubling_halving.svg",
    "vm_exponent_table.svg",
    "vm_hcf_venn.svg",
    "vm_identity_expand.svg",
    "vm_mult_by_11.svg",
    "vm_mult_by_5_25.svg",
    "vm_near_100.svg",
    "vm_near_100_deficit.svg",
    "vm_nikhilam_base1000.svg",
    "vm_nikhilam_base10000.svg",
    "vm_paravartya_steps.svg",
    "vm_percentage_bar.svg",
    "vm_simultaneous_lines.svg",
    "vm_squares_near50.svg",
    "vm_square_formula.svg",
    "vm_tables_11_19.svg",
    "vm_triangle_area.svg",
    "vm_x11_split.svg",
  ],
} as const;

const SVG_CATEGORY_BY_FILE = Object.entries(SVG_CATEGORY_TO_FILES).reduce<Record<string, string>>((acc, [category, files]) => {
  for (const file of files) {
    acc[file] = category;
  }
  return acc;
}, {});

export function resolveMathSvgAssetUrl(rawAsset?: string | null): string | null {
  const value = String(rawAsset || "").trim();
  if (!value) {
    return null;
  }
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }

  const normalized = value.replace(/^\/+/, "");
  if (normalized.startsWith("math-svgs/")) {
    return `/${normalized}`;
  }

  const lower = normalized.toLowerCase();
  if (lower.includes(".") && !lower.endsWith(".svg")) {
    return null;
  }

  if (normalized.includes("/")) {
    const withExt = lower.endsWith(".svg") ? normalized : `${normalized}.svg`;
    return `/math-svgs/${withExt}`;
  }

  const fileName = lower.endsWith(".svg") ? lower : `${lower}.svg`;
  const category = SVG_CATEGORY_BY_FILE[fileName] ?? "vedic";
  return `/math-svgs/${category}/${fileName}`;
}
