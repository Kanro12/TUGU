import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";

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
// Fungsi untuk menampilkan data yang diunggah dari Firebase
function loadUploadedData() {
    const uploadedContent = document.getElementById("uploadedContent");
    const uploadsRef = ref(database, 'uploads');

    // Mendengarkan perubahan data di Firebase
    onValue(uploadsRef, (snapshot) => {
        uploadedContent.innerHTML = ''; // Kosongkan tampilan sebelum memperbarui

        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const contentItem = document.createElement("div");
            contentItem.classList.add("content-item");

            if (data.type === "file" || data.type === "url") {
                if (data.url.match(/\.(jpeg|jpg|gif|png)$/)) {
                    const img = document.createElement("img");
                    img.src = data.url;
                    img.alt = "Gambar yang diunggah";
                    contentItem.appendChild(img);
                } else if (data.url.match(/\.(mp4|webm|ogg)$/)) {
                    const video = document.createElement("video");
                    video.src = data.url;
                    video.controls = true;
                    contentItem.appendChild(video);
                } else if (data.url.includes("youtu.be") || data.url.includes("youtube.com")) {
                    const videoId = extractYouTubeId(data.url);
                    if (videoId) {
                        const iframe = document.createElement("iframe");
                        iframe.src = `https://www.youtube.com/embed/${videoId}`;
                        iframe.frameBorder = "0";
                        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                        iframe.allowFullscreen = true;
                        contentItem.appendChild(iframe);
                    }
                } else {
                    contentItem.innerHTML += `<p>Data: ${data.url}</p>`;
                }

                // Tambahkan keterangan jika ada
                if (data.keterangan) {
                    const description = document.createElement("p");
                    description.textContent = `Deskripsi: ${data.keterangan}`;
                    contentItem.appendChild(description);
                }
            }

            uploadedContent.appendChild(contentItem);
        });
    });
}

// Panggil fungsi saat halaman dimuat
window.onload = loadUploadedData;
