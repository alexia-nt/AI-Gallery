class Room {
    constructor() {
        this.roomWidth = 60;
        this.roomHeight = 40;
        this.roomDepth = 80;
        this.textureLoader = new THREE.TextureLoader();
    }

    createTexturedWall(width, height, depth, position, rotation, material) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const wall = new THREE.Mesh(geometry, material);
        wall.position.copy(position);
        
        if (rotation) {
            wall.rotation.copy(rotation);
        }
        
        return wall;
    }

    setupRoom(scene) {
        // Load wall textures
        const wallTexture = this.textureLoader.load('textures/wall.jpg');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(4, 2);

        const wallMaterial = new THREE.MeshStandardMaterial({ 
            map: wallTexture,
            roughness: 0.7,
            metalness: 0.1
        });

        // Walls
        scene.add(this.createTexturedWall(
            1, this.roomHeight, this.roomDepth, 
            new THREE.Vector3(-this.roomWidth / 2, 0, 0), 
            null, 
            wallMaterial
        ));
        
        scene.add(this.createTexturedWall(
            1, this.roomHeight, this.roomDepth, 
            new THREE.Vector3(this.roomWidth / 2, 0, 0), 
            null, 
            wallMaterial
        ));
        
        scene.add(this.createTexturedWall(
            this.roomWidth, this.roomHeight, 1, 
            new THREE.Vector3(0, 0, -this.roomDepth / 2), 
            null, 
            wallMaterial
        ));
        
        scene.add(this.createTexturedWall(
            this.roomWidth, this.roomHeight, 1, 
            new THREE.Vector3(0, 0, this.roomDepth / 2), 
            null, 
            wallMaterial
        ));

        // Floor
        const floorTexture = this.textureLoader.load('textures/floor1.jpg');
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(4, 4);
        floorTexture.anisotropy = 16;

        const floorGeometry = new THREE.PlaneGeometry(this.roomWidth, this.roomDepth);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            map: floorTexture,
            roughness: 0.6,
            metalness: 0.2
        });
        
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -this.roomHeight / 2 + 0.5;
        scene.add(floor);

        // Ceiling
        const ceilingTexture = this.textureLoader.load('textures/wall.jpg');
        ceilingTexture.wrapS = THREE.RepeatWrapping;
        ceilingTexture.wrapT = THREE.RepeatWrapping;
        ceilingTexture.repeat.set(3, 3);
        ceilingTexture.anisotropy = 16;

        const ceilingMaterial = new THREE.MeshStandardMaterial({
            map: ceilingTexture,
            roughness: 0.7,
            metalness: 0.1
        });

        const ceilingGeometry = new THREE.PlaneGeometry(this.roomWidth, this.roomDepth);
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = this.roomHeight / 2;
        scene.add(ceiling);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xfff7ed, 0.5, 100);
        pointLight.position.set(0, this.roomHeight / 2 - 2, 0);
        scene.add(pointLight);

        // Door
        const doorTexture = this.textureLoader.load('images/door2.png');
        const doorGeometry = new THREE.PlaneGeometry(30, 30);
        const doorMaterial = new THREE.MeshBasicMaterial({ 
            map: doorTexture,
            transparent: true,
            alphaTest: 0.5
        });
        
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, -6, this.roomDepth / 2 - 1);
        door.rotation.y = Math.PI;
        scene.add(door);

        // Lamp
        const lampTexture = this.textureLoader.load('images/lamp.png');
        const lampMaterial = new THREE.MeshBasicMaterial({
            map: lampTexture,
            transparent: true,
            side: THREE.DoubleSide
        });

        const lampSize = 10;
        const lamp = new THREE.Mesh(
            new THREE.PlaneGeometry(lampSize, lampSize),
            lampMaterial
        );

        lamp.position.set(0, this.roomHeight / 2 - 0.01, 0);
        lamp.rotation.x = Math.PI / 2;
        scene.add(lamp);
    }

    getRoomDimensions() {
        return {
            width: this.roomWidth,
            height: this.roomHeight,
            depth: this.roomDepth
        };
    }
}