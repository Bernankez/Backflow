import { isDefined } from "../utils";
import { type Color, DEFAULT_K } from ".";

export function extractColors(colors: Color[], k?: number) {
  return kMeans(colors, k);
}

// reference https://github.com/dstein64/k-means-quantization-js
// Returns the k-means centroids.
function kMeans(colors: Color[], k?: number) {
  if (!isDefined(k)) {
    k = Math.min(DEFAULT_K, colors.length);
  }
  // Use a seeded random number generator instead of Math.random(),
  // so that k-means always produces the same centroids for the same
  // input.
  let rng_seed = 0;
  const random = () => {
    rng_seed = (rng_seed * 9301 + 49297) % 233280;
    return rng_seed / 233280;
  };
  // Choose initial centroids randomly.
  const centroids: Color[] = [];
  for (let i = 0; i < k; ++i) {
    const idx = Math.floor(random() * colors.length);
    centroids.push(colors[idx]);
  }
  while (true) {
    // 'clusters' is an array of arrays. each sub-array corresponds to
    // a cluster, and has the points in that cluster.
    const clusters: Color[][] = [];
    for (let i = 0; i < k; ++i) {
      clusters.push([]);
    }
    for (let i = 0; i < colors.length; ++i) {
      const point = colors[i];
      const nearestCentroid = nearestNeighbor(point, centroids);
      clusters[nearestCentroid].push(point);
    }
    let converged = true;
    for (let i = 0; i < k; ++i) {
      const cluster = clusters[i];
      let centroidI = [];
      if (cluster.length > 0) {
        centroidI = centroid(cluster);
      } else {
        // For an empty cluster, set a random point as the centroid.
        const idx = Math.floor(random() * colors.length);
        centroidI = colors[idx];
      }
      converged = converged && equal(centroidI, centroids[i]);
      centroids[i] = centroidI;
    }
    if (converged) {
      break;
    }
  }
  return centroids;
}

function nearestNeighbor(color: Color, neighbors: Color[]) {
  let bestDist = Infinity; // squared distance
  let bestIndex = -1;
  for (let i = 0; i < neighbors.length; ++i) {
    const neighbor = neighbors[i];
    let dist = 0;
    for (let j = 0; j < color.length; ++j) {
      dist += (color[j] - neighbor[j]) ** 2;
    }
    if (dist < bestDist) {
      bestDist = dist;
      bestIndex = i;
    }
  }
  return bestIndex;
}

// Returns the centroid of a dataset.
function centroid(colors: Color[]) {
  // Calculate running means.
  const runningCentroid = Array.from(colors[0]).fill(0) as Color;
  for (let i = 0; i < colors.length; ++i) {
    const point = colors[i];
    for (let j = 0; j < point.length; ++j) {
      runningCentroid[j] += (point[j] - runningCentroid[j]) / (i + 1);
    }
  }
  return runningCentroid;
}

// Checks for equality of elements in two arrays.
function equal(a1: number[], a2: number[]) {
  if (a1.length !== a2.length) { return false; }
  for (let i = 0; i < a1.length; ++i) {
    if (a1[i] !== a2[i]) { return false; }
  }
  return true;
};
