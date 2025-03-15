import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class Three {
  constructor(canvas, book) {
    this.canvas = canvas;
    this.book = book;

    this.scene = new T.Scene();

    this.camera = new T.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 5);
    this.scene.add(this.camera);

    this.renderer = new T.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.controls = new OrbitControls(this.camera, this.canvas);

    this.clock = new T.Clock();

    this.setLights();
    this.setGeometry();
    this.render();
    this.setResize();
  }

  setLights() {
    this.ambientLight = new T.AmbientLight(0xffffff, 1);
    this.scene.add(this.ambientLight);
  }

  setGeometry() {
    const loader = new T.TextureLoader();
    const materials = [
      new T.MeshBasicMaterial({ color: 0xffffff }), // Lewy bok
      new T.MeshBasicMaterial({ color: 0xffffff }), // Prawy bok
      new T.MeshBasicMaterial({ color: 0xffffff }), // Góra
      new T.MeshBasicMaterial({ color: 0xffffff }), // Dół
      new T.MeshBasicMaterial({ map: loader.load(this.book) }), // Przód
      new T.MeshBasicMaterial({ color: 0xffffff }) // Tył
    ];

    const geometry = new T.BoxGeometry(3.5, 5, 0.2); // Wysokość, szerokość, grubość
    this.card = new T.Mesh(geometry, materials);
    this.scene.add(this.card);
  }

  render() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.card.rotation.y += 0.01; // Obrót w osi Y
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  setResize() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    const canvas = this.canvas;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}