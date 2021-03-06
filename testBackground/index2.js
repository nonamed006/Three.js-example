import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
//import * as Tween from "./js/tweenjs.js";

"use strict";
document.write("<script src='\"js/tweenjs.js\"'></script>");

const canvas = document.getElementById("myCanvas");
// Store the annotations in an array
// x, y and z are the geometry coordinates that the annotation should be pinned to
// Zero is in the middle. The corners are at -250 and 250
const annotations = [];
annotations.push({ text: 'annotation1', x: 0, y: -5, z: 0 });
annotations.push({ text: 'annotation2', x: 1, y: -5, z: 150 });
// Create the annotation elements
annotations.forEach((ann, index) => {
    const elAnn = document.createElement("div");
    elAnn.id = 'annotation' + index;
    elAnn.classList.add('annotation');
    elAnn.appendChild(document.createTextNode(ann.text));
    document.body.insertBefore(elAnn, canvas);
});
// three.js
let camera;
let controls;
let scene;
let renderer;
let sprite;
let mesh;
let spriteBehindObject;
const annotation = document.querySelector(".annotation");
// 3개의 축을 시각화 해주는 객체 (x - 빨강, y - 녹색, z - 파랑)
const axesHelper = new THREE.AxesHelper(5);
init();
animate();

// Tween.js 이동 함수
function moveCam(eye_x, eye_y, eye_z, target_x, target_y, target_z)
{
	createjs.Tween.removeAllTweens();
	createjs.Tween.get(camera.position)
		.to({
			x: eye_x, 
			y: eye_y, 
			z: eye_z
		}, 900, 
		createjs.Ease.sineInOut);

	createjs.Tween.get(controls.target)
		.to({
			x: target_x, 
			y: target_y, 
			z: target_z
		}, 900, 
		createjs.Ease.sineInOut);
}

// ================ 클릭 이벤트
const anno1 = document.getElementById('annotation0');
anno1.addEventListener('click', (e)=>{
    alert("click");
})

const anno2 = document.getElementById('annotation1');
anno2.addEventListener('click', (e)=>{
    moveCam(5,5,7, 1, -5, 150);
})
function init() {
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 2, 2000);
    // camera.position.x = 750;
    // camera.position.y = 500;
    // camera.position.z = 1250;
    camera.position.set(5, 5, 7);
    // Scene
    scene = new THREE.Scene();
    scene.add(axesHelper);

    // 하늘 
    const skyGeometry = new THREE.SphereGeometry(500, 60, 40);
    const skyMaterial = new THREE.MeshBasicMaterial();
    skyMaterial.color = new THREE.Color('#D4F4FA');
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    skyGeometry.scale(-1, 1, 1);
    scene.add(sky);

    // 바닥
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide })
    );
    floor.rotateX(- Math.PI / 2);
    floor.position.set(0, -10, 0);

    scene.add(floor);

    // 라벨 테스트시킬 오브젝트
    const labeltest = new THREE.Mesh(
        new THREE.CylinderGeometry( 0.1, 0.1, 10, 15 ),
        new THREE.MeshBasicMaterial({ color: 0xffffff})
    );
    labeltest.position.set(0, -8, 0);
    scene.add(labeltest);

    // 라벨 테스트시킬 오브젝트
    const labeltest2 = new THREE.Mesh(
        new THREE.CylinderGeometry( 0.1, 0.1, 10, 15 ),
        new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    labeltest2.position.set(1, -8, 150);
    scene.add(labeltest2);

    // Sprite
    const numberTexture = new THREE.CanvasTexture(document.querySelector("#myCanvas"));
    const spriteMaterial = new THREE.SpriteMaterial({
        map: numberTexture,
        alphaTest: 0.5,
        transparent: true,
        depthTest: false,
        depthWrite: false
    });
    sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(250, 250, 250);
    sprite.scale.set(60, 60, 1);
    scene.add(sprite);
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x333333, 1);
    document.body.appendChild(renderer.domElement);
    // 카메라 컨트롤 - orbitControll
    controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0; // 마우스로 카메라를 회전시킬 속도입니다. 기본값(Float)은 1입니다.
    controls.zoomSpeed = 3; // 마우스 휠로 카메라를 줌 시키는 속도 입니다. 기본값(Float)은 1입니다.
    controls.panSpeed = 0.8; // 패닝 속도 입니다. 기본값(Float)은 1입니다.
    controls.minDistance = 5; // 마우스 휠로 카메라 거리 조작시 최소 값. 기본값(Float)은 0 입니다.
    controls.maxDistance = 20; // 마우스 휠로 카메라 거리 조작시 최대 값. 기본값(Float)은 무제한 입니다.
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}
function render() {
    renderer.render(scene, camera);
    // 현재 바라보고 있는 시점 좌표 표시
    document.getElementById('monitor').innerText =
        camera.position.x.toFixed(1) + ", " +
        camera.position.y.toFixed(1) + ", " +
        camera.position.z.toFixed(1);
    //updateAnnotationOpacity();
    updateScreenPosition();
}
function updateAnnotationOpacity() {
    const meshDistance = camera.position.distanceTo(mesh.position);
    const spriteDistance = camera.position.distanceTo(sprite.position);
    spriteBehindObject = spriteDistance > meshDistance;
    sprite.material.opacity = spriteBehindObject ? 0.25 : 1;
    // Do you want a number that changes size according to its position?
    // Comment out the following line and the `::before` pseudo-element.
    sprite.material.opacity = 0;
}
function updateScreenPosition() {
    // TODO: Loop through all annotations
    annotations.forEach((ann, index) => {
        const vector = new THREE.Vector3(ann.x, ann.y, ann.z);
        const canvas = renderer.domElement;
        vector.project(camera);
        vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
        vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));
        // console.log(vector);
        const elAnn = document.getElementById("annotation" + index);
        // console.log(elAnn);
        // elAnn.style.background = 'orange';
        elAnn.style.top = `${vector.y}px`;
        elAnn.style.left = `${vector.x}px`;
        //elAnn.style.opacity = spriteBehindObject ? 0.25 : 1;
    });
}
