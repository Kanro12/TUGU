// Import fungsi yang diperlukan dari SDK Firebase
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

// Menambahkan event listener saat form disubmit
document.getElementById("editUploadForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const urlInput = document.getElementById("urlInput");
    const textInput = document.getElementById("textInput");
    const feedback = document.getElementById("feedback");
    const uploadedContent = document.getElementById("uploadedContent");

    // Resetkan tampilan konten upload sebelumnya
    uploadedContent.innerHTML = '';

    // Validasi input
    if (fileInput.files.length === 0 && urlInput.value.trim() === "") {
        feedback.textContent = "Silakan pilih file atau masukkan URL!";
        feedback.style.color = "red";
        return;
    }

    // Cek apakah ada file atau URL
    let file;
    let uploadedData = {};

    if (fileInput.files.length > 0) {
        file = fileInput.files[0];
        feedback.textContent = `File "${file.name}" berhasil diupload dengan keterangan: "${textInput.value}".`;
        feedback.style.color = "green";

        // Menampilkan file yang diupload
        const contentItem = document.createElement("div");
        contentItem.classList.add("content-item", "file-uploaded");

        if (file.type.startsWith("image/")) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            contentItem.appendChild(img);
        } else if (file.type.startsWith("video/")) {
            const video = document.createElement("video");
            video.src = URL.createObjectURL(file);
            video.controls = true;
            contentItem.appendChild(video);
        } else {
            contentItem.innerHTML += `<p>File "${file.name}" berhasil diupload, tetapi bukan gambar atau video.</p>`;
        }

        uploadedContent.appendChild(contentItem);

        // Menyimpan data ke Firebase
        uploadedData.type = "file";
        uploadedData.fileName = file.name;
        uploadedData.keterangan = textInput.value;
        uploadedData.url = URL.createObjectURL(file);
    }

    if (urlInput.value.trim() !== "") {
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

        // Menyimpan data URL ke Firebase
        uploadedData.type = "url";
        uploadedData.url = url;
        uploadedData.keterangan = textInput.value;
    }

    // Menyimpan data ke Firebase Realtime Database
    const newUploadRef = ref(database, 'uploads/' + Date.now());  // Gunakan timestamp sebagai ID unik
    set(newUploadRef, uploadedData);

    // Menampilkan deskripsi di bawah file atau link
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
