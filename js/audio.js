class AudioManager {
    constructor() {
        this.bgMusic = new Audio('assets/audio/background.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.5;
        
        this.footstepFiles = [
            'assets/audio/footstep4.mp3',
            'assets/audio/footstep5.mp3',
            'assets/audio/footstep6.mp3'
        ];
        
        this.footstepAudio = new Audio();
        this.footstepAudio.volume = 1.0;
        this.footstepAudio.loop = true;
        this.isWalking = false;
    }

    toggleBackgroundMusic() {
        if (this.bgMusic.paused) {
            this.bgMusic.play();
        } else {
            this.bgMusic.pause();
        }
    }

    startFootsteps() {
        if (!this.isWalking) {
            const file = this.footstepFiles[Math.floor(Math.random() * this.footstepFiles.length)];
            this.footstepAudio.src = file;
            this.footstepAudio.currentTime = 0;
            this.footstepAudio.playbackRate = 1.1;
            this.footstepAudio.play();
            this.isWalking = true;
        }
    }

    stopFootsteps() {
        if (this.isWalking) {
            this.footstepAudio.pause();
            this.footstepAudio.currentTime = 0;
            this.isWalking = false;
        }
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'm') {
                this.toggleBackgroundMusic();
            }
        });
    }
}