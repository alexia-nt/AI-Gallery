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
        
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        
        this.raycaster = new THREE.Raycaster();
        this.prevTime = performance.now();
        
        this.modelBoundingBox = null;
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupEventListeners();
        this.setupMovementControls();
        this.setupRaycasting();
        this.animate();
    }

    setupScene() {
        // Setup room
        this.room.setupRoom(this.scene);
        
        // Setup gallery
        this.gallery.setupGallery(this.scene);
        
        // Load 3D model
        this.load3DModel();
        
        // Position camera
        const eyeHeight = 15;
        const roomHeight = this.room.getRoomDimensions().height;
        this.camera.position.set(0, -roomHeight / 2 + eyeHeight, 0);
    }

    load3DModel() {
        const gltfLoader = new THREE.GLTFLoader();
        
        gltfLoader.load('models/yourModel.glb', (gltf) => {
            const model = gltf.scene;
            const roomHeight = this.room.getRoomDimensions().height;

            model.position.set(15, -roomHeight / 2 + 11, 10);
            model.scale.set(10, 10, 10);
            model.rotation.y = Math.PI / 4;

            // Force the model to be visible with basic materials
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        map: child.material.map
                    });
                }
            });

            model.userData = {
                title: "3D Sculpture",
                poem: "A mysterious sculpture stands here,\ninviting contemplation and awe."
            };

            this.scene.add(model);
            this.modelBoundingBox = new THREE.Box3().setFromObject(model);
        });
    }

    setupEventListeners() {
        this.uiManager.setupControlsListeners(this.controls);
        this.uiManager.setupModalListeners(this.controls);
        this.audioManager.setupKeyboardListeners();
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupMovementControls() {
        document.addEventListener('keydown', (event) => {
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
        });

        document.addEventListener('keyup', (event) => {
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
        });
    }

    setupRaycasting() {
        window.addEventListener('click', (event) => {
            if (this.controls.isLocked) {
                this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
                const galleryObjects = this.gallery.getGalleryObjects();
                const intersects = this.raycaster.intersectObjects(galleryObjects);

                if (intersects.length > 0) {
                    const clickedObject = intersects[0].object;
                    this.uiManager.showArtworkModal(clickedObject.userData);
                    this.controls.unlock();
                }
            }
        });
    }

    checkCollisions() {
        const roomDims = this.room.getRoomDimensions();
        const halfRoomWidth = roomDims.width / 2;
        const halfRoomDepth = roomDims.depth / 2;
        const padding = 1.0;

        // Model collision check
        if (this.modelBoundingBox) {
            const playerPos = this.camera.position;
            const collisionBox = this.modelBoundingBox.clone();
            const shrinkFactor = 0.8;
            collisionBox.min.multiplyScalar(shrinkFactor);
            collisionBox.max.multiplyScalar(shrinkFactor);
            
            if (collisionBox.containsPoint(playerPos)) {
                const modelCenter = new THREE.Vector3();
                collisionBox.getCenter(modelCenter);
                const direction = new THREE.Vector3().subVectors(playerPos, modelCenter).normalize();
                
                const distances = [
                    Math.abs(playerPos.x - collisionBox.min.x),
                    Math.abs(playerPos.x - collisionBox.max.x),
                    Math.abs(playerPos.z - collisionBox.min.z),
                    Math.abs(playerPos.z - collisionBox.max.z)
                ];
                
                const minDistance = Math.min(...distances);
                const minIndex = distances.indexOf(minDistance);
                
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
                
                this.velocity.x = 0;
                this.velocity.z = 0;
            }
        }

        // Room boundary checks
        if (this.camera.position.x < -halfRoomWidth + padding) {
            this.camera.position.x = -halfRoomWidth + padding;
        }
        if (this.camera.position.x > halfRoomWidth - padding) {
            this.camera.position.x = halfRoomWidth - padding;
        }
        if (this.camera.position.z < -halfRoomDepth + padding) {
            this.camera.position.z = -halfRoomDepth + padding;
        }
        if (this.camera.position.z > halfRoomDepth - padding) {
            this.camera.position.z = halfRoomDepth - padding;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = performance.now();
        const delta = (time - this.prevTime) / 1000;

        // Movement
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;

        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();

        if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 400.0 * delta;
        if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 400.0 * delta;

        this.controls.moveRight(-this.velocity.x * delta);
        this.controls.moveForward(-this.velocity.z * delta);

        // Footsteps
        const moving = this.moveForward || this.moveBackward || this.moveLeft || this.moveRight;
        if (moving) {
            this.audioManager.startFootsteps();
        } else {
            this.audioManager.stopFootsteps();
        }

        // Collisions
        this.checkCollisions();

        // Raycasting for cursor
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        const galleryObjects = this.gallery.getGalleryObjects();
        const intersects = this.raycaster.intersectObjects(galleryObjects);
        this.uiManager.updateCursor(intersects.length > 0);

        // Render
        this.renderer.render(this.scene, this.camera);
        this.prevTime = time;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryApp();
});