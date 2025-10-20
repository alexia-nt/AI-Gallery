class ModelManager {
    constructor() {
        this.models = [];
        this.loader = new THREE.GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.modelBoundingBoxes = new Map(); // Store bounding boxes for each model
    }

    loadModel(url, position, scale, rotation, userData, collisionPadding = 1.0) {
        return new Promise((resolve, reject) => {
            this.loader.load(
                url,
                (gltf) => {
                    const model = gltf.scene;
                    
                    // Apply transformations
                    if (position) model.position.copy(position);
                    if (scale) model.scale.set(scale, scale, scale);
                    if (rotation) model.rotation.copy(rotation);
                    
                    // Apply user data
                    if (userData) model.userData = userData;
                    
                    // Add collision data
                    model.userData.collisionPadding = collisionPadding;
                    model.userData.isInteractive = userData?.isInteractive !== false;
                    
                    // Optimize materials for better performance
                    this.optimizeMaterials(model);
                    
                    // Create and store bounding box
                    const boundingBox = this.createBoundingBox(model);
                    this.modelBoundingBoxes.set(model, boundingBox);
                    
                    this.models.push(model);
                    resolve(model);
                },
                undefined,
                (error) => {
                    console.error('Error loading model:', error);
                    reject(error);
                }
            );
        });
    }

    // Method to load multiple models easily
    async loadMultipleModels(modelConfigs) {
        const loadedModels = [];
        
        for (const config of modelConfigs) {
            try {
                const model = await this.loadModel(
                    config.url,
                    config.position,
                    config.scale,
                    config.rotation,
                    config.userData,
                    config.collisionPadding
                );
                loadedModels.push(model);
                console.log(`Loaded model: ${config.userData?.title || config.url}`);
            } catch (error) {
                console.error(`Failed to load model: ${config.url}`, error);
            }
        }
        
        return loadedModels;
    }

    // Easy configuration method for your gallery models
    getGalleryModelConfigs(roomDimensions) {
        return [
            // {
            //     url: 'assets/models/yourModel.glb',
            //     position: new THREE.Vector3(15, -roomDimensions.height / 2 + 11, 30),
            //     scale: 10,
            //     rotation: new THREE.Euler(0, Math.PI / 4, 0),
            //     collisionPadding: 1.2,
            //     userData: {
            //         title: "Ancient Sculpture",
            //         poem: "A mysterious ancient sculpture stands here,\ncarrying secrets of forgotten times.",
            //         voiceOver: 'assets/audio/voiceovers/sculpture1.mp3',
            //         isInteractive: true
            //     }
            // },
            {
                url: 'assets/models/yourModel.glb',
                position: new THREE.Vector3(15, -roomDimensions.height / 2 + 11, 10),
                scale: 10,
                rotation: new THREE.Euler(0, Math.PI / 4, 0),
                collisionPadding: 1.2,
                userData: {
                    title: "Ancient Sculpture",
                    poem: "A mysterious ancient sculpture.",
                    voiceOver: 'assets/audio/voiceovers/sculpture1.mp3',
                    isInteractive: false
                }
            }
            // Add more models here as needed
        ];
    }

    // Get all bounding boxes for collision detection
    getAllBoundingBoxes() {
        return this.modelBoundingBoxes;
    }

    // Get bounding box for a specific model
    getBoundingBox(model) {
        return this.modelBoundingBoxes.get(model);
    }

    // Update bounding box (call this if model moves or transforms)
    updateBoundingBox(model) {
        const boundingBox = this.createBoundingBox(model);
        this.modelBoundingBoxes.set(model, boundingBox);
        return boundingBox;
    }

    // Existing methods remain the same...
    optimizeMaterials(model) {
        model.traverse((child) => {
            if (child.isMesh) {
                if (child.material) {
                    child.material = new THREE.MeshBasicMaterial({
                        map: child.material.map,
                        color: child.material.color || 0xffffff
                    });
                }
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }

    createBoundingBox(model) {
        return new THREE.Box3().setFromObject(model);
    }

    getAllModels() {
        return this.models;
    }

    dispose() {
        this.models.forEach(model => {
            model.traverse((child) => {
                if (child.isMesh) {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => material.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                }
            });
        });
        this.models = [];
        this.modelBoundingBoxes.clear();
    }
}