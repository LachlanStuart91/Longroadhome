import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { geoConicConformal } from 'd3-geo';
import { readRoute, simplifyRoute, elevationProfile } from './lib/route-data.mjs';
import { interpolateProfile } from '../src/lib/route-profile.ts';

const data = JSON.parse(readFileSync(new URL('../src/data/proposed-route.json', import.meta.url), 'utf8'));
const coast = JSON.parse(readFileSync(new URL('../src/data/australia-coastline.json', import.meta.url), 'utf8'));
const fixture = (rows) => `<gpx><trk><trkseg>${rows.map(([lat,lon,ele]) => `<trkpt lat="${lat}" lon="${lon}"><ele>${ele}</ele></trkpt>`).join('')}</trkseg></trk></gpx>`;

test('the supplied route is traceable and keeps the original endpoints and extrema', () => {
  assert.equal(data.source.sha256, 'a25cae4f173731649fab534840eb988dea155bf22990b309c52aafecb0be6a80');
  assert.equal(data.source.pointCount, 54506);
  assert(Math.abs(data.stats.distanceKm - 4421.405420313452) < .000001);
  assert.deepEqual(data.route.coordinates[0], [115.75529, -31.89491]);
  assert.deepEqual(data.route.coordinates.at(-1), [153.10395, -27.26339]);
  assert.equal(Math.min(...data.profile.map(p=>p[1])), data.stats.minimumElevation);
  assert.equal(Math.max(...data.profile.map(p=>p[1])), data.stats.maximumElevation);
  assert.equal(data.profile[0][0], 0);
  assert(Math.abs(data.profile.at(-1)[0] - data.stats.distanceKm) < .000001);
  assert(data.profile.every((p,i)=>p.every(Number.isFinite) && (i===0 || p[0]>=data.profile[i-1][0])));
});

test('distance is derived from coordinates and zero elevation is valid', () => {
  const { points } = readRoute(fixture([[0,0,0],[0,.001,10],[0,.002,0]]));
  assert(Math.abs(points.at(-1).km - .22239016) < .000001);
});

test('rejects malformed, missing, out-of-range and discontinuous track data', () => {
  assert.throws(()=>readRoute('<!DOCTYPE gpx><gpx></gpx>'));
  assert.throws(()=>readRoute('<gpx><trkseg></trkseg><trkseg></trkseg></gpx>'));
  assert.throws(()=>readRoute(fixture([[0,0,0],[0,.001,''],[0,.002,0]])));
  assert.throws(()=>readRoute(fixture([[91,0,0],[0,.001,10],[0,.002,0]])));
  assert.throws(()=>readRoute(fixture([[0,0,0],[0,2,10],[0,3,0]])));
  assert.throws(()=>readRoute(fixture([[0,0,0],[0,0,10],[0,0,0]])));
});

test('simplification retains meaningful bends and profile sampling retains peaks', () => {
  const points = [
    {lon:115,lat:-30,ele:0,km:0},
    {lon:115.1,lat:-30,ele:100,km:1},
    {lon:115.2,lat:-29.9,ele:-2,km:2},
    {lon:115.3,lat:-30,ele:680,km:3},
    {lon:115.4,lat:-30,ele:0,km:4},
  ];
  const simplified=simplifyRoute(points);
  assert.deepEqual(simplified[0],[115,-30]);
  assert.deepEqual(simplified.at(-1),[115.4,-30]);
  assert(simplified.some(p=>p[1]===-29.9));
  const profile=elevationProfile(points,1);
  assert.equal(Math.max(...profile.map(p=>p[1])),680);
  assert.equal(Math.min(...profile.map(p=>p[1])),-2);
});

test('map and profile use one projection and keep every route coordinate in frame', () => {
  const project=geoConicConformal().parallels([-18,-36]).rotate([-134,0]).fitExtent([[20,28],[980,752]],coast.feature);
  for(const coordinates of data.route.coordinates) {
    const p=project(coordinates);
    assert(p && p.every(Number.isFinite));
    assert(p[0]>=0 && p[0]<=1000 && p[1]>=0 && p[1]<=780);
  }
});

test('exploration interpolates and clamps values without inventing route endpoints', () => {
  const values=[[0,10,2,4],[10,30,12,24],[20,20,22,44]];
  assert.deepEqual(interpolateProfile(values,5),[5,20,7,14]);
  assert.deepEqual(interpolateProfile(values,-1),values[0]);
  assert.deepEqual(interpolateProfile(values,100),values[2]);
  assert.deepEqual(interpolateProfile(values,10),values[1]);
  assert.deepEqual(interpolateProfile([[0,0,0,0],[0,0,0,0],[10,10,10,10]],5),[5,5,5,5]);
});
