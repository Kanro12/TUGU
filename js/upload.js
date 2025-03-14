// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJIrOySZOXdb_qaAV7LfhJ5hfunzWnbnE",
  authDomain: "tugu-55486.firebaseapp.com",
  databaseURL: "https://tugu-55486-default-rtdb.firebaseio.com",
  projectId: "tugu-55486",
  storageBucket: "tugu-55486.firebasestorage.app",
  messagingSenderId: "169013446773",
  appId: "1:169013446773:web:503d7bdd49a13666d6103c",
  measurementId: "G-W60DYV3SMR"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Menambahkan event listener untuk form
document.getElementById("uploadForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const urlInput = document.getElementById("urlInput");
    const textInput = document.getElementById("textInput");
    const feedback = document.getElementById("feedback");
    const uploadedContent = document.getElementById("uploadedContent");

    // Reset tampilan konten sebelumnya
    uploadedContent.innerHTML = '';

    if (urlInput.value.trim() === "") {
        feedback.textContent = "Silakan masukkan URL!";
        feedback.style.color = "red";
        return;
    }

    const url = urlInput.value;
    feedback.textContent = `URL "${url}" berhasil diproses dengan keterangan: "${textInput.value}".`;
    feedback.style.color = "green";

    const contentItem = document.createElement("div");
    contentItem.classList.add("content-item", "file-link");

    if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
        const img = document.createElement("img");
        img.src = url;
        contentItem.appendChild(img);
    } else if (url.match(/\.(mp4|webm|ogg)$/)) {
        const video = document.createElement("video");
        video.src = url;
        video.controls = true;
        contentItem.appendChild(video);
    } else if (url.includes("youtu.be") || url.includes("youtube.com")) {
        const videoId = extractYouTubeId(url);
        if (videoId) {
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            contentItem.appendChild(iframe);
        } else {
            feedback.textContent = "URL YouTube tidak valid.";
            feedback.style.color = "red";
        }
    } else {
        contentItem.innerHTML += `<p>URL "${url}" berhasil diproses tetapi bukan gambar atau video.</p>`;
    }

    uploadedContent.appendChild(contentItem);

    // Simpan data ke Firebase
    const newUploadRef = ref(database, 'uploads/' + Date.now());
    set(newUploadRef, {
        type: "url",
        url: url,
        keterangan: textInput.value
    });

    // Menampilkan deskripsi di bawah link
    const description = document.createElement("p");
    description.textContent = `Deskripsi: ${textInput.value}`;
    uploadedContent.appendChild(description);
});

// Fungsi untuk ekstrak ID YouTube
function extractYouTubeId(url) {
    const regExp = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S+\?v=|\S*\/)([a-zA-Z0-9_-]{11}))/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}
