class Gallery {
    constructor() {
        this.artworks = [
            {
                url: 'assets/artworks/1.png',
                title: '1. A Brand New Start',
                poem: 'One step away, the world rewinds,\nyet forward pulls the tethered mind.\nDreams outweigh the fear of loss.',
                voiceOver: 'assets/audio/voiceovers/1.mp3'
            },
            {
                url: 'assets/artworks/2.png',
                title: '2. The First Night',
                poem: 'Shadows stretch across the floor,\nthe quiet hums of home no more.\nA small keepsake comforts what I miss.',
                voiceOver: 'assets/audio/voiceovers/2.mp3'
            },
            {
                url: 'assets/artworks/3.png',
                title: '3. The First Conversations',
                poem: 'Strangers\' smiles both near and far,\na hesitant hand waves from afar.\nThe first brick of a new home.',
                voiceOver: 'assets/audio/voiceovers/3.mp3'
            },
            {
                url: 'assets/artworks/4.png',
                title: '4. The First Grocery Trip',
                poem: 'Strange new signs and foreign brands,\na careful count of coins in hand.\nA new world bought one item at a time.',
                voiceOver: 'assets/audio/voiceovers/4.mp3'
            },
            {
                url: 'assets/artworks/5.png',
                title: '5. The Quiet Battle',
                poem: 'Pages blur, the hours bend,\na mind that strains to comprehend.\nFueled by a promise I made.',
                voiceOver: 'assets/audio/voiceovers/5.mp3'
            },
            {
                url: 'assets/artworks/6.png',
                title: '6. Where Walls Fall',
                poem: 'Whispered stories, shared a laugh,\nthe turning point of a new path.\nWhere friendships start and walls fall down.',
                voiceOver: 'assets/audio/voiceovers/6.mp3'
            },
            {
                url: 'assets/artworks/7.png',
                title: '7. The Call Between Two Worlds',
                poem: 'Their smiles flicker, soft and near,\nyet vanish when the call grows clear.\nRoots can reach across the sea.',
                voiceOver: 'assets/audio/voiceovers/7.mp3'
            },
            {
                url: 'assets/artworks/8.png',
                title: '8. The Quiet Triumph',
                poem: 'Effort spent and trials faced,\nthe mark of struggle now embraced.\nA quiet triumph hums within.',
                voiceOver: 'assets/audio/voiceovers/8.mp3'
            },
            {
                url: 'assets/artworks/9.png',
                title: '9. The Shared Table',
                poem: 'Voices mingle, stories unfold,\nwarmth blossoms in the midst of cold.\nNew roots grow where kindness clings.',
                voiceOver: 'assets/audio/voiceovers/9.mp3'
            },
            {
                url: 'assets/artworks/10.png',
                title: '10. The Changed Man',
                poem: 'The snow falls soft on paths I\'ve known,\na changed man now stands alone.\nTwo worlds are woven in my soul.',
                voiceOver: 'assets/audio/voiceovers/10.mp3'
            }
        ];
        
        this.galleryObjects = [];
        this.textureLoader = new THREE.TextureLoader();
    }

    createPicturePlane(artworkData, width, height, position, rotation) {
        const texture = this.textureLoader.load(artworkData.url);
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const picture = new THREE.Mesh(geometry, material);
        
        picture.position.copy(position);
        picture.rotation.copy(rotation);
        picture.userData = artworkData;
        
        return picture;
    }

    setupGallery(scene) {
        const picSize = 10;
        const picHeight = -3;
        const halfPI = Math.PI / 2;
        const roomWidth = 60;
        const roomDepth = 80;
        
        // Left Wall
        scene.add(this.createPicturePlane(
            this.artworks[9], 
            picSize, picSize, 
            new THREE.Vector3(-roomWidth / 2 + 1, picHeight, -20), 
            new THREE.Euler(0, halfPI, 0)
        ));
        
        scene.add(this.createPicturePlane(
            this.artworks[8], 
            picSize, picSize, 
            new THREE.Vector3(-roomWidth / 2 + 1, picHeight, 0), 
            new THREE.Euler(0, halfPI, 0)
        ));
        
        scene.add(this.createPicturePlane(
            this.artworks[7], 
            picSize, picSize, 
            new THREE.Vector3(-roomWidth / 2 + 1, picHeight, 20), 
            new THREE.Euler(0, halfPI, 0)
        ));

        // Right Wall
        scene.add(this.createPicturePlane(
            this.artworks[2], 
            picSize, picSize, 
            new THREE.Vector3(roomWidth / 2 - 1, picHeight, -20), 
            new THREE.Euler(0, -halfPI, 0)
        ));
        
        scene.add(this.createPicturePlane(
            this.artworks[3], 
            picSize, picSize, 
            new THREE.Vector3(roomWidth / 2 - 1, picHeight, 0), 
            new THREE.Euler(0, -halfPI, 0)
        ));
        
        scene.add(this.createPicturePlane(
            this.artworks[4], 
            picSize, picSize, 
            new THREE.Vector3(roomWidth / 2 - 1, picHeight, 20), 
            new THREE.Euler(0, -halfPI, 0)
        ));

        // Front Wall
        scene.add(this.createPicturePlane(
            this.artworks[0], 
            picSize, picSize, 
            new THREE.Vector3(-12, picHeight, -roomDepth / 2 + 1), 
            new THREE.Euler(0, 0, 0)
        ));
        
        scene.add(this.createPicturePlane(
            this.artworks[1], 
            picSize, picSize, 
            new THREE.Vector3(12, picHeight, -roomDepth / 2 + 1), 
            new THREE.Euler(0, 0, 0)
        ));

        // Back Wall
        scene.add(this.createPicturePlane(
            this.artworks[6], 
            picSize, picSize, 
            new THREE.Vector3(-19, picHeight, roomDepth / 2 - 1), 
            new THREE.Euler(0, Math.PI, 0)
        ));
        
        scene.add(this.createPicturePlane(
            this.artworks[5], 
            picSize, picSize, 
            new THREE.Vector3(19, picHeight, roomDepth / 2 - 1), 
            new THREE.Euler(0, Math.PI, 0)
        ));
        
        // Collect all gallery objects for raycasting
        scene.traverse((object) => {
            if (object.userData && object.userData.title) {
                this.galleryObjects.push(object);
            }
        });
    }

    getGalleryObjects() {
        return this.galleryObjects;
    }
}