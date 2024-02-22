 import * as THREE from "three"

  let camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    particles: THREE.Mesh[],
    control,
    light: THREE.DirectionalLight,
    clock: THREE.Clock;
  const canvas = document.getElementById("smoke-canvas");

  const isDark = document.documentElement.classList.contains("dark");

  const COLOR_PRIMARY = isDark ? 0xdddddd : 0x333333;
  const COLOR_SECONDARY = isDark ? 0x333333 : 0xdddddd;

  let bgColor;
  let lightColor;

  function init() {
    bgColor = COLOR_SECONDARY;
    lightColor = COLOR_PRIMARY;

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvas as HTMLElement,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      200,
    );
    camera.position.z = 5;
    scene.add(camera);

    const backgroundColor = new THREE.Color(bgColor);
    scene.background = backgroundColor;

    renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const ambientLight = new THREE.AmbientLight(lightColor, 0);
    scene.add(ambientLight);

    light = new THREE.DirectionalLight(lightColor, 0.5);
    light.position.set(-1, 0, 1);
    scene.add(light);

    const tex = new THREE.TextureLoader().load("/smoke.png");
    const material = new THREE.MeshLambertMaterial({
      color: lightColor,
      depthWrite: false,
      map: tex,
      transparent: true,
    });
    const geometry = new THREE.PlaneGeometry(5, 5);
    particles = [];

    const size = 5;

    for (let i = 0; i < 150; i++) {
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        (Math.random() - 0.5) * size,
        (Math.random() - 0.5) * size,
        (Math.random() - 0.5) * size,
      );
      if (i % 2 === 0) {
        particle.rotation.z = Math.random() * Math.PI;
      } else {
        particle.rotation.z = -Math.random() * Math.PI;
      }
      scene.add(particle);
      particles.push(particle);
    }

    renderer.setAnimationLoop(update);
  }

  function update() {
    const dt = clock.getDelta();
    if (particles) {
      particles.forEach((particle) => {
        const z = particle.rotation.z;
        particle.lookAt(camera.position);
        particle.rotation.z = z + dt * 0.1;
      });
    }
    renderer.render(scene, camera);
  }

  init();