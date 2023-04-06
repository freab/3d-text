import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * loading
 */
const loadingManager = new THREE.LoadingManager();
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const group = new THREE.Group();

/***
 * fonts
 */
const fontloader = new THREE.FontLoader(loadingManager);
fontloader.load("/textures/Meaza_Regular.json", (fonts) => {
  const textGeometry = new THREE.TextBufferGeometry("ፍሬአብ መስፍን", {
    font: fonts,
    size: 0.8,
    height: 0.3,
    curveSegments: 112,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.computeBoundingBox();
  //   console.log(textGeometry.boundingBox);
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  //   );
  textGeometry.center();

  const textmaterial = new THREE.MeshNormalMaterial();
  const text = new THREE.Mesh(textGeometry, textmaterial);
  scene.add(text);
  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  const Material = new THREE.MeshNormalMaterial({
    wireframe: true,
  });
  const tourusgeo = new THREE.BoxBufferGeometry(0.3, 0.3, 0.3, 10, 10);
  for (let i = 0; i < 150; i++) {
    const donut = new THREE.Mesh(donutGeometry, Material);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    group.add(donut);

    scene.add(group);
  }
  for (let i = 0; i < 200; i++) {
    const torus = new THREE.Mesh(tourusgeo, Material);

    torus.position.x = (Math.random() - 0.5) * 10;
    torus.position.y = (Math.random() - 0.5) * 10;
    torus.position.z = (Math.random() - 0.5) * 10;

    torus.rotation.x = Math.random() * Math.PI;
    torus.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    torus.scale.set(scale, scale, scale);

    group.add(torus);
    scene.add(group);
  }
});

/***
 * overlay
 */

const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: {
    uAlpha: { value: 0 },
  },
  vertexShader: `
  void main(){
    gl_Position = vec4(position, 1.0);
  }`,
  fragmentShader: `
  uniform float uAlpha;
  void main(){
    gl_FragColor = vec4(0.0,0.0,0.0,uAlpha);
  }
  `,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  10000
);
camera.position.x = 10000 * -2;
camera.position.y = 1;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enabled = false;

/***
 * mouse hover
 */
let mouseX = 0;
let mouseY = 0;
const mouseFX = {
  windowHalfX: window.innerWidth / 2,
  windowHalfY: window.innerHeight / 2,
  coordinates: function (coordX, coordY) {
    mouseX = (coordX - mouseFX.windowHalfX) * 0.09;
    mouseY = (coordY - mouseFX.windowHalfY) * 0.09;
  },
  onMouseMove: function (e) {
    mouseFX.coordinates(e.clientX, e.clientY);
  },
  onTouchMove: function (e) {
    mouseFX.coordinates(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    );
  },
};
document.addEventListener("mousemove", mouseFX.onMouseMove, false);
document.addEventListener("touchmove", mouseFX.onTouchMove, false);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#ff8800");

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  camera.position.x = (mouseX - camera.position.x) * 0.05;
  camera.position.y += (mouseY * -1 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  // Update controls
  controls.update();
  const rx = Math.sin(elapsedTime * 0.7) * 0.5;
  const ry = Math.sin(elapsedTime * 0.3) * 0.5;
  const rz = Math.sin(elapsedTime * 0.2) * 0.5;
  group.rotation.x = ry;
  group.rotation.y = rx;
  group.rotation.z = rz;
  renderer.render(scene, camera);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
