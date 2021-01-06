import * as THREE from "three";
import data from "../data/data.json"

const canvas = document.querySelector('#canvas');
const accelPanel = document.querySelector('#accelPanel');
const renderer = new THREE.WebGLRenderer({ canvas });

const fov = 90;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 2000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 50, 1.5);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
}
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: "green", wireframe: false });
const object = new THREE.Mesh(boxGeometry, boxMaterial);

var cubeAxis = new THREE.AxesHelper(3);
object.add(cubeAxis);

object.scale.set(5, 5, 5)
scene.add(object);

let currentIndex = 0
let time = data[currentIndex].time
let velocity = new THREE.Vector3()
requestAnimationFrame(render);

function render(dt) {
    dt *= 0.001 // in seconds
    time += dt
    document.querySelector("#time").textContent = time.toFixed(2)

    // Find datapoint matching current time
    while (data[currentIndex].time < time) {
        currentIndex++
        if (currentIndex >= data.length) return
    }
    const { rotX, rotY, rotZ, accX, accY, accZ } = data[currentIndex]
    const acceleration = new THREE.Vector3(accX, accY, accZ)
    object.rotation.set(rotX, rotY, rotZ)
    object.position.add(velocity.clone().multiplyScalar(dt)).add(acceleration.clone().multiplyScalar(0.5 * dt ** 2))
    velocity.add(acceleration.clone().multiplyScalar(dt))

    resizeToClient();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function resizeToClient() {
    const needResize = resizeRendererToDisplaySize()
    if (needResize) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
}

function resizeRendererToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}
