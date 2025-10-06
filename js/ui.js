class UIManager {
    constructor() {
        this.blocker = document.getElementById('blocker');
        this.instructions = document.getElementById('instructions');
        this.cursor = document.getElementById('cursor');
        this.modalContainer = document.getElementById('modal-container');
        this.modalImage = document.getElementById('modal-image');
        this.modalTitle = document.getElementById('modal-title');
        this.modalPoem = document.getElementById('modal-poem');
        this.closeButton = document.getElementById('close-button');
    }

    setupControlsListeners(controls) {
        this.instructions.addEventListener('click', () => {
            controls.lock();
        });

        controls.addEventListener('lock', () => {
            this.blocker.style.display = 'none';
            this.cursor.style.display = 'block';
        });

        controls.addEventListener('unlock', () => {
            this.blocker.style.display = 'flex';
            this.cursor.style.display = 'none';
        });
    }

    setupModalListeners(controls) {
        this.closeButton.addEventListener('click', () => {
            this.modalContainer.style.display = 'none';
            controls.lock();
        });
    }

    showArtworkModal(artworkData) {
        this.modalImage.src = artworkData.url;
        this.modalTitle.textContent = artworkData.title;
        this.modalPoem.innerHTML = artworkData.poem.replace(/\n/g, '<br>');
        this.modalContainer.style.display = 'flex';
    }

    updateCursor(isActive) {
        if (isActive) {
            this.cursor.classList.add('active');
        } else {
            this.cursor.classList.remove('active');
        }
    }
}