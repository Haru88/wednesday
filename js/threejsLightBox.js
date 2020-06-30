import { DIV, toggleFullscreen } from "./domUtils.js"

export class ThreejsLightbox {

    /**
     * @description arranges HTMLElements for a modal Dialogbox called lightbox
     * @constructor
     */
    constructor() {
        this._container = new DIV().class("fslightbox-container fslightbox-full-dimension fslightbox-fade-in-strong")
            .app(new DIV().class("fslightbox-nav")
                .app(new DIV().class("fslightbox-toolbar")
                    .app(new DIV().class("fslightbox-toolbar-button fslightbox-flex-centered icon")
                        .html("&#10063")
                        .click(() => toggleFullscreen())
                    )
                    .app(new DIV().class("fslightbox-toolbar-button fslightbox-flex-centered icon")
                        .html("&#10006")
                        .click(() => this.close())
                    )
                )
            ).app(new DIV().class("fslightbox-full-dimension fslightbox-flex-centered")
                .app(new DIV().class("webglcontainer"))
            )
    }

    /**
     * @description opens the lightbox
     */
    open() {
        document.body.append(this._container.dom);
        document.querySelector("html").className = "fslightbox-open";
    }
    
    /**
     * @description closes the lightbox
     */
    close(){
        document.body.removeChild(this._container.dom);
        document.querySelector("html").className = "";
    }
}