// 1. FIREBASE REALTIME DATABASE CONFIGURATION
const firebaseConfig = {
    apiKey: "AIzaSy...", 
    authDomain: "cicai-quiz-db.firebaseapp.com",
    databaseURL: "https://cicai-quiz-db-default-rtdb.firebaseio.com/", 
    projectId: "cicai-quiz-db",
    storageBucket: "cicai-quiz-db.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:123456:web:abcde123"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 2. QUIZ QUESTIONS LIST
const daftarSoal = [
    { pertanyaan: "1. If I ___ more time, I would have finished the engineering project yesterday.", pilihan: ["have", "had", "had had", "have had"], jawabanBenar: 2 },
    { pertanyaan: "2. The lecturer recommended that every student ___ the assignment before Friday.", pilihan: ["submit", "submits", "submitted", "submitting"], jawabanBenar: 0 },
    { pertanyaan: "3. She is looking forward to ___ her internship at the tech company next month.", pilihan: ["start", "starts", "started", "starting"], jawabanBenar: 3 },
    { pertanyaan: "4. The new laboratory equipment ___ by the campus technicians right now.", pilihan: ["is calibrating", "is being calibrated", "calibrated", "has calibrated"], jawabanBenar: 1 },
    { pertanyaan: "5. ___ the technical glitches, the team successfully launched the web application.", pilihan: ["Despite", "Although", "In spite", "However"], jawabanBenar: 0 },
    { pertanyaan: "6. What is the synonym of the word 'Meticulous'?", pilihan: ["Careless", "Fast", "Careful", "Lazy"], jawabanBenar: 2 },
    { pertanyaan: "7. By the time the professor arrived, the students ___ the logic circuit design.", pilihan: ["finish", "have finished", "had completed", "will finish"], jawabanBenar: 2 },
    { pertanyaan: "8. The student ___ final project won the award is from our department.", pilihan: ["who", "whom", "which", "whose"], jawabanBenar: 3 },
    { pertanyaan: "9. Seldom ___ such a complex database system structure.", pilihan: ["I have seen", "have I seen", "I saw", "did I saw"], jawabanBenar: 1 },
    { pertanyaan: "10. What is the antonym of the word 'Ambiguous'?", pilihan: ["Vague", "Clear", "Uncertain", "Confusing"], jawabanBenar: 1 }
];

let indeksSekarang = 0;
let skor = 0;
let nickname = "";

// Timer Variables
let waktuMundur; 
const BATAS_WAKTU = 20; 
let intervalTimer; 

// Page Flow 1 -> Page 2
function pindahKeNickname() {
    document.getElementById("halaman-welcome").style.display = "none";
    document.getElementById("halaman-nickname").style.display = "block";
}

// Page Flow 2 -> Page 3 (Countdown)
function mulaiCountdown() {
    let inputNama = document.getElementById("input-nama").value.trim();
    
    if (inputNama === "") {
        const elemenPeringatan = document.getElementById("peringatan-nama");
        if (elemenPeringatan) {
            elemenPeringatan.innerText = "Name cannot be empty!";
            elemenPeringatan.style.display = "block";
        }
        return;
    }
    
    nickname = inputNama; 
    document.getElementById("halaman-nickname").style.display = "none";
    document.getElementById("halaman-countdown").style.display = "block";

    let hitungan = 3;
    let elemenAngka = document.getElementById("angka-countdown");
    if (elemenAngka) {
        elemenAngka.innerText = hitungan;
    }
    
    clearInterval(intervalTimer);
    
    intervalTimer = setInterval(() => {
        hitungan--;
        if (hitungan > 0) {
            if (elemenAngka) elemenAngka.innerText = hitungan;
        } else {
            clearInterval(intervalTimer); 
            masukKeKuis(); 
        }
    }, 1000);
}

// Page Flow 3 -> Main Quiz Page
function masukKeKuis() {
    document.getElementById("halaman-countdown").style.display = "none";
    document.getElementById("halaman-kuis").style.display = "block";
    
    const elemenHalo = document.getElementById("halo-user");
    if (elemenHalo) {
        elemenHalo.innerText = "Hi, " + nickname + "! 👋";
    }
    tampilkanSoal();
}

function tampilkanSoal() {
    clearInterval(waktuMundur); 

    let soalAktif = daftarSoal[indeksSekarang];

    document.getElementById("btn-next").style.display = "none";
    document.getElementById("pertanyaan").innerText = soalAktif.pertanyaan;
    document.getElementById("info-nomor").innerText = "Question " + (indeksSekarang + 1) + "/" + daftarSoal.length;

    let persenProgress = ((indeksSekarang + 1) / daftarSoal.length) * 100;
    const elemenProgress = document.getElementById("progress-isi");
    if (elemenProgress) {
        elemenProgress.style.width = persenProgress + "%";
    }

    for (let i = 0; i < 4; i++) {
        let tombol = document.getElementById("opsi" + i);
        if (tombol) {
            tombol.innerText = soalAktif.pilihan[i];
            tombol.style.backgroundColor = "#ffffff";
            tombol.style.borderColor = "#e8ecf1";
            tombol.style.color = "#57606f";
            tombol.disabled = false;
        }
    }

    mulaiTimerSoal();
}

function mulaiTimerSoal() {
    let sisaWaktu = BATAS_WAKTU;
    let elemenTimer = document.getElementById("timer-teks");
    
    if (elemenTimer) {
        elemenTimer.innerText = "Time Left: " + sisaWaktu + "s";
        elemenTimer.parentNode.style.borderColor = "#ced6e0"; // Reset warna border capsule
        elemenTimer.parentNode.style.background = "#f1f2f6";
        elemenTimer.style.color = "#57606f"; 
    }

    waktuMundur = setInterval(() => {
        sisaWaktu--;
        if (elemenTimer) {
            elemenTimer.innerText = "Time Left: " + sisaWaktu + "s";
            
            if (sisaWaktu <= 5) {
                elemenTimer.style.color = "#ff4757"; 
                elemenTimer.parentNode.style.borderColor = "#ff4757"; // Border capsule ikut merah biar makin panik kuisnya
                elemenTimer.parentNode.style.background = "#ffeaeaea";
            }
        }

        if (sisaWaktu <= 0) {
            clearInterval(waktuMundur);
            waktuHabisOtomatis(); 
        }
    }, 1000);
}

// AUTOMATIC TRANSITION WHEN TIME IS UP
function waktuHabisOtomatis() {
    let soalAktif = daftarSoal[indeksSekarang];
    
    for (let i = 0; i < 4; i++) {
        let tombol = document.getElementById("opsi" + i);
        if (tombol) tombol.disabled = true;
    }

    let tombolBenar = document.getElementById("opsi" + soalAktif.jawabanBenar);
    if (tombolBenar) {
        tombolBenar.style.backgroundColor = "#d4edda";
        tombolBenar.style.borderColor = "#c3e6cb";
        tombolBenar.style.color = "#155724";
    }

    let elemenTimer = document.getElementById("timer-teks");
    if (elemenTimer) {
        elemenTimer.innerText = "Time's Up! ⏰";
    }

    setTimeout(() => {
        pertanyaanSelanjutnya();
    }, 2000);
}

function pilihJawaban(indeksDipilih) {
    clearInterval(waktuMundur); 

    let soalAktif = daftarSoal[indeksSekarang];
    
    for (let i = 0; i < 4; i++) {
        let tombol = document.getElementById("opsi" + i);
        if (tombol) tombol.disabled = true;
    }

    let tombolUser = document.getElementById("opsi" + indeksDipilih);
    let tombolBenar = document.getElementById("opsi" + soalAktif.jawabanBenar);

    if (indeksDipilih === soalAktif.jawabanBenar) {
        if (tombolUser) {
            tombolUser.style.backgroundColor = "#d4edda";
            tombolUser.style.borderColor = "#c3e6cb";
            tombolUser.style.color = "#155724";
        }
        skor += 10; // Skor bertambah di sistem saja, tidak dicetak di kuis utama
    } else {
        if (tombolUser) {
            tombolUser.style.backgroundColor = "#f8d7da";
            tombolUser.style.borderColor = "#f5c6cb";
            tombolUser.style.color = "#721c24";
        }
        
        if (tombolBenar) {
            tombolBenar.style.backgroundColor = "#d4edda";
            tombolBenar.style.borderColor = "#c3e6cb";
            tombolBenar.style.color = "#155724";
        }
    }

    document.getElementById("btn-next").style.display = "block";
}

function pertanyaanSelanjutnya() {
    indeksSekarang++;

    if (indeksSekarang < daftarSoal.length) {
        tampilkanSoal();
    } else {
        tampilkanHalamanHasil();
    }
}

function tampilkanHalamanHasil() {
    clearInterval(waktuMundur); 
    
    document.getElementById("halaman-kuis").style.display = "none";
    document.getElementById("halaman-hasil").style.display = "block";

    let elemenVisual = document.getElementById("reward-visual");
    let elemenPesan = document.getElementById("pesan-reward");

    document.getElementById("nama-pemenang").innerText = nickname;
    document.getElementById("skor-akhir").innerText = skor; // Skor ditampilkan di sini

    if (skor === 100) {
        if (elemenVisual) elemenVisual.innerText = "🏆"; 
        if (elemenPesan) elemenPesan.innerText = "Perfect Score! You absolutely dominated this quiz!";
    } else if (skor >= 70) {
        if (elemenVisual) elemenVisual.innerText = "🌟"; 
        if (elemenPesan) elemenPesan.innerText = "Great job! You have an excellent understanding of English!";
    } else if (skor === 60) {
        if (elemenVisual) elemenVisual.innerText = "👍"; 
        if (elemenPesan) elemenPesan.innerText = "You passed! Good effort, keep improving!";
    } else {
        if (elemenVisual) elemenVisual.innerText = "💪"; 
        if (elemenPesan) elemenPesan.innerText = "Don't be discouraged! Every mistake is a lesson. Try again!";
    }

    // SAVE DATA TO FIREBASE REALTIME DATABASE
    database.ref('skor_kuis/' + nickname).set({
        name: nickname,
        score: skor,
        completedAt: new Date().toLocaleString()
    }).then(() => {
        console.log("Score data successfully saved to Firebase!");
        // Ambil data papan peringkat terbaru setelah skor sukses terunggah
        ambilDataLeaderboard();
    }).catch((error) => {
        console.error("Failed to save data to Firebase: ", error);
        // Tetap coba muat papan peringkat walau proses upload gagal
        ambilDataLeaderboard();
    });
}

// 3. FUNGSI DINAMIS UNTUK ME-LOAD DATA JUARA (MAX TOP 3 - MENYESUAIKAN JUMLAH PEMAIN)
function ambilDataLeaderboard() {
    // Membatasi query maksimal hanya mengambil 3 data dengan skor tertinggi
    database.ref('skor_kuis').orderByChild('score').limitToLast(3).once('value', (snapshot) => {
        let listPemain = [];
        
        snapshot.forEach((childSnapshot) => {
            listPemain.push(childSnapshot.val());
        });
        
        // Membalik data dari Firebase supaya skor terbesar langsung bertengger di paling atas
        listPemain.reverse();
        
        let elemenKonten = document.getElementById("konten-leaderboard");
        if (!elemenKonten) return;
        
        // Jika data di Firebase kosong total
        if (listPemain.length === 0) {
            elemenKonten.innerHTML = `<h3 style="margin-top: 0; margin-bottom: 12px; font-family: 'Fredoka One', sans-serif; color: #2f3542; font-size: 18px;">🏆 LEADERBOARD</h3>
                                      <div style="font-style: italic; color: #a4b0be; font-size: 14px;">No records found yet.</div>`;
            return;
        }
        
        // Membuat teks judul dinamis menyesuaikan total orang yang bermain (Contoh: TOP 1, TOP 2, atau TOP 3)
        let totalPemainMaksimal = listPemain.length;
        let judulDinamis = "🏆 TOP " + totalPemainMaksimal + " LEADERBOARD";
        
        // Mulai merakit susunan struktur tabel HTML dari nol secara dinamis
        let htmlHasilStruktur = `<h3 style="margin-top: 0; margin-bottom: 12px; font-family: 'Fredoka One', sans-serif; color: #2f3542; font-size: 18px;">${judulDinamis}</h3>`;
        htmlHasilStruktur += `<table style="width: 100%; border-collapse: collapse; text-align: left;">
                                <thead>
                                    <tr style="border-bottom: 2px solid #ced6e0; color: #747d8c; font-size: 13px;">
                                        <th style="padding: 6px 4px; width: 20%;">Rank</th>
                                        <th style="padding: 6px 4px; width: 55%;">Name</th>
                                        <th style="padding: 6px 4px; width: 25%; text-align: right;">Score</th>
                                    </tr>
                                </thead>
                                <tbody style="font-size: 15px; font-weight: 700; color: #2f3542;">`;
        
        // Hanya membuat baris berdasarkan data yang BENAR-BENAR ADA di dalam database
        listPemain.forEach((pemain, indeks) => {
            let peringkat = indeks + 1;
            let lambangPeringkat = peringkat;
            
            // Mengubah teks angka urutan ranking 1, 2, dan 3 menjadi ikon emoji medali podium
            if (peringkat === 1) lambangPeringkat = "🥇";
            else if (peringkat === 2) lambangPeringkat = "🥈";
            else if (peringkat === 3) lambangPeringkat = "🥉";
            
            // Memberi efek baris warna kuning jika baris tersebut adalah milik pemain yang sedang aktif
            let gayaHighlight = pemain.name === nickname ? "background-color: #ffeaa7; border-radius: 8px;" : "";
            
            htmlHasilStruktur += `<tr style="${gayaHighlight}">
                                    <td style="padding: 8px 4px; font-size: 16px;">${lambangPeringkat}</td>
                                    <td style="padding: 8px 4px; color: #2f3542;">${pemain.name}</td>
                                    <td style="padding: 8px 4px; text-align: right; color: #2ed573;">${pemain.score}</td>
                                  </tr>`;
        });
        
        // Menutup tag elemen penulisan tabel kuis secara valid
        htmlHasilStruktur += `</tbody></table>`;
        
        // Menyuntikkan seluruh kode rakitan ke dalam container utama di index.html
        elemenKonten.innerHTML = htmlHasilStruktur;
        
    }, (error) => {
        let elemenKonten = document.getElementById("konten-leaderboard");
        if (elemenKonten) {
            elemenKonten.innerHTML = `<div style="color: #ff4757; font-weight: bold;">Failed to load leaderboard data.</div>`;
        }
        console.error("Firebase Realtime Read Error: ", error);
    });
}

function ulangiKuis() {
    clearInterval(waktuMundur);
    clearInterval(intervalTimer);
    indeksSekarang = 0;
    skor = 0;
    
    // Reset kondisi visual komponen wadah leaderboard ke status loading awal
    let elemenKonten = document.getElementById("konten-leaderboard");
    if (elemenKonten) {
        elemenKonten.innerHTML = `<div id="loading-leaderboard" style="font-style: italic; color: #a4b0be; font-size: 14px;">Loading rankings...</div>`;
    }
    
    document.getElementById("input-nama").value = "";
    document.getElementById("peringatan-nama").style.display = "none";
    document.getElementById("halaman-hasil").style.display = "none";
    document.getElementById("halaman-welcome").style.display = "block";
}