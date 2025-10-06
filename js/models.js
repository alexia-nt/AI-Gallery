class ModelManager {
    constructor() {
        this.models = [];
        this.loader = new THREE.GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
    }

    loadModel(url, position, scale, rotation, userData) {
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
                    
                    // Optimize materials for better performance
                    this.optimizeMaterials(model);
                    
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

    optimizeMaterials(model) {
        model.traverse((child) => {
            if (child.isMesh) {
                // Convert to basic materials for simplicity and performance
                if (child.material) {
                    child.material = new THREE.MeshBasicMaterial({
                        map: child.material.map,
                        color: child.material.color || 0xffffff
                    });
                }
                
                // Enable shadows if needed
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }

    createBoundingBox(model) {
        return new THREE.Box3().setFromObject(model);
    }

    // Method to load your specific sculpture model
    loadSculpture(scene, roomHeight) {
        const sculptureData = {
            title: "3D Sculpture",
            poem: "A mysterious sculpture stands here,\ninviting contemplation and awe."
        };

        return this.loadModel(
            'models/yourModel.glb',
            new THREE.Vector3(15, -roomHeight / 2 + 11, 10),
            10,
            new THREE.Euler(0, Math.PI / 4, 0),
            sculptureData
        );
    }

    // Method to load additional decorative models
    loadDecorativeModels(scene, roomDimensions) {
        const models = [];
        
        // Example: Load multiple decorative items
        const decorativeItems = [
            {
                url: 'models/yourModel.glb',
                position: new THREE.Vector3(-10, -roomDimensions.height / 2 + 5, 15),
                scale: 3,
                rotation: new THREE.Euler(0, Math.PI / 2, 0),
                userData: { type: 'decorative', interactive: false }
            }
        ];

        // Load all decorative items
        decorativeItems.forEach(item => {
            this.loadModel(
                item.url,
                item.position,
                item.scale,
                item.rotation,
                item.userData
            ).then(model => {
                scene.add(model);
                models.push(model);
            });
        });

        return models;
    }

    getAllModels() {
        return this.models;
    }

    // Clean up method for memory management
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
    }
}