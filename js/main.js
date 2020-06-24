import { WebGLHandler } from "./webglhandler.js";

(async () => {
	const _ = document.querySelector(".thumbnail");
	_.style.backgroundSize = window.innerWidth;
	window.addEventListener("scroll", () => _.style.backgroundSize = `${window.innerWidth + (window.scrollY / 2)}px`);

	const gl = new WebGLHandler();

	document.querySelector(".showBtn").addEventListener("click",async () => {

		document.querySelector(".webglcontainer").innerHTML = "";
		await gl.createScene();
	});
})();