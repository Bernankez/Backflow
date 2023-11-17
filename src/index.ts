import * as THREE from "three";
import fragmentShader from "./shader/test.glsl?raw";

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

  uniforms = {
    iResolution: {
      value: new THREE.Vector2(container.clientWidth, container.clientHeight),
    },
    iTime: {
      value: 1.0,
    },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: DEFAULT_VERTEX_SHADER,
    fragmentShader,
  });
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
  uniforms && (uniforms.iTime.value += 0.01);
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
    uniforms.iResolution.value.x = renderer.domElement.width;
    uniforms.iResolution.value.y = renderer.domElement.height;
  }
}

// const DEFAULT_VERTEX_SHADER = "attribute vec4 a_pos;" + "void main(){" + "gl_Position=a_pos;" + "}";
