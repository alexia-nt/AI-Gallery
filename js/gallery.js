class Gallery {
    constructor() {
        this.artworks = [
            {
                url: 'assets/artworks/1.png',
                title: '1. A Brand New Start',
                poem: 'One step away, the world rewinds,\nyet forward pulls the tethered mind.\nDreams outweigh the fear of loss.'
            },
            {
                url: 'assets/artworks/2.png',
                title: '2. The First Night',
                poem: 'These words are strange, the names untold,\nA simple errand feels so bold.\nA map of food I must now learn,\nFor simple comfort, I must yearn.'
            },
            {
                url: 'assets/artworks/3.png',
                title: '3. The First Conversations',
                poem: 'My thoughts are clear, my voice is not,\nEach phrase a struggle, a knotted plot.\nI search for words, they slip and slide,\nA different me I try to hide.'
            },
            {
                url: 'assets/artworks/4.png',
                title: '4. The First Grocery Trip',
                poem: 'A glass between this world and me,\nA sea of faces I can\'t see.\nThe city lights rush by in streaks,\nA silent story that the glass speaks.'
            },
            {
                url: 'assets/artworks/5.png',
                title: '5. The Quiet Battle',
                poem: 'The work waits here, the book is open,\nBut thoughts of home feel bittersweet, unspoken.\nA screen holds faces I can\'t touch,\nAnd oh, I miss their warmth so much.'
            },
            {
                url: 'assets/artworks/6.png',
                title: '6. Where the Walls Fall',
                poem: 'One step away, the world rewinds,\nyet forward pulls the tethered mind.\nDreams outweigh the fear of loss.'
            },
            {
                url: 'assets/artworks/7.png',
                title: '7. The Call Between Two Worlds',
                poem: 'These new small habits, strange before,\nNow fit like keys to an unlocked door.\nThe awkward pause begins to fade,\nA simple life is being made.'
            },
            {
                url: 'assets/artworks/8.png',
                title: '8. The Quiet Triumph',
                poem: 'A passing scent, a sudden grace,\nTransported to a different place.\nA ghost of home that lingers on,\nA bittersweet and tender dawn.'
            },
            {
                url: 'assets/artworks/9.png',
                title: '9. The Shared Table',
                poem: 'My story\'s threads begin to weave,\nNew friends and family I receive.\nA chosen home, a second chance,\nTo join the rhythm, learn the dance.'
            },
            {
                url: 'assets/artworks/10.png',
                title: '10. The Changed Man',
                poem: 'I stand before the self I\'ve grown,\nThe path I\'ve walked, the seeds I\'ve sown.\nMy past and future, side by side,\nBetween two worlds, I now reside.'
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