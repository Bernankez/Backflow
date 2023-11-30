import * as THREE from "three";
import fragmentShader from "./shader/bg.glsl?raw";
import { transformColors } from "./colors";

const DEFAULT_VERTEX_SHADER
= `void main() {
  gl_Position = vec4( position, 1.0 );
}`;

let camera: THREE.Camera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let uniforms: THREE.ShaderMaterialParameters["uniforms"];
let container: HTMLDivElement;
let playing = false;

export function init(el: HTMLDivElement) {
  container = el;
  camera = new THREE.Camera();
  camera.position.z = 1;
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);

  const { texture, size } = generateTexture();
  uniforms = {
    u_resolution: {
      value: new THREE.Vector2(container.clientWidth, container.clientHeight),
    },
    iResolution: {
      value: new THREE.Vector2(container.clientWidth, container.clientHeight),
    },
    u_time: {
      value: 1.0,
    },
    iTime: {
      value: 1.0,
    },
    u_color_map: {
      value: texture,
    },
    albumColorMap: {
      value: texture,
    },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: DEFAULT_VERTEX_SHADER,
    fragmentShader,
    glslVersion: THREE.GLSL3,
  });
  console.log(size);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  window.addEventListener("resize", onWindowResize, false);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  container.appendChild(renderer.domElement);

  return () => {
    mesh.geometry.dispose();
    scene.remove(mesh);
    container.removeChild(renderer.domElement);
  };
}

function render() {
  if (uniforms) {
    uniforms.u_time.value += 0.01;
    uniforms.iTime.value += 0.01;
  }
  renderer.render(scene, camera);
}

export function animate() {
  if (playing) {
    requestAnimationFrame(animate);
    render();
  }
}

export function play() {
  playing = true;
  animate();
}

export function pause() {
  playing = false;
}

export function isPlaying() {
  return playing;
}

function onWindowResize() {
  renderer.setSize(container.clientWidth, container.clientHeight);
  if (uniforms) {
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
    uniforms.iResolution.value.x = renderer.domElement.width;
    uniforms.iResolution.value.y = renderer.domElement.height;
  }
}

// const DEFAULT_VERTEX_SHADER = "attribute vec4 a_pos;" + "void main(){" + "gl_Position=a_pos;" + "}";

export function generateTexture() {
  const colorMap = transformColors();
  const tmp = [...colorMap];
  const size = 2 ** smallestPowOfTwo(tmp.length);
  const pixelsData: number[] = [];

  let ci = 0;
  for (let i = 0; i < size * size; i++) {
    const p = tmp[i % tmp.length];
    pixelsData.push(p[0], p[1], p[2], 0xFF);
    ci++;
    if (ci >= tmp.length) {
      ci = 0;
    }
  }

  console.log(
    "已创建颜色数量为",
    tmp.length,
    "色图尺寸为",
    size,
    "像素数量为",
    pixelsData.length / 4,
    "的材质",
    pixelsData,
  );
  return {
    texture: rebuildTextureFromPixels(size, new Uint8Array(pixelsData)),
    size,
  };
}

const smallestPowOfTwo = (b: number) =>
  Math.max(2, Math.ceil(Math.log2(Math.log2(b))));

function rebuildTextureFromPixels(size: number, pixelsData: Uint8Array | Uint8ClampedArray, textureFileter = THREE.LinearFilter) {
  if (!Number.isInteger(Math.log2(size))) {
    throw new TypeError("材质大小不是二的次幂！");
  }
  const dataTexture = new THREE.DataTexture(pixelsData, size, size, THREE.RGBAFormat, THREE.UnsignedByteType);
  dataTexture.minFilter = textureFileter;
  dataTexture.magFilter = textureFileter;
  dataTexture.needsUpdate = true;

  return dataTexture;
}

