import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";

// 카메라, 씬 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1900);

const scene = new THREE.Scene();

// 오브젝트 생성 -> 이거 사실 구체인데 크기 늘려서 구체 안에 카메라가 있어서 360도 배경처럼 보이는거 -> 배경은 텍스처로 입혔음
const geometry = new THREE.SphereGeometry(500, 60, 40);
// invert the geometry on the x-axis so that all of the faces point inward
geometry.scale(-1, 1, 1);

// 생성한 오브젝트에 텍스쳐 입히기(사진이나 질감 등)
const texture = new THREE.TextureLoader().load('GS__0963.JPG');
const material = new THREE.MeshBasicMaterial({ map: texture });

// 씬에 추가할거 생성
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// webGL 렌더

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 카메라 이동 -> 포지션 0이면 바닥 보고있길래 카메라 위로 들어주니까 정면 보고있음
camera.position.z = 5;


const controls = new OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 1.0; // 마우스로 카메라를 회전시킬 속도입니다. 기본값(Float)은 1입니다.
controls.zoomSpeed = 3; // 마우스 휠로 카메라를 줌 시키는 속도 입니다. 기본값(Float)은 1입니다.
controls.panSpeed = 0.8; // 패닝 속도 입니다. 기본값(Float)은 1입니다.
controls.minDistance = 15; // 마우스 휠로 카메라 거리 조작시 최소 값. 기본값(Float)은 0 입니다.
controls.maxDistance = 150; // 마우스 휠로 카메라 거리 조작시 최대 값. 기본값(Float)은 무제한 입니다.

// html에서 버튼으로 움직임 제어하기 위한 함수
window.onload = function(){
    let start = document.getElementById('start');
    start.addEventListener('click', function(){
        mesh.rotation.y += 1;
    });
    let back = document.getElementById('back');
    back.addEventListener('click', function(){
        mesh.rotation.y -= 1;
    });
};


function animate() {
    // requestAnimationFrame : 사용자가 다른 브라우저로 이동할때 일시중지 되게 해주어 성능 유지
    requestAnimationFrame(animate);

    //mesh.rotation.x += 0.1;
    //mesh.rotation.y += 0.002;

    renderer.render(scene, camera);
    controls.update();
}


animate();