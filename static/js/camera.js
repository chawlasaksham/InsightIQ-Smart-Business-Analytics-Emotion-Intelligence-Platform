const video = document.getElementById("webcam");
const label = document.getElementById("emotion-output");

async function sendFrame() {
  if (!video || !label || !video.videoWidth || !video.videoHeight) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const image = canvas.toDataURL("image/jpeg");

  try {
    const response = await fetch("/detect_emotion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });
    const data = await response.json();
    label.textContent = data.emotion
      ? `Emotion: ${data.emotion}`
      : "Emotion: none";
  } catch (error) {
    console.error("Emotion detection failed:", error);
    label.textContent = "Emotion: error";
  }
}

function initCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    label.textContent = "Camera not supported in this browser.";
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        setInterval(sendFrame, 1000);
      });
    })
    .catch((error) => {
      console.error("Unable to access webcam:", error);
      label.textContent = "Camera permission denied.";
    });
}

if (video && label) {
  initCamera();
}



