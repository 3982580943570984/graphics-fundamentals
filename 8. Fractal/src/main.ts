import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class ThreeApp {
  private camera: THREE.OrthographicCamera = new THREE.OrthographicCamera(
    (-1 * window.innerWidth) / window.innerHeight,
    (1 * window.innerWidth) / window.innerHeight,
    1,
    -1,
    -1,
    1
  );
  private scene: THREE.Scene = new THREE.Scene();
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias: false,
    precision: "highp",
  });
  private mesh: THREE.Mesh | undefined;
  private controls: OrbitControls = new OrbitControls(
    this.camera,
    this.renderer.domElement
  );

  constructor() {
    this.setup();
    this.init();
    this.animate();
  }

  private setup(): void {
    const aspect = window.innerWidth / window.innerHeight;

    this.camera = new THREE.OrthographicCamera(
      -1 * aspect,
      1 * aspect,
      1,
      -1,
      -1,
      1
    );
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      precision: "highp",
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const uniforms = {
      res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      aspect: { value: aspect },
    };

    const geometry = new THREE.PlaneGeometry(2 * aspect, 2);
    const material = new THREE.ShaderMaterial({
      fragmentShader: this.fragmentShader(),
      uniforms: uniforms,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    // Setup orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = true;
  }

  private fragmentShader(): string {
    return `
      precision highp float;
      uniform vec2 res;
      uniform float aspect;
      float mandelbrot(vec2 c){
        float alpha = 1.0;
        vec2 z = vec2(0.0 , 0.0);
        for(int i=0; i < 200; i++){
          float x_sq = z.x*z.x;
          float y_sq = z.y*z.y;
          vec2 z_sq = vec2(x_sq - y_sq, 2.0*z.x*z.y);
          z = z_sq + c;
          if(x_sq + y_sq > 4.0){
            alpha = float(i)/200.0;
            break;
          }
        }
        return alpha;
      }
      void main(){
        vec2 uv = 4.0 * vec2(aspect, 1.0) * gl_FragCoord.xy / res -2.0*vec2(aspect, 1.0);
        float s = 1.0 - mandelbrot(uv);
        vec3 coord = vec3(s, s, s);
        gl_FragColor = vec4(pow(coord, vec3(7.0, 8.0, 5.0)), 1.0);
      }
    `;
  }

  private animate(): void {
    this.controls.update(); // Only required if controls.enableDamping = true, or if controls.autoRotate = true
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }

  private init(): void {
    // ... (no changes here)
  }
}

// Instantiate and run the Three.js app
new ThreeApp();
