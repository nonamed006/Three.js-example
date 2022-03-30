import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";



// 카메라, 씬 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1900);

const scene = new THREE.Scene();

// webGL 렌더
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 카메라 컨트롤 - orbitControll
const controls = new OrbitControls(camera, renderer.domElement);
controls.rotateSpeed = 1.0; // 마우스로 카메라를 회전시킬 속도입니다. 기본값(Float)은 1입니다.
controls.zoomSpeed = 3; // 마우스 휠로 카메라를 줌 시키는 속도 입니다. 기본값(Float)은 1입니다.
controls.panSpeed = 0.8; // 패닝 속도 입니다. 기본값(Float)은 1입니다.
controls.minDistance = 5; // 마우스 휠로 카메라 거리 조작시 최소 값. 기본값(Float)은 0 입니다.
controls.maxDistance = 20; // 마우스 휠로 카메라 거리 조작시 최대 값. 기본값(Float)은 무제한 입니다.


// 처음 웹에 접근시 어디를 바라보고 있을지 정해줌
// 카메라의 위치 조정
camera.position.set(5, 5, 7);
camera.lookAt(0, 0, 0);

// 오브젝트 생성 -> 이거 사실 구체인데 크기 늘려서 구체 안에 카메라가 있어서 360도 배경처럼 보이는거 -> 배경은 텍스처로 입혔음
const geometry = new THREE.SphereGeometry(500, 60, 40);
// invert the geometry on the x-axis so that all of the faces point inward
geometry.scale(-1, 1, 1);

// 생성한 오브젝트에 텍스쳐 입히기(사진이나 질감 등)
//const texture = new THREE.TextureLoader().load('sky01.jpg');
const material = new THREE.MeshBasicMaterial();

// 바닥 추가
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(1000, 1000, 100, 10),
	new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide })
);

// 라벨을 고정시킬 테스트 오브젝트 생성 =================================================
const labeltest = new THREE.Mesh(
	new THREE.PlaneGeometry(0.1, 10),
	new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
);
const labeltest2 = new THREE.Mesh(
	new THREE.PlaneGeometry(0.1, 10),
	new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
);

// 라벨테스트 오브젝트 좌표 설정
labeltest.position.set(-10, -10, -30);
labeltest2.position.set(0, -10, 0);
//labeltest.position.set(0, 0, 0);

// rotateX, Y 속성은 css transher 기술
floor.rotateX(- Math.PI / 2);
// 만들어준 바닥을 사람들이 카메라 등으로 통과(?)하지 못하게 위치를 아래로 내린것 
floor.position.set(0, -20, 0);

// 색상 추가 
material.color = new THREE.Color('#D4F4FA');
// 씬에 추가할거 생성
const mesh = new THREE.Mesh(geometry, material);

// 3개의 축을 시각화 해주는 객체 (x - 빨강, y - 녹색, z - 파랑)
const axesHelper = new THREE.AxesHelper(5);


// 화면에 렌더링할 오브젝트 추가
scene.add(axesHelper);
scene.add(mesh);
scene.add(floor);
scene.add(labeltest);
scene.add(labeltest2);

// canvas 2dContext 생성

const canvas = document.getElementById("myCanvas");

const ctx = canvas.getContext("2d");
const x = 1;
const y = 1;
const radius = 30;
const startAngle = 0;
const endAngle = Math.PI * 2;
ctx.fillStyle = "rgb(0, 0, 0)";
ctx.beginPath();
ctx.arc(x, y, radius, startAngle, endAngle);
ctx.fill();
ctx.strokeStyle = "rgb(255, 255, 255)";
ctx.lineWidth = 3;
ctx.beginPath();
ctx.arc(x, y, radius, startAngle, endAngle);
ctx.stroke();
ctx.fillStyle = "rgb(255, 255, 255)";
ctx.font = "32px sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("1", x, y);


// 라벨 테스트 ==========================================================================

// 주석을 배열에 저장
const annotations = [];
annotations.push({ text: 'annotation1', x: 100, y: 100, z: 10 });
annotations.push({ text: 'annotation2', x: -10, y: -10, z: -30 });
annotations.push({ text: 'annotation3', x: 0, y: 0, z: 0 });

// 주석 elements 생성
annotations.forEach((ann, index) => {
	const elAnn = document.createElement("div");
	elAnn.id = 'annotation' + index; // div id
	elAnn.classList.add('annotation'); // 클래스 추가
	elAnn.appendChild(document.createTextNode(ann.text));
	document.body.insertBefore(elAnn, canvas);
});


// 여기에 Number코드 추가
// 레이캐스팅으로 좌표값 추가하기 const raycaster = new THREE.Raycaster();

const numberTexture = new THREE.CanvasTexture(document.querySelector("#myCanvas"));
const spriteMaterial = new THREE.SpriteMaterial({
	map: numberTexture,
	alphaTest: 0.5,
	transparent: true,
	depthTest: false,
	depthWrite: false
});

// 어디서 보든 오브젝트가 정면을 보게 하는 속성
let sprite = new THREE.Sprite(spriteMaterial);
sprite.position.set(100, 100, 100);
sprite.scale.set(60, 60, 1);
scene.add(sprite);

function updateScreenPosition() {
	annotations.forEach((ann, index) => {
		const vector = new THREE.Vector3(ann.x, ann.y, ann.z);
		const canvas = renderer.domElement;
		vector.project(camera);
		vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
		vector.y = Math.round((0.5 + vector.y / 2) * (canvas.height / window.devicePixelRatio));
		const elAnn = document.getElementById("annotation" + index);

		elAnn.style.top = `${vector.y}px`;
		elAnn.style.left = `${vector.x}px`;
		//elAnn.style.opacity = spriteBehindObject ? 0.25 : 1;
	});
}

// 렌더링 위해서 render함수 animate와 분리 가능
function render() {
	renderer.render(scene, camera);
	// 현재 바라보고 있는 시점 좌표 표시
	document.getElementById('monitor').innerText =
		camera.position.x.toFixed(1) + ", " +
		camera.position.y.toFixed(1) + ", " +
		camera.position.z.toFixed(1);

	updateScreenPosition();
}

function animate() {
	// requestAnimationFrame : 사용자가 다른 브라우저로 이동할때 일시중지 되게 해주어 성능 유지
	requestAnimationFrame(animate);

	//mesh.rotation.x += 0.1;
	//mesh.rotation.y += 0.002;
	controls.update();
	render();
}


animate();