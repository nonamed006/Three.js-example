import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";

// 카메라, 씬 생성
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// webGL 렌더
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 마우스 컨트롤 추가
const controls = new OrbitControls(camera, renderer.domElement);

controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.minDistance = 5;
controls.maxDistance = 100;

// 3개의 축을 시각화 해주는 객체 (x - 빨강, y - 녹색, z - 파랑)
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 바닥
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(1000, 1000, 10, 10),
	new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide })
);
floor.rotateX(- Math.PI / 2);
floor.position.set(0, -15, 0);

scene.add(floor);

// 하늘
const sky = new THREE.Mesh(
	new THREE.SphereGeometry(500, 60, 40),
	new THREE.MeshBasicMaterial({ color: 0xE0FFFF })
);
scene.add(sky);

// 라벨 테스트시킬 오브젝트
const labeltest = new THREE.Mesh(
	new THREE.PlaneGeometry(0.1, 10),
	new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
);
labeltest.position.set(1, -5, 1);
scene.add(labeltest);

// 스프라이트 생성
var spritey = makeTextSprite( " Hello, ", 
		{ fontsize: 24, borderColor: {r:255, g:0, b:0, a:1.0}, backgroundColor: {r:255, g:100, b:100, a:0.8} } );
	spritey.position.set(0, 0, 0);
	scene.add( spritey );

// 스프라이트 생성하는 함수
function makeTextSprite(message, parameters) {
	if (parameters === undefined) parameters = {};

	var fontface = parameters.hasOwnProperty("fontface") ?
		parameters["fontface"] : "Arial";

	var fontsize = parameters.hasOwnProperty("fontsize") ?
		parameters["fontsize"] : 18;

	var borderThickness = parameters.hasOwnProperty("borderThickness") ?
		parameters["borderThickness"] : 4;

	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };

	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r: 255, g: 255, b: 255, a: 1.0 };

	//var spriteAlignment = THREE.SpriteAlignment.topLeft;

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;

	// get size data (height depends only on font size)
	var metrics = context.measureText(message);
	var textWidth = metrics.width;

	// background color
	context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
		+ backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
		+ borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.

	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText(message, borderThickness, fontsize + borderThickness);

	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas)
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial(
		{ map: texture, useScreenCoordinates: false });
	var sprite = new THREE.Sprite(spriteMaterial);
	sprite.scale.set(100, 50, 1.0);
	return sprite;
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}


function animate() {
	requestAnimationFrame(animate);

	// 큐브를 x, y 0.1 방향만큼씩 회전시킨다.
	//cube.rotation.x += 0.1;
	//cube.rotation.y += 0.1;

	renderer.render(scene, camera);
	controls.update();
}

animate();