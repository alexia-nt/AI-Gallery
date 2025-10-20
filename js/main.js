class GalleryApp {
    constructor() {
        this.canvas = document.getElementById('three-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        
        this.controls = new PointerLockControls(this.camera, document.body);
        this.room = new Room();
        this.gallery = new Gallery();
        this.audioManager = new AudioManager();
        this.uiManager = new UIManager();
        this.modelManager = new ModelManager();
        
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        
        this.raycaster = new THREE.Raycaster();
        this.prevTime = performance.now();
        
        this.modelBoundingBox = null;
        this.isModelsLoaded = false;
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupEventListeners();
        this.setupMovementControls();
        this.setupRaycasting();
        this.animate();
    }

    async setupScene() {
        // Setup room
        this.room.setupRoom(this.scene);
        
        // Setup gallery
        this.gallery.setupGallery(this.scene);
        
        // Load 3D models
        await this.load3DModels();
        
        // Position camera
        const eyeHeight = 15;
        const roomHeight = this.room.getRoomDimensions().height;
        this.camera.position.set(0, -roomHeight / 2 + eyeHeight, 0);
    }

    async load3DModels() {
        try {
            const roomDimensions = this.room.getRoomDimensions();
            const modelConfigs = this.modelManager.getGalleryModelConfigs(roomDimensions);
            
            const loadedModels = await this.modelManager.loadMultipleModels(modelConfigs);
            
            // Add all models to the scene
            loadedModels.forEach(model => {
                this.scene.add(model);
                console.log(`Added model to scene: ${model.userData?.title || 'Unknown'}`);
            });
            
            this.isModelsLoaded = true;
            console.log(`Successfully loaded ${loadedModels.length} 3D models`);
            
        } catch (error) {
            console.error('Failed to load 3D models:', error);
            this.isModelsLoaded = true; // Continue even if models fail to load
        }
    }

    setupEventListeners() {
        this.uiManager.setupControlsListeners(this.controls);
        this.uiManager.setupModalListeners(this.controls, this.audioManager);
        this.audioManager.setupKeyboardListeners();
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // ESC key to exit pointer lock
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Escape' && !this.uiManager.isModalOpen) {
                this.controls.unlock();
            }
        });
    }

    setupMovementControls() {
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = true;
                    break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = false;
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        // Cleanup function for potential future use
        this.cleanupKeyListeners = () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }

    setupRaycasting() {
        window.addEventListener('click', (event) => {
            if (this.controls.isLocked) {
                this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
                
                // Check gallery objects (pictures)
                const galleryObjects = this.gallery.getGalleryObjects();
                const galleryIntersects = this.raycaster.intersectObjects(galleryObjects);

                if (galleryIntersects.length > 0) {
                    const clickedObject = galleryIntersects[0].object;
                    this.uiManager.showArtworkModal(clickedObject.userData);
                    return;
                }

                // Check 3D models if loaded
                if (this.isModelsLoaded) {
                    const models = this.modelManager.getAllModels();
                    const modelIntersects = this.raycaster.intersectObjects(models, true);

                    if (modelIntersects.length > 0) {
                        const clickedModel = modelIntersects[0].object;
                        
                        // Traverse up to find the parent with userData
                        let target = clickedModel;
                        while (target && !target.userData.title && target.parent) {
                            target = target.parent;
                        }

                        // ONLY show modal if the model is interactive
                        if (target && target.userData && target.userData.title && target.userData.isInteractive !== false) {
                            this.uiManager.showArtworkModal(target.userData);
                        }
                    }
                }
            }
        });
    }

    checkCollisions() {
        const roomDims = this.room.getRoomDimensions();
        const halfRoomWidth = roomDims.width / 2;
        const halfRoomDepth = roomDims.depth / 2;
        const padding = 1.0;

        // Check collisions with all 3D models - REMOVE the isInteractive check here
        if (this.isModelsLoaded) {
            const boundingBoxes = this.modelManager.getAllBoundingBoxes();
            const models = this.modelManager.getAllModels();
            
            models.forEach(model => {
                const boundingBox = boundingBoxes.get(model);
                // Remove the isInteractive check - collision should work for ALL models
                if (boundingBox) {
                    this.checkModelCollision(boundingBox, model.userData.collisionPadding || 1.0);
                }
            });
        }

        // Room boundary checks (existing code)
        if (this.camera.position.x < -halfRoomWidth + padding) {
            this.camera.position.x = -halfRoomWidth + padding;
            this.velocity.x = 0;
        }
        if (this.camera.position.x > halfRoomWidth - padding) {
            this.camera.position.x = halfRoomWidth - padding;
            this.velocity.x = 0;
        }
        if (this.camera.position.z < -halfRoomDepth + padding) {
            this.camera.position.z = -halfRoomDepth + padding;
            this.velocity.z = 0;
        }
        if (this.camera.position.z > halfRoomDepth - padding) {
            this.camera.position.z = halfRoomDepth - padding;
            this.velocity.z = 0;
        }
    }

    checkModelCollision(boundingBox, collisionPadding) {
        const playerPos = this.camera.position;
        const collisionBox = boundingBox.clone();
        
        // Apply collision padding
        const paddingVector = new THREE.Vector3(collisionPadding, 0, collisionPadding);
        collisionBox.min.sub(paddingVector);
        collisionBox.max.add(paddingVector);
        
        if (collisionBox.containsPoint(playerPos)) {
            const modelCenter = new THREE.Vector3();
            collisionBox.getCenter(modelCenter);
            
            // Calculate distances to each face of the bounding box
            const distances = [
                Math.abs(playerPos.x - collisionBox.min.x),
                Math.abs(playerPos.x - collisionBox.max.x),
                Math.abs(playerPos.z - collisionBox.min.z),
                Math.abs(playerPos.z - collisionBox.max.z)
            ];
            
            const minDistance = Math.min(...distances);
            const minIndex = distances.indexOf(minDistance);
            
            // Push player out of the collision based on the closest face
            switch(minIndex) {
                case 0:
                    this.camera.position.x = collisionBox.min.x - 0.1;
                    break;
                case 1:
                    this.camera.position.x = collisionBox.max.x + 0.1;
                    break;
                case 2:
                    this.camera.position.z = collisionBox.min.z - 0.1;
                    break;
                case 3:
                    this.camera.position.z = collisionBox.max.z + 0.1;
                    break;
            }
            
            // Reset velocity to prevent sliding
            this.velocity.x = 0;
            this.velocity.z = 0;
        }
    }

    updateRaycasting() {
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        
        let isCursorActive = false;
        
        // Check gallery objects
        const galleryObjects = this.gallery.getGalleryObjects();
        const galleryIntersects = this.raycaster.intersectObjects(galleryObjects);
        
        if (galleryIntersects.length > 0) {
            isCursorActive = true;
        }
        
        // Check 3D models if gallery objects weren't hit - ADD 'true' HERE TOO
        if (!isCursorActive && this.isModelsLoaded) {
            const models = this.modelManager.getAllModels();
            const modelIntersects = this.raycaster.intersectObjects(models, true); // ← ADD THIS 'true'
            
            if (modelIntersects.length > 0) {
                const hitModel = modelIntersects[0].object;
                
                // Traverse up to find the parent with userData
                let target = hitModel;
                while (target && !target.userData.title && target.parent) {
                    target = target.parent;
                }
                
                // Only show cursor for interactive models
                if (target && target.userData && target.userData.title && target.userData.isInteractive !== false) {
                    isCursorActive = true;
                }
            }
        }
        
        this.uiManager.updateCursor(isCursorActive);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = performance.now();
        const delta = Math.min((time - this.prevTime) / 1000, 0.1); // Cap delta to prevent large jumps

        // Movement physics
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;

        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();

        if (this.moveForward || this.moveBackward) {
            this.velocity.z -= this.direction.z * 400.0 * delta;
        }
        if (this.moveLeft || this.moveRight) {
            this.velocity.x -= this.direction.x * 400.0 * delta;
        }

        // Apply movement
        this.controls.moveRight(-this.velocity.x * delta);
        this.controls.moveForward(-this.velocity.z * delta);

        // Footsteps audio
        const isMoving = this.moveForward || this.moveBackward || this.moveLeft || this.moveRight;
        if (isMoving) {
            this.audioManager.startFootsteps();
        } else {
            this.audioManager.stopFootsteps();
        }

        // Collision detection
        this.checkCollisions();

        // Update raycasting for cursor and interactions
        this.updateRaycasting();

        // Render the scene
        this.renderer.render(this.scene, this.camera);
        
        this.prevTime = time;
    }

    // Cleanup method for when the app is destroyed
    destroy() {
        if (this.cleanupKeyListeners) {
            this.cleanupKeyListeners();
        }
        
        this.modelManager.dispose();
        
        // Dispose of Three.js resources
        this.scene.traverse((object) => {
            if (object.isMesh) {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            }
        });
        
        this.renderer.dispose();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded. Please check your script imports.');
        return;
    }
    
    try {
        new GalleryApp();
        console.log('Gallery application started successfully');
    } catch (error) {
        console.error('Failed to initialize gallery application:', error);
    }
});