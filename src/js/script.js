import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls' // used to control camera movement with mouse
import * as dat from 'dat.gui' // importing everything from guiclass

import nebula from '../img/nebula.jpg' // imports nebula from img folder -> the name is stored in nebula constant -> the one in node module has unpredictable name
import stars from '../img/stars.jpg'  // imports stars from img folder -> the name is stored in stars constant  -> ditto

const renderer = new THREE.WebGLRenderer(); // tool that 3js uses to allocate space on a webpage to add and animate stuff later

renderer.shadowMap.enabled = true; // enables showing shadows -> then we can choose if an object casts or receives shadows
renderer.setSize(window.innerWidth,window.innerHeight); // sets size of renderer

document.body.appendChild(renderer.domElement); // adds the element into the page.

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera (
    45, // This is FOV
    window.innerWidth/window.innerHeight, // THis is aspect ratio
    0.1, // near point
    1000 // far point
);

const orbit = new OrbitControls(camera, renderer.domElement); // used to create camera orbit // left button rotate , middle mosue zoom in out, ctrl+click translation

const axesHelper = new THREE.AxesHelper(5); // brings the coordinate system into picture | 5-> length of the axes
//axesHelper.geometry = new THREE.Geometry().fromBufferGeometry( axesHelper.geometry );
scene.add(axesHelper); // axesHelper added to the scene

camera.position.set(-10,30,30 ); // sets camera position (x,y,z)
orbit.update() // updates position every time we change position -> check docs

const boxGeometry = new THREE.BoxGeometry(); // skeleton
const boxMaterial = new THREE.MeshStandardMaterial({color: 0x00FF00});// skin of the shape - resources dependent -> with basic material we can see object without light source
// other material types MeshLambertMaterial, MeshStandardMaterial -> will appear black without a light source, other types in the documentation of 3js
const box = new THREE.Mesh(boxGeometry,boxMaterial); // combining the skeleton and the skin
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30,30); // skeleton of plane with width and height arguments
const planeMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF, side: THREE.DoubleSide}); // material | side -> double side makes sure that the plane doesn't disappear when viewed from other side
const plane = new THREE.Mesh(planeGeometry,planeMaterial); //  combination
plane.receiveShadow = true; // plane receives shadow 
scene.add(plane);
plane.rotation.x = -0.5*Math.PI; // -> rotates plane by 90deg to make it horizontal the screen



const gridHelper = new THREE.GridHelper(30); // adds a grid to the base  -> arguments changes surface area, second argument will divide grid into smaller squares if necessary
scene.add(gridHelper); 

const sphereGeometry = new THREE.SphereGeometry(4,50,50); // arguments of radius , width and height can be given the width and height reduction will lead to lesser spherical property
const sphereMaterial = new THREE.MeshStandardMaterial({color: 0x0000FF, wireframe: false});
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
sphere.castShadow = true; // sphere casts shadow
scene.add(sphere);
sphere.position.set(-10,0,0);

/* The following lines of code are for ambient lighting
const ambientLight = new THREE.AmbientLight(0x333333); // kinda like a room light
scene.add(ambientLight); */
 

/* The following lines of code are for directional Light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF,0.8); // color and intensity arguments, its like a sun light
directionalLight.castShadow = true; // main sources of shadow
scene.add(directionalLight);
directionalLight.position.set(-30,50,0);
directionalLight.shadow.camera.bottom = -12;

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight,5); // second argument is the size of the square
scene.add(dLightHelper);

const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper); // shows using 4 lines where the shadow cast from dlight is rendered. */

/* THe following lines add spotLight */
const spotLight = new THREE.SpotLight(0xFFFFFF); 
scene.add(spotLight);
spotLight.position.set(-100,100,0);

const sLightHelper = new THREE.SpotLightHelper(spotLight); // gives lines which show where the light is cast from and to.
scene.add(sLightHelper);
spotLight.castShadow = true; // shadow is pixelated if the angle is too much
//spotLight.angle = 0.2; // this makes the shadow more smooth

//FOG CREATION METHOD 1
//scene.fog = new THREE.Fog(0xFFFFFF,0,200); // near limit and far limit of fog are the other 2 arguments // this depends on the viewport camera

//FOG CREATION METHOD 2
scene.fog = new THREE.FogExp2(0xFFFFFF,0.01); // fog grows exponentially with distance from camera, the second argument is the density

// changing black background
//renderer.setClearColor(0xFFEA00);

