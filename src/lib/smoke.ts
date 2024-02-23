import { log } from "node_modules/astro/dist/core/logger/core";
import * as THREE from "three"

let camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  particles: THREE.Mesh[],
  control,
  // light: THREE.DirectionalLight,
  clock: THREE.Clock;

const canvas = document.getElementById("smoke-canvas");

export function initSmokeBackground(isDark: boolean) {

  const CONFIG = {
    material: {
      color: isDark ? 0xffffff : 0xdddddd
    },
    light: {
      ambientLight: {
        color: isDark ? 0xdddddd : 0x333333,
        intensity: isDark ? 1.5 : 3
      },
      directionalLight1: {
        color: 0xffffff,
        intensity: isDark ? 0.5 : 3
      }
    },
    backgroud: {
      color: isDark ? 0x333333 : 0xdddddd
    }
  }

  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvas as HTMLElement,
  });

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000,
  );
  camera.position.z = 5;
  scene.add(camera);

  renderer.setSize(window.innerWidth, window.innerHeight);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const backgroundColor = new THREE.Color(CONFIG.backgroud.color);
  scene.background = backgroundColor;

  const ambientLight = new THREE.AmbientLight(CONFIG.light.ambientLight.color, CONFIG.light.ambientLight.intensity);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(CONFIG.light.directionalLight1.color, CONFIG.light.directionalLight1.intensity);
  directionalLight1.position.set(-1, 0, 1);
  scene.add(directionalLight1);


  const tex = new THREE.TextureLoader().load("/smoke2.jpg");
  const material = new THREE.MeshLambertMaterial({
    color: CONFIG.material.color,
    depthWrite: false,
    map: tex,
    transparent: true,
  });
  const geometry = new THREE.PlaneGeometry(8, 8);
  particles = [];

  const size = 5;

  for (let i = 0; i < 8; i++) {
    const particle = new THREE.Mesh(geometry, material);
    particle.position.set(
      (Math.random() - 0.5) * size,
      (Math.random() - 0.5) * size,
      (Math.random() - 0.5) * size,
    );
    particle.rotation.x = 1.16
    particle.rotation.y = -0.12
    particle.rotation.z = Math.random() * 2 * Math.PI;
    particle.material.opacity = 0.55

    particles.push(particle);
    scene.add(particle);
  }

  renderer.setAnimationLoop(update);
}

function update() {
  const dt = clock.getDelta();
  if (particles) {
    particles.forEach((particle) => {
      const z = particle.rotation.z;
      particle.lookAt(camera.position);
      particle.rotation.z = z + dt * 0.15;

    });
  }
  renderer.render(scene, camera);
}