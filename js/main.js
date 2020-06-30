import { WebGLHandler } from "./webglhandler.js";
import { ThreejsLightbox } from "./threejsLightBox.js";
import { DIV, A, IMG, H3, H4, P, SMALL, $ } from "./domUtils.js";
import { settings } from "../SETTINGS.js";

(async () => {

	let pageData = await (await fetch(settings().PAGEDATA_URL)).json();

	const assetData = await (await fetch(settings().ASSET_URL)).json();

	assetData.sort((a, b) => parseInt(a.id) - parseInt(b.id));

	const assetFoundById = assetData.find(el => el.id == settings().CURRENT_ID);

	await mapDataOnPage(pageData, assetFoundById);
	refreshFsLightbox();

	const parallax = document.querySelector(".thumbnail");

	window.addEventListener("scroll", () => {
		const offset = window.pageYOffset;
		parallax.style.backgroundPositionY = `${offset * 0.7}px`
	});

	const threelightbox = new ThreejsLightbox();
	const gl = new WebGLHandler();
	let currWebGLInstance = null;

	$(".showBtn").addEventListener("click", async () => {
		threelightbox.open();
		if(!currWebGLInstance){
			currWebGLInstance = await gl.createScene(assetFoundById.url + settings().ASSET_FILE);
		} 
		gl.resetAsset();
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

			const left = new DIV($(".left"));

			left.app(new SMALL().text(settings().DATE).class(".text-date"));

			const split = text.split("\n")

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
				.app(new DIV().text("Name: "))
				.app(new DIV().text(assetData.name))
			).app(new DIV().class("row")
				.app(new DIV().text("Baujahr: "))
				.app(new DIV().text(assetData.head))
			)

		new DIV($(".blurredbg")).attr("style","background-image:" + `url(\"${assetData.url}thumbnail.JPG\")`);

		const itemData = await (await fetch( settings().ITEM_URL + assetData.url)).json();
		itemData.forEach(item => {
			$(".image-gallery").append(
				new A().attr("data-fslightbox", "g").attr("href", item).class("gallery-element")
					.app(new IMG().attr("src", item)).dom);
		})

	}
})();