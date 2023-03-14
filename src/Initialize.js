import * as THREE from "three";
import { InteractionManager } from "three.interactive";
import { gsap } from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Initialize {

  constructor() {

    /*  const myDiv = document.createElement('div');
     myDiv.textContent = '3D Box';
     myDiv.className = 'text';
     document.body.appendChild(myDiv) */

    const scene = new THREE.Scene();

    const fov = 40;
    const aspect = 2;
    const near = 1;
    const far = 1000;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 1, 4)
    scene.add(camera)

    const al = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(al);

    /*   const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        10
      )
    camera.position.z = 1;
    scene.add(camera)
     */

    const geometryFloor = new THREE.PlaneGeometry(5, 5);
    const materialFloor = new THREE.MeshPhongMaterial({
      color: 0x284e75,
      side: THREE.DoubleSide
    });



    const floor = new THREE.Mesh(geometryFloor, materialFloor);
    floor.receiveShadow = true;
    floor.rotation.x = Math.PI / 2;
    /* scene.add(floor); */


    const size = 20;
    const divisions = 20;
    const gridHelper = new THREE.GridHelper(size, divisions);
    /*     scene.add(gridHelper); */


    const texture = new THREE.TextureLoader().load('assets/crate.gif');

    //Oprettelse af kassen

    /*  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
     const material = new THREE.MeshPhongMaterial({ map: texture });
 
     const mesh = new THREE.Mesh(geometry, material);
     mesh.castShadow = true;
     mesh.receiveShadow = true;
 
     scene.add(mesh); */

    //mesh.rotation.x = 10;
    //mesh.rotation.y = 10;
    /*  mesh.position.y = 0.5; */

    const loader = new GLTFLoader();
    loader.load('assets/models/scene.gltf', (gltf) => {

      let model = gltf.scene;
      model.position.set(0, .5, 0);
      model.scale.set(0.03, 0.03, 0.03);

      model.traverse((n) => {

        if (n.isMesh) {
          n.castShadow = true;
          n.receiveShadow = true;
        }
      })
      scene.add(model);
    })

    //**Start Light 3D model  */

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcccccc, 2);
    scene.add(hemiLight)

    const spotLightB = new THREE.SpotLight(0xffffff, 10);
    spotLightB.position.set(1, 3, 1);
    scene.add(spotLightB);

    const dlHelper = new THREE.SpotLightHelper(spotLightB,);
    scene.add(dlHelper);

    //**End Light 3D model  */


    //* start Light/*

    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 2, 0);
    spotLight.angle = 0.8//spreading spotLight.penumbra = 1; //blur in my world
    spotLight.decay = 2;
    spotLight.distance = 100;
    spotLight.castShadow = true;
    scene.add(spotLight);

    scene.add(spotLight);

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 5;


    //*END Light/*

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })

    renderer.shadowMap.enabled = true;

    const interactionManager = new InteractionManager(
      renderer,
      camera,
      renderer.domElement
    );

    /*     interactionManager.add(mesh);
        mesh.addEventListener('click', (event) => {
          console.log(event);
    
          gsap.to(event.target.scale, {
    
            duration: 1,
            y: 0.15,
            x: 0.15,
            z: 0.15,
            repeat: 1,
            yoyo: true,
            ease: "bounce.out"
          })
    
        }) */

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);
    document.body.appendChild(renderer.domElement);

    let controls = new OrbitControls(camera, renderer.domElement)

    renderer.setAnimationLoop((time) => this.animation(

      time,
      /*  { camera, scene, mesh, renderer } */
      { camera, scene, renderer }

    ))

    window.addEventListener('resize', () => this.onWindowResized(renderer, camera));

  } // END constructor

  animation(time, obj) {
    //obj.mesh.rotation.x = time / 1000;
    //obj.mesh.rotation.y = time / 2000;
    obj.renderer.render(obj.scene, obj.camera)
  }

  onWindowResized(renderer, camera) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

  }


} // END class
