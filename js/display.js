import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getDatabase, ref, onChildAdded, onChildChanged } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";

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

// Mendapatkan elemen konten untuk menampilkan hasil
const uploadedContent = document.getElementById("uploadedContent");

// Fungsi untuk menampilkan data
function displayContent(data) {
    const contentItem = document.createElement("div");
    contentItem.classList.add("content-item");
    contentItem.addEventListener("click", () => {
        window.location.href = `detail.html?url=${encodeURIComponent(data.url)}&desc=${encodeURIComponent(data.keterangan)}`;
    });

    if (data.type === "file") {
        if (isImage(data.url)) {
            const img = document.createElement("img");
            img.src = data.url;
            contentItem.appendChild(img);
        } else if (isVideo(data.url)) {
            const video = document.createElement("video");
            video.src = data.url;
            video.controls = true;
            contentItem.appendChild(video);
        } else {
            contentItem.innerHTML += `<p>File "${data.fileName}" berhasil diupload, tetapi bukan gambar atau video.</p>`;
        }
    } else if (data.type === "url") {
        if (isImage(data.url)) {
            const img = document.createElement("img");
            img.src = data.url;
            contentItem.appendChild(img);
        } else if (isVideo(data.url)) {
            const video = document.createElement("video");
            video.src = data.url;
            video.controls = true;
            contentItem.appendChild(video);
        } else if (isYouTube(data.url)) {
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube.com/embed/${extractYouTubeId(data.url)}`;
            iframe.frameBorder = "0";
            iframe.allowFullscreen = true;
            contentItem.appendChild(iframe);
        } else if (isLink(data.url)) {
            const link = document.createElement("a");
            link.href = data.url;
            link.target = "_blank";
            link.textContent = `Klik untuk mengunjungi: ${data.url}`;
            contentItem.appendChild(link);
        }
    }

    // Menampilkan deskripsi
    const description = document.createElement("p");
    description.textContent = `Deskripsi: ${data.keterangan}`;
    contentItem.appendChild(description);

    uploadedContent.appendChild(contentItem);
}

// Fungsi untuk memeriksa apakah URL adalah gambar
function isImage(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/);
}

// Fungsi untuk memeriksa apakah URL adalah video
function isVideo(url) {
    return url.match(/\.(mp4|webm|ogg)$/);
}

// Fungsi untuk memeriksa apakah URL adalah YouTube
function isYouTube(url) {
    return url.includes("youtu.be") || url.includes("youtube.com");
}

// Fungsi untuk ekstrak ID YouTube
function extractYouTubeId(url) {
    const regExp = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S+\?v=|\S*\/)([a-zA-Z0-9_-]{11}))/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

// Fungsi untuk memeriksa apakah URL adalah link (bukan gambar atau video)
function isLink(url) {
    const linkPattern = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\/\w-]*)*(\?[\w-]+=[\w-]+(&[\w-]+=[\w-]+)*)?(#[\w-]+)?$/;
    return linkPattern.test(url);
}

// Mendengarkan perubahan data baru di Firebase
const uploadsRef = ref(database, 'uploads/');
onChildAdded(uploadsRef, (snapshot) => {
    const data = snapshot.val();
    displayContent(data); // Menampilkan konten baru
});

onChildChanged(uploadsRef, (snapshot) => {
    const data = snapshot.val();
    displayContent(data); // Menampilkan data yang berubah
});
