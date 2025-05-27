document.addEventListener('DOMContentLoaded', function() {
    // Audio player state
    let isPlaying = false;
    let currentVolume = 0.7;
    let visualizerInterval;
    
    // DOM elements
    const audio = document.getElementById('audio-player');
    const heroPlayBtn = document.getElementById('hero-play-btn');
    const mainPlayBtn = document.getElementById('main-play-btn');
    const heroPlayIcon = document.getElementById('hero-play-icon');
    const heroPauseIcon = document.getElementById('hero-pause-icon');
    const mainPlayIcon = document.getElementById('main-play-icon');
    const mainPauseIcon = document.getElementById('main-pause-icon');
    const heroPlayText = document.getElementById('hero-play-text');
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');
    const progressHandle = document.getElementById('progress-handle');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const trackDurationEl = document.getElementById('track-duration');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeFill = document.getElementById('volume-fill');
    const volumeHandle = document.getElementById('volume-handle');
    const visualizerBars = document.querySelectorAll('.visualizer-bar');
    const vinylRecord = document.querySelector('.vinyl-record');
    
    // Format time in MM:SS format
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Update progress bar
    function updateProgress() {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${progress}%`;
            progressHandle.style.left = `${progress}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
            totalTimeEl.textContent = formatTime(audio.duration);
        }
    }
    
    // Set volume
    function setVolume(volume) {
        currentVolume = volume;
        audio.volume = volume;
        volumeFill.style.width = `${volume * 100}%`;
        volumeHandle.style.left = `${volume * 100}%`;
    }
    
    // Toggle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            audio.pause();
            pauseAudio();
        } else {
            audio.play().then(() => {
                playAudio();
            }).catch(e => {
                console.log('Playback failed:', e);
                alert('Audio playback failed. Please try again.');
            });
        }
    }
    
    // Play audio
    function playAudio() {
        isPlaying = true;
        
        // Update UI
        heroPlayIcon.classList.add('hidden');
        heroPauseIcon.classList.remove('hidden');
        mainPlayIcon.classList.add('hidden');
        mainPauseIcon.classList.remove('hidden');
        heroPlayText.textContent = 'Pause';
        
        // Start animations
        startVisualizer();
        vinylRecord.style.animationPlayState = 'running';
    }
    
    // Pause audio
    function pauseAudio() {
        isPlaying = false;
        
        // Update UI
        heroPlayIcon.classList.remove('hidden');
        heroPauseIcon.classList.add('hidden');
        mainPlayIcon.classList.remove('hidden');
        mainPauseIcon.classList.add('hidden');
        heroPlayText.textContent = 'Listen Now';
        
        // Stop animations
        stopVisualizer();
        vinylRecord.style.animationPlayState = 'paused';
    }
    
    // Start visualizer animation
    function startVisualizer() {
        visualizerInterval = setInterval(() => {
            visualizerBars.forEach(bar => {
                const height = Math.random() * 20 + 10;
                bar.style.height = `${height}px`;
            });
        }, 200);
    }
    
    // Stop visualizer animation
    function stopVisualizer() {
        if (visualizerInterval) {
            clearInterval(visualizerInterval);
            visualizerInterval = null;
        }
    }
    
    // Event listeners for play/pause buttons
    heroPlayBtn.addEventListener('click', togglePlayPause);
    mainPlayBtn.addEventListener('click', togglePlayPause);
    
    // Audio events
    audio.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audio.duration);
        trackDurationEl.textContent = formatTime(audio.duration);
    });
    
    audio.addEventListener('timeupdate', updateProgress);
    
    audio.addEventListener('ended', () => {
        pauseAudio();
        audio.currentTime = 0;
        updateProgress();
    });
    
    audio.addEventListener('canplay', () => {
        if (audio.duration) {
            trackDurationEl.textContent = formatTime(audio.duration);
        }
    });
    
    // Progress bar interaction
    let isDraggingProgress = false;
    
    progressBar.addEventListener('click', (e) => {
        if (audio.duration) {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            audio.currentTime = percentage * audio.duration;
        }
    });
    
    progressHandle.addEventListener('mousedown', () => {
        isDraggingProgress = true;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDraggingProgress && audio.duration) {
            const rect = progressBar.getBoundingClientRect();
            let percentage = (e.clientX - rect.left) / rect.width;
            percentage = Math.max(0, Math.min(1, percentage));
            audio.currentTime = percentage * audio.duration;
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDraggingProgress = false;
    });
    
    // Volume slider interaction
    let isDraggingVolume = false;
    
    volumeSlider.addEventListener('click', (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        setVolume(Math.max(0, Math.min(1, percentage)));
    });
    
    volumeHandle.addEventListener('mousedown', () => {
        isDraggingVolume = true;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDraggingVolume) {
            const rect = volumeSlider.getBoundingClientRect();
            let percentage = (e.clientX - rect.left) / rect.width;
            percentage = Math.max(0, Math.min(1, percentage));
            setVolume(percentage);
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDraggingVolume = false;
    });
    
    // Initialize volume
    setVolume(currentVolume);
    
    // Previous/Next buttons (placeholder functionality)
    document.getElementById('prev-btn').addEventListener('click', () => {
        audio.currentTime = 0;
    });
    
    document.getElementById('next-btn').addEventListener('click', () => {
        // Placeholder for next track functionality
        console.log('Next track');
    });
    
    // Shuffle/Repeat buttons (placeholder functionality)
    document.getElementById('shuffle-btn').addEventListener('click', function() {
        this.classList.toggle('active');
        console.log('Shuffle toggled');
    });
    
    document.getElementById('repeat-btn').addEventListener('click', function() {
        this.classList.toggle('active');
        audio.loop = !audio.loop;
        console.log('Repeat toggled');
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
            e.preventDefault();
            togglePlayPause();
        }

});
    
    // Booking Modal Functionality
    const bookBtn = document.getElementById('hero-book-btn');
    const bookingModal = document.getElementById('booking-modal');
    const cancelBtn = document.getElementById('cancel-booking');
    const closeModalBtn = document.getElementById('modal-close');
    const bookingForm = document.getElementById('booking-form');
    
    // Open modal
    bookBtn.addEventListener('click', () => {
        bookingModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal
    function closeModal() {
        bookingModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    cancelBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeModal();
        }
    });
    
    // Handle form submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData);
        
        // Format WhatsApp message
        const whatsappMessage = `New Booking Request for DJ Andile:
        
Event Date: ${data.event_date}
Event Time: ${data.event_time}
Event Type: ${data.event_type}
Name: ${data.client_name}
Phone: ${data.phone}
Email: ${data.email}
Location: ${data.location}
Expected Guests: ${data.guest_count}
Additional Details: ${data.details || 'N/A'}`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/27681455502?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Close modal and reset form
        closeModal();
        bookingForm.reset();
        
        // Show confirmation
        alert('Your booking request has been sent to WhatsApp! DJ Andile will contact you soon.');
    });
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});