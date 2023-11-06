import * as THREE from "three";
import fragmentShader from "./shader/test.glsl?raw";

const camera = new THREE.Camera();
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();

export function init(el: HTMLDivElement) {
  const container = el;
  camera.position.z = 1;
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
}

export function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  uniforms.time.value += 0.01;
  uniforms.iTime.value += 0.01;
  // uniforms.albumColorMap.value = createColor();
  renderer.render(scene, camera);
}

function createColor() {
// 纹理设置
  const width = 2;
  const height = 1;
  const textureFormat = THREE.RGBAFormat;

  // 计算需要颜色数据总量
  const dataSize = width * height * 3; // 3 channels RGB

  // 生成颜色数据
  const colors = new Float32Array(dataSize);
  let i = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
    // 这里可以设置颜色值
      colors[i++] = x / width;
      colors[i++] = y / height;
      colors[i++] = 0;
    }
  }

  const texture = new THREE.DataTexture(colors, width, height, textureFormat);
  texture.needsUpdate = true; return texture;
}

const uniforms = {
  resolution: {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  },
  iResolution: {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  },
  iTime: {
    type: "f",
    value: 1.0,
  },
  time: {
    type: "f",
    value: 1.0,
  },
  albumColorMap: {
    value: createColor(),
  },
};
const geometry = new THREE.PlaneGeometry(2, 2);

// const DEFAULT_VERTEX_SHADER = "attribute vec4 a_pos;" + "void main(){" + "gl_Position=a_pos;" + "}";

const DEFAULT_VERTEX_SHADER = `void main() {
            gl_Position = vec4( position, 1.0 );
        }`;

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: DEFAULT_VERTEX_SHADER,
  fragmentShader,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
