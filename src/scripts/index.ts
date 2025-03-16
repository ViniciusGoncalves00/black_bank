import "../styles/main.css";
import * as THREE from 'three';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import Alpine from "alpinejs";
import { SceneManager } from "./three/scene-manager";
import { Carrousel } from "./three/carrousel";

declare global {
    interface Window {
      Alpine: typeof Alpine;
    }
  }

ListenDomContentLoad()
ListenWheel()
ListenSections()
ListenResize()

let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let canvas: HTMLElement | null;
let carrousel: Carrousel | null = null;

let currentCard = 1;
const totalCards = 4;

function ListenDomContentLoad() {
  window.addEventListener("DOMContentLoaded", () => {
    window.Alpine = Alpine;
    Alpine.start();

    const observer = new MutationObserver((mutations, obs) => {
      const canvas = document.getElementById("canvas");
      if (canvas) {
        InitializeThree();
        obs.disconnect();
      }
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

function ListenWheel() {
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
}

function ListenSections() {
  const menuLinks = document.querySelectorAll('.menu-link');

  function highlightCurrentSection() {
      const sections = document.querySelectorAll('section');
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const windowCenter = scrollPosition + viewportHeight / 2;

      sections.forEach((section, index) => {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + viewportHeight;
          const pixelTolerance = 2;

          if (windowCenter >= sectionTop - pixelTolerance && windowCenter < sectionBottom - pixelTolerance) {
              menuLinks.forEach((link) => link.classList.remove('bg-yellow-400'));
              menuLinks[index].classList.add('bg-yellow-400');
          }
      });
  }

  const observer = new MutationObserver(() => {
      highlightCurrentSection();
  });

  const element = document.getElementById('content')
  if(element) {
    observer.observe((element), { childList: true, subtree: true });
  }

  window.addEventListener('scroll', highlightCurrentSection);
  window.addEventListener('load', highlightCurrentSection);
}

function ListenResize() {
  window.addEventListener('resize', SetCamera);
}

function SetCamera() {
  if(canvas) {
    const newWidth = canvas.clientWidth;
    const newHeight = canvas.clientHeight;
  
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(newWidth, newHeight);
  }
}

function InitializeThree(): void {
  const sceneManager = SceneManager.GetInstance();
  scene = sceneManager.CreateScene();
  scene.background = null;

  renderer = new THREE.WebGLRenderer({ alpha: true });
  
  canvas = document.getElementById("canvas");
  if(canvas) {
    canvas.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

  SetCamera();
  
  const geometry = new THREE.BoxGeometry(7.5, 5.5, 0.1);
  const material_1 = new THREE.MeshBasicMaterial({ color: new THREE.Color("rgba(20, 20, 20)") });
  const material_2 = new THREE.MeshBasicMaterial({ color: new THREE.Color("rgba(240, 240, 240)") });
  const material_3 = new THREE.MeshBasicMaterial({ color: new THREE.Color("rgba(227, 153, 57)") });
  const material_4 = new THREE.MeshBasicMaterial({ color: new THREE.Color("rgba(200, 0, 60)") });
  const card_1 = new THREE.Mesh(geometry, material_1);
  const card_2 = new THREE.Mesh(geometry, material_2);
  const card_3 = new THREE.Mesh(geometry, material_3);
  const card_4 = new THREE.Mesh(geometry, material_4);
  
  scene.add(card_1);
  scene.add(card_2);
  scene.add(card_3);
  scene.add(card_4);

  card_1.rotation.set(0, -60 * THREE.MathUtils.DEG2RAD, 0)
  card_2.rotation.set(0, -60 * THREE.MathUtils.DEG2RAD, 0)
  card_3.rotation.set(0, -60 * THREE.MathUtils.DEG2RAD, 0)
  card_4.rotation.set(0, -60 * THREE.MathUtils.DEG2RAD, 0)
  
  camera.position.z = 10;
  camera.position.x = 0;

  carrousel = new Carrousel([card_1, card_2, card_3, card_4], 25)


  const updateCardDescription = () => {
    const cardDescription = document.getElementById("card-description");
    if (cardDescription) {
      const cardHTML = `/carrousel/card${currentCard}.html`;
      fetch(cardHTML)
        .then(res => {
          if (!res.ok) throw new Error(`Card card${currentCard} not found`);
          return res.text();
        })
        .then(html => cardDescription.innerHTML = html)
        .catch(err => console.error(err));
    }
  };
  
  updateCardDescription();
  
  const moveLeft = () => {
    carrousel?.Rotate(-1);
    currentCard = (currentCard - 1 + totalCards) % totalCards;
    updateCardDescription();
  };
  
  const moveRight = () => {
    carrousel?.Rotate(1);
    currentCard = (currentCard + 1) % totalCards;
    updateCardDescription();
  };

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