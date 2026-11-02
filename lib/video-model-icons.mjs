// Explicit model-family slugs only. Generic workflows must not imply a fixed model.
const families = [
  [/^banana(?:-|$)/, 'nano-banana'],
  [/^gpt-image(?:-|$)/, 'gpt-image'],
  [/^(?:seedance|seedream)(?:-|$)/, 'seedream-seedance'],
  [/^kling(?:-|$)/, 'kling'],
  [/^wan(?:-|$)/, 'wan'],
  [/^hailuo(?:-|$)/, 'hailuo'],
  [/^minimax(?:-|$)/, 'minimax'],
  [/^happy-horse(?:-|$)/, 'happy-horse'],
];

export function videoModelIcon(slug) {
  if (typeof slug !== 'string') return null;
  const family = families.find(([pattern]) => pattern.test(slug));
  return family ? `/assets/video-models/${family[1]}.webp` : null;
}
