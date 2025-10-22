class AudioManager {
    constructor() {
        // this.bgMusic = new Audio('assets/audio/background.mp3');
        this.bgMusic = new Audio('assets/audio/ai_music/background_game.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.2;
        
        this.footstepFiles = [
            'assets/audio/footstep4.mp3',
            'assets/audio/footstep5.mp3',
            'assets/audio/footstep6.mp3'
        ];
        
        this.footstepAudio = new Audio();
        this.footstepAudio.volume = 1.0;
        this.footstepAudio.loop = true;
        this.isWalking = false;

        // Voice-over properties
        this.voiceOverAudio = new Audio();
        this.voiceOverAudio.volume = 0.7;
        this.currentVoiceOver = null;
        this.isVoiceOverPlaying = false;

        console.log('AudioManager initialized');
    }

    toggleBackgroundMusic() {
        if (this.bgMusic.paused) {
            this.bgMusic.play().catch(error => {
                console.error('Error playing background music:', error);
            });
        } else {
            this.bgMusic.pause();
        }
    }

    // Voice-over methods
    playVoiceOver(voiceOverUrl) {
        console.log('Attempting to play voice-over:', voiceOverUrl);
        
        // Stop any currently playing voice-over
        this.stopVoiceOver();

        // Set up new voice-over
        this.voiceOverAudio.src = voiceOverUrl;
        this.currentVoiceOver = voiceOverUrl;
        this.isVoiceOverPlaying = true;

        // Play the voice-over
        this.voiceOverAudio.play().then(() => {
            console.log('Voice-over started playing successfully');
            this.isVoiceOverPlaying = true;
        }).catch(error => {
            console.error('Error playing voice-over:', error);
            console.log('Audio error details:', this.voiceOverAudio.error);
            this.isVoiceOverPlaying = false;
        });

        // Handle when voice-over ends
        this.voiceOverAudio.onended = () => {
            console.log('Voice-over ended');
            this.isVoiceOverPlaying = false;
            this.currentVoiceOver = null;
        };

        // Handle errors
        this.voiceOverAudio.onerror = (error) => {
            console.error('Error loading voice-over:', voiceOverUrl, error);
            console.log('Audio element error:', this.voiceOverAudio.error);
            this.isVoiceOverPlaying = false;
            this.currentVoiceOver = null;
        };
    }

    stopVoiceOver() {
        if (this.isVoiceOverPlaying) {
            console.log('Stopping current voice-over');
            this.voiceOverAudio.pause();
            this.voiceOverAudio.currentTime = 0;
            this.isVoiceOverPlaying = false;
            this.currentVoiceOver = null;
        }
    }

    toggleVoiceOver(voiceOverUrl) {
        console.log('Toggle voice-over called:', voiceOverUrl);
        console.log('Currently playing:', this.isVoiceOverPlaying, 'Current file:', this.currentVoiceOver);
        
        if (this.isVoiceOverPlaying && this.currentVoiceOver === voiceOverUrl) {
            console.log('Stopping voice-over');
            this.stopVoiceOver();
        } else {
            console.log('Starting voice-over');
            this.playVoiceOver(voiceOverUrl);
        }
    }

    startFootsteps() {
        if (!this.isWalking) {
            const file = this.footstepFiles[Math.floor(Math.random() * this.footstepFiles.length)];
            this.footstepAudio.src = file;
            this.footstepAudio.currentTime = 0;
            this.footstepAudio.playbackRate = 1.1;
            this.footstepAudio.play().catch(error => {
                console.error('Error playing footsteps:', error);
            });
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