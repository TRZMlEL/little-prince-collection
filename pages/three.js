import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import fragment from '../assets/shaders/fragment.glsl';
import fragmentFBO from '../assets/shaders/fbo.glsl';
import vertex from '../assets/shaders/vertex.glsl';
import particle from '../assets/textures/particle.png?url';

const device = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: window.devicePixelRatio
};

export default class Three {
  constructor(canvas) {
    this.canvas = canvas;

    this.scene = new T.Scene();

    this.camera = new T.PerspectiveCamera(
      75,
      device.width / device.height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 2);
    this.scene.add(this.camera);

    this.renderer = new T.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));

    this.controls = new OrbitControls(this.camera, this.canvas);

    this.clock = new T.Clock();

    this.raycaster = new T.Raycaster();
    this.pointer = new T.Vector2();
    this.pointerPosition = new T.Vector3();

    this.whiteTarget = new T.WebGLRenderTarget(device.width, device.height);
    this.whiteScene = new T.Scene();
    this.whiteBg = new T.Mesh(
        new T.PlaneGeometry(100, 100),
        new T.MeshBasicMaterial({ color: 0xffffff})
    );
    this.whiteScene.add(this.whiteBg);
    this.whiteBg.position.z = -1;

    // this.box = new T.Mesh(
    //     new T.BoxGeometry(0.3, 0.3, 1),
    //     new T.MeshBasicMaterial({ color: 0x00ff00 })
    // );
    // this.whiteScene.add(this.box);

    this.setupPipeline();
    this.mouseEvents();
    this.setLights();
    this.setGeometry();
    this.render();
    this.setResize();
  }

  mouseEvents(){
    this.raycasterPlane = new T.Mesh(
        new T.PlaneGeometry(100, 100), 
        new T.MeshBasicMaterial({color: 0x000000, side: T.DoubleSide}));
    
    this.dummy = new T.Mesh(
        // new T.PlaneGeometry(0.6, 0.6, 20, 20),
        new T.SphereGeometry(0.05, 20, 20),
        new T.MeshBasicMaterial({
            color: 0xffffff, 
            // map: new T.TextureLoader().load(particle),
            transparent: true,
            opacity: 1.
        })
    );
    this.scene.add(this.dummy);

    window.addEventListener('mousemove', (e) => {
        this.pointer.x = (e.clientX / device.width) * 2 - 1;
        this.pointer.y = -(e.clientY / device.height) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects([this.raycasterPlane]);
        if (intersects.length > 0) {
            this.dummy.position.copy(intersects[0].point);
        }
    });
  }

    setupPipeline() {
        this.sourceTarget = new T.WebGLRenderTarget(device.width, device.height);

        this.targetA = new T.WebGLRenderTarget(device.width, device.height);
        this.targetB = new T.WebGLRenderTarget(device.width, device.height);

        this.renderer.setRenderTarget(this.whiteTarget);
        this.renderer.render(this.whiteScene, this.camera);

        this.fboScene = new T.Scene();
        this.fboCamera = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.fboMaterial = new T.ShaderMaterial({
            fragmentShader: fragmentFBO,
            vertexShader: vertex,
            uniforms: {
                time: { value: 0 },
                tDiffuse: { value: null },
                tPrev: { value: this.whiteTarget.texture },
                resolution: { value: new T.Vector4(device.width, device.height, 1, 1) }
            }
        });

        this.fboQuad = new T.Mesh(new T.PlaneGeometry(2, 2), this.fboMaterial);
        this.fboScene.add(this.fboQuad);

        this.finalScene = new T.Scene();
        this.finalQuad = new T.Mesh(new T.PlaneGeometry(2, 2), new T.MeshBasicMaterial({ map: this.targetA.texture, transparent: true, opacity: 0.5 }));
        this.finalScene.add(this.finalQuad);
    }

  setLights() {
    this.ambientLight = new T.AmbientLight(new T.Color(1, 1, 1, 1));
    this.scene.add(this.ambientLight);
  }

  setGeometry() {
    this.planeGeometry = new T.PlaneGeometry(1, 1, 128, 128);
    this.planeMaterial = new T.ShaderMaterial({
      side: T.DoubleSide,
      wireframe: true,
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        progress: { type: 'f', value: 0 }
      }
    });

    this.planeMesh = new T.Mesh(this.planeGeometry, this.planeMaterial);
    // this.scene.add(this.planeMesh);
  }

  render() {
    const elapsedTime = this.clock.getElapsedTime();

    this.planeMesh.rotation.x = 0.2 * elapsedTime;
    this.planeMesh.rotation.y = 0.1 * elapsedTime;


    // Rendering the source
    this.renderer.setRenderTarget(this.sourceTarget);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));

    // running the ping pong
    this.renderer.setRenderTarget(this.targetA);
    this.renderer.render(this.fboScene, this.fboCamera);

    this.fboMaterial.uniforms.tDiffuse.value = this.sourceTarget.texture;
    this.fboMaterial.uniforms.tPrev.value = this.targetA.texture;
    this.fboMaterial.uniforms.time.value = elapsedTime;

    //final output
    this.finalQuad.material.map = this.targetA.texture;
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.finalScene, this.fboCamera);

    //swap
    let temp = this.targetA;
    this.targetA = this.targetB;
    this.targetB = temp;



  }

  setResize() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    device.width = window.innerWidth;
    device.height = window.innerHeight;

    this.camera.aspect = device.width / device.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));
  }
}