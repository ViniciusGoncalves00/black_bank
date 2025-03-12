import "../styles/main.css";

import * as THREE from 'three';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

import Alpine from "alpinejs";
import { SceneManager } from "./three/scene-manager";

declare global {
    interface Window {
      Alpine: typeof Alpine;
    }
  }
  
window.Alpine = Alpine;

window.addEventListener("DOMContentLoaded", () => {
  Alpine.start();
});

window.addEventListener("wheel", (event) => {
  event.preventDefault();

  const viewportHeight = window.innerHeight;
  const scrollAmount = viewportHeight * 1;

  if (event.deltaY > 0) {
    window.scrollTo({
      top: window.scrollY + scrollAmount,
      behavior: "smooth",
    });
  } else {
    window.scrollTo({
      top: window.scrollY - scrollAmount,
      behavior: "smooth",
    });
  }
}, { passive: false });

document.addEventListener("alpine:init", () => {
  const observer = new MutationObserver((mutations, obs) => {
    const canvas = document.getElementById("canvas");
    if (canvas) {
      InitializeThree();
      obs.disconnect(); // Para de observar após encontrar o elemento
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});


function InitializeThree(): void {
  const sceneManager = SceneManager.GetInstance();
  const scene = sceneManager.CreateScene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  const canvas = document.getElementById("canvas");
  if(canvas !== null) {
    canvas.appendChild(renderer.domElement);
  }
  
  const geometry = new THREE.BoxGeometry(7.5, 5.5, 0.01);
  const material_1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const material_2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const material_3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const material_4 = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const card_1 = new THREE.Mesh(geometry, material_1);
  const card_2 = new THREE.Mesh(geometry, material_2);
  const card_3 = new THREE.Mesh(geometry, material_3);
  const card_4 = new THREE.Mesh(geometry, material_4);
  
  scene.add(card_1);
  scene.add(card_2);
  scene.add(card_3);
  scene.add(card_4);

  card_1.position.set(0, 0, 0)
  card_2.position.set(50, 0, 0)
  card_3.position.set(100, 0, 0)
  card_4.position.set(150, 0, 0)
  
  camera.position.z = 10;

  let offset = 0;

  const moveLeft = () => {
    offset -= 50;
    updateCardPositions();
  };

  const moveRight = () => {
    offset += 50;
    updateCardPositions();
  };

  function updateCardPositions() {
    card_1.position.set(offset + 0, 0, 0);
    card_2.position.set(offset + 50, 0, 0);
    card_3.position.set(offset + 100, 0, 0);
    card_4.position.set(offset + 150, 0, 0);
  }

  document.querySelector(".left-button")?.addEventListener("click", moveLeft);
  document.querySelector(".right-button")?.addEventListener("click", moveRight);

  
  function animate() { 
      requestAnimationFrame(animate);
      card_1.rotation.y += 0.01;
      card_2.rotation.y += 0.01;
      card_3.rotation.y += 0.01;
      card_4.rotation.y += 0.01;
      renderer.render(scene, camera);
  }

  animate();
}