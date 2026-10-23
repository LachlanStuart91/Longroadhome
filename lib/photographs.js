// Web delivery copies only. The original uploads in public/images stay intact.
export const photographs = {
  'running-desert': { file: 'running-desert.png', width: 3392, height: 1894 },
  'running-together': { file: 'running-together.png', width: 3388, height: 1884 },
  'between-runs': { file: 'between-runs.png', width: 3354, height: 1902 },
  'on-the-road': { file: 'on-the-road.jpeg', width: 3374, height: 1914 },
};

export const photoWidths = [480, 768, 960, 1280, 1600, 2400];
export const photoUrl = (name, width) => `/images/web/${name}-${width}.webp`;
