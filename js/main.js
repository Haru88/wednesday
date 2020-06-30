import { WebGLHandler } from "./webglhandler.js";
import { ThreejsLightbox } from "./threejsLightBox.js"
import { DIV, A, IMG, H3, H4, P, $ } from "./domUtils.js"

(async () => {

	const currentID = "75";

	let pageData = await (await fetch("pageData.json")).json();

	const url = "php/findFiles.php?key=values.json&start=../../assets/";
	const assetData = await (await fetch(url)).json();

	assetData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
	assetData.forEach(element => {
		element.url = element.url.replace(/\.\.\//, "");
	});

	const assetFoundById = assetData.find(el => el.id == currentID);

	await mapDataOnPage(pageData, assetFoundById);
	refreshFsLightbox();

	const parallax = document.querySelector(".thumbnail");

	window.addEventListener("scroll", () => {
		const offset = window.pageYOffset;
		parallax.style.backgroundPositionY = `${offset * 0.7}px`
	});

	const threelightbox = new ThreejsLightbox();
	const gl = new WebGLHandler();

	$(".showBtn").addEventListener("click", async () => {
		threelightbox.open();
		await gl.createScene(assetFoundById.url + "mesh.glb");
	});



	/**
	 * @async
	 * @description Creates and embeds HTMLElements with the fetched data.
	 * @param  {array[string | number]} pageData
	 * @param  {array[string | number]} assetData
	 */
	async function mapDataOnPage(pageData, assetData) {

		new DIV($(".header-title")).text("Das Mittwochs-Modell: " + assetData.name + " von " + assetData.head);

		await fetch(assetData.url + "text.txt").then(t => t.text().then(text => {

			const split = text.split("\n")

			const left = new DIV($(".left"));
			left.app(new H3().text(split[0]));

			split.shift();
			split.forEach(p => left.app(new P().text(p)));
		}));

		new IMG($(".right img")).attr("src", assetData.url + "thumbnail.JPG")

		new DIV($(".right > .text"))
			.app(new H4().text(pageData.DE.title))
			.app(new P().text(pageData.DE.introduction))

		new DIV($(".right .table"))
			.app(new DIV().class("row")
				.app(new DIV().text("name: "))
				.app(new DIV().text(assetData.name))
			).app(new DIV().class("row")
				.app(new DIV().text("Baujahr: "))
				.app(new DIV().text(assetData.head))
			)

		new DIV($(".blurredbg")).attr("style","background-image:" + `url(\"${assetData.url}thumbnail.JPG\")`);

		const itemData = await (await fetch("php/findFiles.php?key=items&start=../" + assetData.url)).json();
		itemData.forEach(item => {
			item = item.replace(/\.\.\//, "");
			$(".image-gallery").append(
				new A().attr("data-fslightbox", "g").attr("href", item).class("gallery-element")
					.app(new IMG().attr("src", item)).dom);
		})

	}
})();