const textureLoader = new THREE.TextureLoader(); // creates instance of texture loader class
scene.background = textureLoader.load(stars); // instance loaded to background using path as argument -> creates texture that we can set as background
// the above causes background to look 2d but there are 6 surface which each can be loaded with the background to make it look 3d to do this we use cubeTextureLoader
const cubeTextureLoader = new THREE.CubeTextureLoader();
//cubeTextureLoader.setPath('img/');
/* NOT WORKING SO FAR
scene.background = cubeTextureLoader.load([
    nebula,
    nebula,
    stars,
    stars,
    stars,
    stars
]); // each image is loaded onto one side of the cube to be able to create the background to look 3d*/

// new cube creation to test out texture adding to it
const box2Geometry = new THREE.BoxGeometry(4,4,4);
const box2Material = new THREE.MeshBasicMaterial({
    //color: 0x00FF00,
    //map: textureLoader.load(nebula) // using the textureloader we created to load in the texture to the box created we can even update map later by updating the map property separately
});
const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
]; // this is an array of material to be added to each side of the cube
const box2 = new THREE.Mesh(box2Geometry,box2MultiMaterial); // box2multimaterial arg adds the texture in to each side
scene.add(box2);
box2.position.set(0,15,10);

const plane2Geometry = new THREE.PlaneGeometry(10,10,10,10);
const plane2Material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true
});
const plane2 = new THREE.Mesh(plane2Geometry,plane2Material);
scene.add(plane2);
plane2.position.set(10,10,15);

// changing position of vertices , each 3 sets of points represent x,y,z, of a vertex in a plane
plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length-1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10*Math.random();

const sphere2Geometry = new THREE.SphereGeometry(4);

const vShader = `
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
`;
const fShader = `
    void main(){
        gl_FragColor = vec4(0.5,0.5,1.0,1.0);
    }
`;  
const sphere2Material = new THREE.ShaderMaterial({
    vertexShader: vShader,
    fragmentShader: fShader
});
const sphere2MaterialBackup = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
const sphere2 = new THREE.Mesh(sphere2Geometry,sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5,10,10);

// dat.gui is used to get perfect colour and position instead of using trial and error
const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2, // alters angle of cone of the source
    penumbra: 0, // alters the edge shadowy feel
    intensity: 1 // updates intensity
}; // object to hold the interface elements

gui.addColor(options,'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
}); // first and second argument used to determine what it controls

gui.add(options,'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
}); // e -> T/F | T-> wireframe on else false  this is a check box that controls it.

// adding stuff to options based on requirements
gui.add(options,'speed',0,0.1);
gui.add(options,'angle',0,1);
gui.add(options,'penumbra',0,1);
gui.add(options,'intensity',0,1);
// animate the cube by rotating it 

// making the ball bounce parameters;
let step = 0

const mousePosition = new THREE.Vector2(); // objects that stores mouse position as a vector

window.addEventListener('mousemove',function(e){
    mousePosition.x = (e.clientX/window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY/window.innerHeight) * 2 + 1;
}); // listener that updates mouseposition vector with the position fo the cursor

const rayCaster = new THREE.Raycaster(); // creation of raycaster object
const sphereId = sphere.id;
box2.name = 'box2';

function animate(time){
    box.rotation.x = time/1000; // time argument used to vary speed withrespect to time if += given then the cube rotates at a higher speed w.r.t time
    box.rotation.y = time/1000;

    step+=options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step))+4;

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update(); // we have to update helper everytime we update the lights properties

    rayCaster.setFromCamera(mousePosition,camera); // sets raycaster from camera to mouseposition
    const intersects = rayCaster.intersectObjects(scene.children); // returns all objects of scene that intersects with ray
    console.log(intersects); // output in log

    // the following code loops through the intersected objects and if sphere is present it change the color of the sphere
    // similarly if it hovers box 2 box2 rotates
    for (let i = 0;i<intersects.length;i++){
        if (intersects[i].object.id === sphere.id)
            intersects[i].object.material.color.set(0xFF0000);
        if (intersects[i].object.name === box2.name){
            box2.rotation.x = time/1000;
            box2.rotation.y = time/1000;
        }
        //else
          //  sphere.material.color.set(sphereColor);
    }

    plane2.geometry.attributes.position.array[0] = 10 * Math.random();
    plane2.geometry.attributes.position.array[1] = 10 * Math.random();
    plane2.geometry.attributes.position.array[2] = 10 * Math.random();
    const lastPointZ = plane2.geometry.attributes.position.array.length-1;
    plane2.geometry.attributes.position.array[lastPointZ] = 10*Math.random();
    plane2.geometry.attributes.position.needsUpdate = true; // need to add this line when we do our own logic

    renderer.render(scene,camera);
}

//renderer.render(scene,camera); // renders our stuff
renderer.setAnimationLoop(animate); // animates using the function given as the argument

// now we have to resize window each time we resize it or open inspector
window.addEventListener('resize',function(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});