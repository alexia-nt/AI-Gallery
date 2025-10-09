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
        this.modalText = document.getElementById('modal-text'); // Add this line
        
        // Track current artwork for voice-over
        this.currentArtwork = null;
        this.isModalOpen = false;
        
        // Bind the keydown handler
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    setupControlsListeners(controls) {
        this.instructions.addEventListener('click', () => {
            controls.lock();
        });

        controls.addEventListener('lock', () => {
            this.blocker.style.display = 'none';
            if (!this.isModalOpen) {
                this.cursor.style.display = 'block';
            }
        });

        controls.addEventListener('unlock', () => {
            this.blocker.style.display = 'flex';
            this.cursor.style.display = 'none';
        });
    }

    setupModalListeners(controls, audioManager) {
        this.controls = controls;
        this.audioManager = audioManager;

        this.closeButton.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside content
        this.modalContainer.addEventListener('click', (event) => {
            if (event.target === this.modalContainer) {
                this.closeModal();
            }
        });

        // Add global keydown listener for voice-over and modal control
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(event) {
        // Only handle space and escape when modal is open
        if (!this.isModalOpen) return;

        if (event.code === 'Space' && this.currentArtwork) {
            event.preventDefault(); // Prevent space bar from scrolling the page
            console.log('Space pressed, playing voice-over:', this.currentArtwork.voiceOver);
            this.audioManager.toggleVoiceOver(this.currentArtwork.voiceOver);
        }
        
        // Close modal with Escape key
        if (event.code === 'Escape') {
            this.closeModal();
        }
    }

    showArtworkModal(artworkData) {
        console.log('Showing modal for:', artworkData.title);
        
        // Unlock controls first to show system cursor
        if (this.controls) {
            this.controls.unlock();
        }
        
        this.modalImage.src = artworkData.url;
        this.modalTitle.textContent = artworkData.title;
        this.modalPoem.innerHTML = artworkData.poem.replace(/\n/g, '<br>');
        this.modalContainer.style.display = 'flex';
        
        // Store current artwork for voice-over
        this.currentArtwork = artworkData;
        this.isModalOpen = true;
        
        // Hide the green cursor when modal is open
        this.cursor.style.display = 'none';
        
        // Add voice-over instruction to modal
        this.addVoiceOverInstruction();
    }

    closeModal() {
        console.log('Closing modal');
        this.modalContainer.style.display = 'none';
        this.currentArtwork = null;
        this.isModalOpen = false;
        
        if (this.audioManager) {
            this.audioManager.stopVoiceOver();
        }
        
        // Show the green cursor again and relock controls after a short delay
        setTimeout(() => {
            if (!this.isModalOpen && this.controls) {
                this.controls.lock();
            }
        }, 100);
    }

    addVoiceOverInstruction() {
        // Remove existing instruction first
        const existingInstruction = document.getElementById('voice-over-instruction');
        if (existingInstruction) {
            existingInstruction.remove();
        }

        // Create new instruction
        const instruction = document.createElement('div');
        instruction.id = 'voice-over-instruction';
        instruction.style.marginTop = '15px';
        instruction.style.fontSize = '0.9rem';
        instruction.style.color = '#4CAF50';
        instruction.style.fontStyle = 'normal';
        instruction.style.textAlign = 'center';
        instruction.textContent = 'Press SPACE to play voice-over';
        
        this.modalText.appendChild(instruction);
    }

    updateCursor(isActive) {
        if (isActive && !this.isModalOpen) {
            this.cursor.classList.add('active');
        } else {
            this.cursor.classList.remove('active');
        }
    }

    // Clean up event listeners
    dispose() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }
}