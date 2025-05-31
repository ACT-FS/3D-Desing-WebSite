let scene,
  camera,
  renderer,
  particles = [],
  mouseX = 0,
  mouseY = 0;

function init() {
  // Crear escena
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  // Crear partículas flotantes
  createParticles();

  // Crear geometrías 3D flotantes
  createFloatingShapes();

  // Posicionar cámara
  camera.position.z = 15;

  // Event listeners
  document.addEventListener("mousemove", onMouseMove);
  window.addEventListener("resize", onWindowResize);

  // Iniciar animación
  animate();
}

function createParticles() {
  const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
  const particleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
  });

  for (let i = 0; i < 200; i++) {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.x = (Math.random() - 0.5) * 50;
    particle.position.y = (Math.random() - 0.5) * 50;
    particle.position.z = (Math.random() - 0.5) * 50;

    particle.userData = {
      velocity: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      },
    };

    particles.push(particle);
    scene.add(particle);
  }
}

function createFloatingShapes() {
  // Crear diferentes formas geométricas
  const geometries = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.ConeGeometry(0.5, 1, 8),
    new THREE.CylinderGeometry(0.3, 0.3, 1, 8),
  ];

  const materials = [
    new THREE.MeshBasicMaterial({
      color: 0xff6b6b,
      transparent: true,
      opacity: 0.7,
      wireframe: true,
    }),
    new THREE.MeshBasicMaterial({
      color: 0x4ecdc4,
      transparent: true,
      opacity: 0.7,
      wireframe: true,
    }),
    new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.7,
      wireframe: true,
    }),
    new THREE.MeshBasicMaterial({
      color: 0x9b59b6,
      transparent: true,
      opacity: 0.7,
      wireframe: true,
    }),
  ];

  for (let i = 0; i < 15; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const shape = new THREE.Mesh(geometry, material);

    shape.position.x = (Math.random() - 0.5) * 30;
    shape.position.y = (Math.random() - 0.5) * 30;
    shape.position.z = (Math.random() - 0.5) * 20;

    shape.rotation.x = Math.random() * Math.PI;
    shape.rotation.y = Math.random() * Math.PI;

    shape.userData = {
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      },
      floatSpeed: Math.random() * 0.02 + 0.01,
    };

    scene.add(shape);
  }
}

function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Animar partículas
  particles.forEach((particle) => {
    particle.position.x += particle.userData.velocity.x;
    particle.position.y += particle.userData.velocity.y;
    particle.position.z += particle.userData.velocity.z;

    // Rebotar en los límites
    if (particle.position.x > 25 || particle.position.x < -25) {
      particle.userData.velocity.x *= -1;
    }
    if (particle.position.y > 25 || particle.position.y < -25) {
      particle.userData.velocity.y *= -1;
    }
    if (particle.position.z > 25 || particle.position.z < -25) {
      particle.userData.velocity.z *= -1;
    }
  });

  // Animar formas geométricas
  scene.children.forEach((child) => {
    if (child.userData.rotationSpeed) {
      child.rotation.x += child.userData.rotationSpeed.x;
      child.rotation.y += child.userData.rotationSpeed.y;
      child.rotation.z += child.userData.rotationSpeed.z;

      // Efecto de flotación
      child.position.y +=
        Math.sin(Date.now() * child.userData.floatSpeed) * 0.001;
    }
  });

  // Efecto de paralaje con el mouse
  camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

// Suavizar el scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Inicializar cuando la página cargue
window.addEventListener("load", init);
