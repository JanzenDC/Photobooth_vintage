const video = document.getElementById('webcam');
const captureBtn = document.getElementById('capture');
const photoSlots = document.querySelectorAll('.photo-slot');
const bgColorPicker = document.getElementById('bgColor');

let photoIndex = 0;
let cameraReady = false;

// Ensure the camera is on before clicking the button
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        cameraReady = true; // Mark the camera as ready
    } catch (error) {
        console.error("Error accessing webcam:", error);
        alert("Webcam access is required to use this photo booth.");
    }
}

// Start camera as soon as the page loads
startCamera();

// Function to capture and display photo
function capturePhoto() {
    // Create a canvas to capture the image from the video
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to an image URL and set it as the background image of the current slot
    let imgData = canvas.toDataURL("image/png");
    photoSlots[photoIndex].style.backgroundImage = `url(${imgData})`;
    photoSlots[photoIndex].style.backgroundSize = "cover";
    photoSlots[photoIndex].style.backgroundPosition = "center";
    photoIndex++;
}

// Capture Photo with Countdown & Dice Roll Animation
captureBtn.addEventListener('click', async () => {
    if (!cameraReady) {
        alert("Camera is not ready yet. Please wait...");
        return;
    }
    
    if (photoIndex >= photoSlots.length) {
        alert("You can only take 3 photos!");
        return;
    }
    
    // Countdown Display
    let countdown = document.createElement('div');
    countdown.className = "countdown-overlay";
    countdown.innerHTML = `<span>3</span>`;
    document.body.appendChild(countdown);
    
    for (let i = 2; i >= 0; i--) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        countdown.innerHTML = `<span>${i}</span>`;
    }
    document.body.removeChild(countdown);
    
    // Dice Roll Overlay
    let diceOverlay = document.createElement('div');
    diceOverlay.className = "dice-roll-overlay";
    Object.assign(diceOverlay.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#fff",
        fontSize: "4rem",
        fontWeight: "bold",
        padding: "30px",
        border: "6px double #fff",
        borderRadius: "10px",
        zIndex: "1000"
    });
    document.body.appendChild(diceOverlay);
    
    // Simulate dice roll effect (roll for 2 seconds)
    const rollDuration = 2000; // total roll time in ms
    const intervalTime = 100; // update interval in ms
    let elapsed = 0;
    let diceInterval = setInterval(() => {
        // Get a random dice number between 1 and 6
        let diceResult = Math.floor(Math.random() * 6) + 1;
        diceOverlay.innerHTML = `<span>${diceResult}</span>`;
        elapsed += intervalTime;
        if (elapsed >= rollDuration) {
            clearInterval(diceInterval);
            // Wait a moment before removing the overlay
            setTimeout(() => {
                document.body.removeChild(diceOverlay);
                // Now capture and display the photo
                capturePhoto();
            }, 500);
        }
    }, intervalTime);
});

// Change Background Color of Photo Strip
bgColorPicker.addEventListener('input', (event) => {
    document.getElementById('photo-strip').style.backgroundColor = event.target.value;
});
