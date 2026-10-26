import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const radians = n => n * Math.PI / 180;
export function readRoute(xml) {
  assert(!/<!DOCTYPE|<!ENTITY/i.test(xml), 'External XML definitions are not supported');
  assert.equal((xml.match(/<trkseg\b[^>]*>/g) || []).length, 1, 'Review multiple track segments before importing');
  const points = [...xml.matchAll(/<trkpt\b([^>]*)>([\s\S]*?)<\/trkpt>/g)].map(match => {
    const lat = match[1].match(/lat="([^"]+)"/)?.[1];
    const lon = match[1].match(/lon="([^"]+)"/)?.[1];
    const elevation = match[2].match(/<ele>([^<]+)<\/ele>/)?.[1];
    assert(lat?.trim() && lon?.trim() && elevation?.trim(), 'Each route point needs coordinates and elevation');
    const point = { lat: Number(lat), lon: Number(lon), ele: Number(elevation), km: 0 };
    assert(Object.values(point).every(Number.isFinite), 'Route values must be finite');
    assert(Math.abs(point.lat) <= 90 && Math.abs(point.lon) <= 180, 'Invalid coordinates');
    return point;
  });
  assert(points.length > 2, 'A route needs at least three track points');
  let largestStepKm = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    const h = Math.sin(radians(b.lat - a.lat) / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(radians(b.lon - a.lon) / 2) ** 2;
    const distance = 6371.0088 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
    b.km = a.km + distance;
    largestStepKm = Math.max(largestStepKm, distance);
  }
  assert(largestStepKm < 1, 'Review route gaps larger than one kilometre');
  assert(points.at(-1).km > 0, 'Route must have a positive distance');
  return { points, largestStepKm };
}

export function simplifyRoute(points, toleranceMetres = 75) {
  const xy = p => [p.lon * 111195 * Math.cos(radians(-30)), p.lat * 111195];
  const distanceSquared = (p, a, b) => {
    const [x, y] = xy(p), [ax, ay] = xy(a), [bx, by] = xy(b);
    const dx = bx - ax, dy = by - ay;
    const t = dx || dy ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy))) : 0;
    return (x - ax - t * dx) ** 2 + (y - ay - t * dy) ** 2;
  };
  const kept = new Set([0, points.length - 1]);
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let furthest = -1, maximum = toleranceMetres ** 2;
    for (let i = first + 1; i < last; i++) {
      const distance = distanceSquared(points[i], points[first], points[last]);
      if (distance > maximum) { maximum = distance; furthest = i; }
    }
    if (furthest !== -1) { kept.add(furthest); stack.push([first, furthest], [furthest, last]); }
  }
  return [...kept].sort((a, b) => a - b).map(i => [points[i].lon, points[i].lat]);
}

export function elevationProfile(points, buckets = 650) {
  const kept = new Set([0, points.length - 1]);
  let start = 0;
  while (start < points.length) {
    const bucket = Math.floor(points[start].km / points.at(-1).km * buckets);
    let end = start, min = start, max = start;
    while (end + 1 < points.length && Math.floor(points[end + 1].km / points.at(-1).km * buckets) === bucket) {
      end++;
      if (points[end].ele < points[min].ele) min = end;
      if (points[end].ele > points[max].ele) max = end;
    }
    [start, end, min, max].forEach(i => kept.add(i));
    start = end + 1;
  }
  // Preserve peaks and troughs instead of smoothing away real elevation changes.
  return [...kept].sort((a, b) => a - b).map(i => [+points[i].km.toFixed(6), points[i].ele, points[i].lon, points[i].lat]);
}

export function importRoute(xml) {
  const { points, largestStepKm } = readRoute(xml);
  return {
    source: {
      name: 'Run Across Australia (WA - Brisbane)',
      suppliedDate: '2026-10-26',
      sha256: createHash('sha256').update(xml).digest('hex'),
      pointCount: points.length,
      distanceMethod: 'Sum of haversine distances, mean Earth radius 6371.0088 km. Not a surveyed distance.',
      drawingMethod: '75 m RDP simplification for the overview; elevation bucket endpoints and extrema retained.',
    },
    stats: {
      distanceKm: points.at(-1).km,
      minimumElevation: Math.min(...points.map(p => p.ele)),
      maximumElevation: Math.max(...points.map(p => p.ele)),
      largestStepKm,
    },
    route: { type: 'LineString', coordinates: simplifyRoute(points) },
    profile: elevationProfile(points),
  };
}
