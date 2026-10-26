export type ProfilePoint = [number, number, number, number];

/** Data is pre-projected at build time: distance, elevation, map x, map y. */
export function interpolateProfile(points: ProfilePoint[], distance: number): ProfilePoint {
  if (distance <= points[0][0]) return [...points[0]];
  if (distance >= points[points.length - 1][0]) return [...points[points.length - 1]];
  let low = 0, high = points.length - 1;
  while (low + 1 < high) {
    const middle = (low + high) >>> 1;
    if (points[middle][0] <= distance) low = middle;
    else high = middle;
  }
  const a = points[low], b = points[high];
  const fraction = (distance - a[0]) / (b[0] - a[0]);
  return [distance, a[1] + fraction * (b[1] - a[1]), a[2] + fraction * (b[2] - a[2]), a[3] + fraction * (b[3] - a[3])];
}
