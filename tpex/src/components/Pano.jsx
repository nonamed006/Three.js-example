import React from 'react';
import * as PANOLENS from "panolens.js";

const Pano = () => {

	console.log(PANOLENS);
	const panorama = new PANOLENS.ImagePanorama("/assets/testIMG.jpg");
	console.log(panorama);
	const viewer = new PANOLENS.Viewer({
		container: document.querySelector("#coucou")
	});
	console.log(viewer);
	viewer.add(panorama);

	return (
		<>
			<p>Coucou</p>
			<div id="coucou" htmlstyle="height:100%">
				{ }
			</div>
		</>
	);
};

export default Pano;