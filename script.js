// ----------------- Screen Navigation -----------------
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// ----------------- Image/Video Upload -----------------
let imgCount = 0, vidCount = 0;

// Helper: upload file to backend
function uploadFileToBackend(file, geotag = "Not provided") {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("geotag", geotag);
  formData.append("time", new Date().toISOString());

  fetch("https://hackathon-backend-gepo.onrender.com/upload", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => console.log("✅ File uploaded:", data))
  .catch(err => console.error("❌ File upload error:", err));
}



// Capture image
function captureImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.capture = "environment"; // mobile will open camera
  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      showPreview(file);
      uploadFileToBackend(file);
      imgCount++;
      document.getElementById("img-count").innerText = imgCount + " Images";
    }
  };
  input.click();
}

// Capture video
function captureVideo() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "video/*";
  input.capture = "environment"; // mobile will open video recorder
  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      showPreview(file);
      uploadFileToBackend(file);
      vidCount++;
      document.getElementById("vid-count").innerText = vidCount + " Videos";
    }
  };
  input.click();
}

// Upload from gallery
function uploadFromGallery() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*,video/*";
  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      showPreview(file);
      uploadFileToBackend(file);

      if (file.type.startsWith("image/")) {
        imgCount++;
        document.getElementById("img-count").innerText = imgCount + " Images";
      } else if (file.type.startsWith("video/")) {
        vidCount++;
        document.getElementById("vid-count").innerText = vidCount + " Videos";
      }
    }
  };
  input.click();
}



// ----------------- Show Preview -----------------
function showPreview(file) {
  const previewArea = document.getElementById("preview-area");
  previewArea.innerHTML = ""; // clear previous preview

  const url = URL.createObjectURL(file);

  if (file.type.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth = "100%";
    img.style.marginTop = "10px";
    previewArea.appendChild(img);
  } else if (file.type.startsWith("video/")) {
    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    video.style.maxWidth = "100%";
    video.style.marginTop = "10px";
    previewArea.appendChild(video);
  }
}


// ----------------- Location -----------------
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);

        document.getElementById("location-output").innerText =
          "Latitude: " + lat + ", Longitude: " + lng;

        // Send to backend
        fetch("https://hackathon-backend-gepo.onrender.com/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude: lat, longitude: lng })
        })
        .then(res => res.json())
        .then(data => console.log("✅ Location saved to backend:", data))
        .catch(err => console.error("❌ Location save error:", err));
      },
      () => {
        document.getElementById("location-output").innerText =
          "Location access denied!";
      }
    );
  } else {
    document.getElementById("location-output").innerText =
      "Geolocation not supported.";
  }
}

// ----------------- Dark Mode -----------------
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}
