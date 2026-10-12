// Converts a "-soft" or "-dot" CSS variable name to its "-chip" counterpart -
// the medium-saturation variant used anywhere a category + short label
// needs to actually read clearly (task tags, timeline boxes, pills,
// badges) instead of blending into the pastel background.
export function toChipVar(varName) {
  if (!varName) return '--purple-chip';
  return varName.replace('-soft', '-chip').replace('-dot', '-chip');
}
