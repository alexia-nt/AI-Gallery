class Gallery {
    constructor() {
        this.artworks = [
            {
                url: 'assets/artworks/1.jpeg',
                title: '1. A Brand New Start',
                poem: 'One step away, the world rewinds,\nyet forward pulls the tethered mind.\nDreams outweigh the fear of loss.'
            },
            {
                url: 'https://placehold.co/800x600/222/FFF?text=The+Unfamiliar+Grocery+Aisle',
                title: '2. The Unfamiliar Grocery Aisle',
                poem: 'These words are strange, the names untold,\nA simple errand feels so bold.\nA map of food I must now learn,\nFor simple comfort, I must yearn.'
            },
            {
                url: 'https://placehold.co/800x600/222/FFF?text=The+Broken+Conversation',
                title: '3. The Broken Conversation',
                poem: 'My thoughts are clear, my voice is not,\nEach phrase a struggle, a knotted plot.\nI search for words, they slip and slide,\nA different me I try to hide.'
            },
            {
                url: 'https://placehold.co/600x800/222/FFF?text=The+Silent+Bus+Window',
                title: '4. The Silent Bus Window',
                poem: 'A glass between this world and me,\nA sea of faces I can\'t see.\nThe city lights rush by in streaks,\nA silent story that the glass speaks.'
            },
            {
                url: 'https://placehold.co/600x800/222/FFF?text=The+Empty+Chair',
                title: '5. The Empty Chair',
                poem: 'The work waits here, the book is open,\nBut thoughts of home feel bittersweet, unspoken.\nA screen holds faces I can\'t touch,\nAnd oh, I miss their warmth so much.'
            },
            {
                url: 'https://placehold.co/600x800/222/FFF?text=Test',
                title: '6. Test',
                poem: 'One step away, the world rewinds,\nyet forward pulls the tethered mind.\nDreams outweigh the fear of loss.'
            },
            {
                url: 'https://placehold.co/800x600/222/FFF?text=The+New+Routine',
                title: '7. The New Routine',
                poem: 'These new small habits, strange before,\nNow fit like keys to an unlocked door.\nThe awkward pause begins to fade,\nA simple life is being made.'
            },
            {
                url: 'https://placehold.co/600x800/222/FFF?text=The+Memory+of+a+Scent',
                title: '8. The Memory of a Scent',
                poem: 'A passing scent, a sudden grace,\nTransported to a different place.\nA ghost of home that lingers on,\nA bittersweet and tender dawn.'
            },
            {
                url: 'https://placehold.co/800x600/222/FFF?text=The+Circle+of+Belonging',
                title: '9. The Circle of Belonging',
                poem: 'My story\'s threads begin to weave,\nNew friends and family I receive.\nA chosen home, a second chance,\nTo join the rhythm, learn the dance.'
            },
            {
                url: 'https://placehold.co/800x600/222/FFF?text=The+Reflected+Face',
                title: '10. The Reflected Face',
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
            this.artworks[5], 
            picSize, picSize, 
            new THREE.Vector3(-19, picHeight, roomDepth / 2 - 1), 
            new THREE.Euler(0, Math.PI, 0)
        ));
        
        scene.add(this.createPicturePlane(
            this.artworks[6], 
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