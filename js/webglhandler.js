export class WebGLHandler {

    /**
     * @async
     * @param  {String} url
     */
    async createScene(url) {
        this.closeAsset();
        const con = document.querySelector(".webglcontainer");
        con.innerHTML = null;
        this._init(con, { antialias: true, alpha: false });
        await this._loadAsset(con, url);
        return con;
    }

    /**
     * @async
     * @param  {String} url
     */
    async _loadGLTF(url) {
        const gltfLoader = new THREE.GLTFLoader();
        THREE.DRACOLoader.setDecoderPath('js/libs/draco_decoder/');
        gltfLoader.setDRACOLoader(new THREE.DRACOLoader());

        return new Promise(resolve => gltfLoader.load(url, resolve));
    }

    /**
     * @async
     * @param  {HTMLElement} container
     * @param  {String} url
     */
    async _loadAsset(container, url) {
        const model = await this._loadGLTF(url);
        model.scene.traverse(child => {
            if (child.isMesh) child.material.side = THREE.DoubleSide;
        });
        this.scene.add(model.scene);
        container.appendChild(this.renderer.domElement);
        this._resize();
        this.scene.add(new THREE.AmbientLight(0xFFFFFF));

        return Promise.resolve;
    }

    
    /**
     * @description Dispose the scene to clear the GPU memory
     */
    closeAsset() {
        if(this.scene){
            while (this.scene.children.length) {
                if (this.scene.children[0] instanceof THREE.Scene) {
                    const inner = this.scene.children[0].children[0].children;
                    inner.forEach(mesh => {
                        if (mesh.geometry) {
                            mesh.geometry.dispose(); 
                            mesh.geometry = undefined;
                        }
                        if (mesh.material) {
                            mesh.material.dispose(); 
                            mesh.material = undefined;
                        }
                    });
        
                }
                this.scene.remove(this.scene.children[0]);
            }
        }
    }

    /**
     * @param  {HTMLElement} container
     * @param  {Object} options={antialias
     */
    _init(container, options = { antialias: false, alpha: false }) {

        this.renderer = new THREE.WebGLRenderer({
            antialias: options.antialias, alpha: options.alpha
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.gammaOutput = true;
        this.renderer.setClearColor(0x000000, 0);

        this.scene = new THREE.Scene();
        if (!options.alpha) this.scene.background = new THREE.Color(0xffffff);

        this.camera = new THREE.PerspectiveCamera(55, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.copy(new THREE.Vector3(4, 0, 0));

        this._resize = () => {
            const self = this;
            setTimeout(function () {
                self.camera.aspect = container.offsetWidth / container.offsetHeight;
                self.camera.updateProjectionMatrix();
                self.renderer.setSize(container.offsetWidth, container.offsetHeight);
            }, 100);
        }
        window.addEventListener('resize', this._resize, false);

        this._render = () => {
            requestAnimationFrame(this._render);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        }

        this._render();

        return Promise.resolve;
    }
}