const videoEl = document.getElementById("intel-webcam");
const emotionLabel = document.getElementById("intel-emotion-label");
const frameStatus = document.getElementById("intel-frame-status");
const timelineList = document.getElementById("emotion-timeline");
const timelineTable = document.getElementById("timeline-table");
const sentimentOutput = document.getElementById("sentiment-output");
const sentimentScore = document.getElementById("sentiment-score");
const latestEmotionOutput = document.getElementById("latest-emotion-output");
const distributionBox = document.getElementById("emotion-distribution");
const insightBox = document.getElementById("behavioral-insight");
const speechToggle = document.getElementById("speech-toggle");
const reviewInput = document.getElementById("review-input");
const analyzeBtn = document.getElementById("analyze-btn");
const reviewError = document.getElementById("review-error");

const sessionId = crypto.randomUUID();
let captureInterval = null;
let recognition = null;
let listening = false;
let timelineCache = [];

function updateTimelineUI(timeline) {
  timelineCache = timeline;
  if (!timelineList) return;
  timelineList.innerHTML = "";
  timeline
    .slice()
    .reverse()
    .forEach((event) => {
      const li = document.createElement("li");
      li.className =
        "border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between";
      li.innerHTML = `<span class="font-semibold capitalize">${event.emotion}</span><span class="text-xs text-slate-500">${new Date(event.timestamp).toLocaleTimeString()}</span>`;
      timelineList.appendChild(li);
    });

  if (timelineTable) {
    timelineTable.innerHTML = "";
    timeline.slice(-20).forEach((event) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="py-2 pr-4 text-xs text-slate-500">${event.timestamp}</td>
        <td class="py-2 pr-4 font-medium capitalize">${event.emotion}</td>
        <td class="py-2">${(event.confidence * 100).toFixed(1)}%</td>
      `;
      timelineTable.appendChild(row);
    });
  }
}

function renderDistribution(distribution) {
  if (!distributionBox) return;
  if (!distribution || Object.keys(distribution).length === 0) {
    distributionBox.textContent = "No data yet.";
    return;
  }
  distributionBox.innerHTML = Object.entries(distribution)
    .map(
      ([emotion, value]) =>
        `<div class="flex justify-between"><span class="capitalize">${emotion}</span><span>${(
          value * 100
        ).toFixed(1)}%</span></div>`
    )
    .join("");
}

async function sendFrame() {
  if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) return;
  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  const image = canvas.toDataURL("image/jpeg");
  try {
    const res = await fetch("/emotion/log_frame", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, image }),
    });
    if (!res.ok) throw new Error("Frame upload failed");
    const data = await res.json();
    emotionLabel.textContent = `Emotion: ${data.emotion}`;
    frameStatus.textContent = `Last frame @ ${new Date(
      data.timestamp
    ).toLocaleTimeString()}`;
    updateTimelineUI(data.timeline || []);
  } catch (error) {
    console.error("Frame send error:", error);
    frameStatus.textContent = "Frame upload failed";
  }
}

function initCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    emotionLabel.textContent = "Camera not supported";
    return;
  }
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      videoEl.srcObject = stream;
      videoEl.addEventListener("loadedmetadata", () => {
        if (captureInterval) clearInterval(captureInterval);
        captureInterval = setInterval(sendFrame, 1000);
      });
    })
    .catch((error) => {
      console.error("Camera error:", error);
      emotionLabel.textContent = "Camera permission denied";
    });
}

function initSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    speechToggle.disabled = true;
    speechToggle.textContent = "Speech API unavailable";
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      transcript += event.results[i][0].transcript;
    }
    reviewInput.value = transcript.trim();
  };

  recognition.onend = () => {
    if (listening) recognition.start();
  };
}

function toggleSpeech() {
  if (!recognition) return;
  listening = !listening;
  if (listening) {
    recognition.start();
    speechToggle.textContent = "🛑 Stop Listening";
    speechToggle.classList.add("bg-indigo-600", "text-white");
  } else {
    recognition.stop();
    speechToggle.textContent = "🎙️ Start Listening";
    speechToggle.classList.remove("bg-indigo-600", "text-white");
  }
}

async function submitReview() {
  const text = (reviewInput.value || "").trim();
  reviewError.classList.add("hidden");
  if (!text) {
    reviewError.textContent = "Please capture or enter a review first.";
    reviewError.classList.remove("hidden");
    return;
  }
  analyzeBtn.disabled = true;
  analyzeBtn.classList.add("opacity-60");
  try {
    const res = await fetch("/emotion/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, text }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Analysis failed");

    sentimentOutput.textContent = data.sentiment?.label || "—";
    sentimentScore.textContent = `Confidence: ${(
      (data.sentiment?.score || 0) * 100
    ).toFixed(1)}%`;
    latestEmotionOutput.textContent =
      (data.latest_emotion || "").toUpperCase() || "—";
    renderDistribution(data.distribution);
    insightBox.textContent = data.insight || "No insight generated.";
    updateTimelineUI(data.timeline || timelineCache);
  } catch (error) {
    console.error("Review analysis error:", error);
    reviewError.textContent = error.message;
    reviewError.classList.remove("hidden");
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.classList.remove("opacity-60");
  }
}

initCamera();
initSpeechRecognition();

speechToggle?.addEventListener("click", toggleSpeech);
analyzeBtn?.addEventListener("click", submitReview);

