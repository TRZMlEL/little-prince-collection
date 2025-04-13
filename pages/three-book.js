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
    this.ambientLight.intensity = 2.5;
    this.scene.add(this.ambientLight);
  }

  setGeometry() {
    const loader = new T.TextureLoader();
    const materials = [
      new T.MeshBasicMaterial({ color: 0xffffff }), // left side
      new T.MeshBasicMaterial({ color: 0xffffff }), // right side
      new T.MeshBasicMaterial({ color: 0xffffff }), // top side
      new T.MeshBasicMaterial({ color: 0xffffff }), // bottom side
      new T.MeshPhongMaterial({ map: loader.load(this.book) }), // front side
      new T.MeshBasicMaterial({ color: 0xffffff }) // back side
    ];

    const geometry = new T.BoxGeometry(3.5, 5, 0.2); // height, width, depth
    this.card = new T.Mesh(geometry, materials);
    this.scene.add(this.card);
  }

  render() {
    let angle = 0;
    let direction = 1; // 1 - rotate right, -1 - rotate left
    const maxAngle = Math.PI / 4; // maximum angle in radians
  
    const animate = () => {
      requestAnimationFrame(animate);
  
      angle += 0.003 * direction;
  
      if (angle >= maxAngle || angle <= -maxAngle) {
        direction *= -1; // change direction if max angle is reached
      }
  
      this.card.rotation.y = angle;
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