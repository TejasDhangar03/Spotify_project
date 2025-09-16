// console.log("script.js loaded");
let host = "https://spotify-project-7f8n.onrender.com/public/"
let currentSong = new Audio();
let songs;
let currFolder;
let globalSongList;

async function getSongs(folder) {
    // Fetch the songs from the server
    currFolder = folder;
    let a = await fetch(`${host}${folder}/`);
    let response = await a.text();

    //creating div to fetch all a tags links
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    // Create an array to hold the song links
    songs = []

    // Loop through the <a> elements and check if the href ends with .mp3
    for (let i = 0; i < as.length; i++) {
        let element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURI(element.href.split(`${currFolder}/`)[1]));
        }
    }

    console.log(songs)


    let songUL = document.querySelector(".songsList").getElementsByTagName("ol")[0];
    songUL.innerHTML = "";

    // Loop through the songs array and create list items for each song
    for (const song of songs) {
        let songia = decodeURI(song).replace(".mp3", "").split("-")

        songUL.innerHTML += `
            <li>
                <img class="invert" src="/imgs/music.svg" alt="">
                <div class="info">
                    <div class="songName">
                        ${decodeURI(song)}
                    </div>
                    <div class="artistName">
                        ${songia[1]}
                    </div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="/imgs/play.svg" alt="">
                </div>

            </li>
        `;


    }
    //adding or attaching event listeners to each songs form list
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            console.log(e.querySelector(".info").firstElementChild.innerText);
            playMusic(e.querySelector(".info").firstElementChild.innerText)
        });
    });

    globalSongList = songs;

}

//dispplay dynamic albums


// Function to play a song given its track name
// The track name should match the file name of the song
const playMusic = (track, paused = false) => {
    console.log(track)

    currentSong.src = `${host}${currFolder}/` + track
    console.log(`${currFolder}/` + track)
    // console.log(host+currFolder+"/"+decodeURI(currentSong.src.split(`${currFolder}/`)[1].trim()))
    console.log(currentSong.src)
    if (!paused) {
        play.src = "/imgs/pause.svg";
        currentSong.play();
    }
    document.querySelector(".songinfo").innerText = decodeURI(track).replace(".mp3", "");
    document.querySelector(".songtime").innerText = "00:00 / 00:00";
}

// Function to convert seconds to minutes and seconds format tofixed(0)after decimal
const secToMin = (seconds) => {
    if (seconds < 0 || isNaN(seconds)) {
        return "00:00";
    }
    let min = Math.floor(seconds / 60);
    let sec = (seconds % 60).toFixed(0);
    return min + ":" + (sec < 10 ? "0" + sec : sec);
}

async function displayAlbums() {
    let b = await fetch(`${host}songs/`);
    console.log(`${host}songs/`)
    let response1 = await b.text();
    //creating div to fetch all a tags links
    let div1 = document.createElement("div");
    div1.innerHTML = response1;
    let anchors = div1.getElementsByTagName("a");
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            let album = e.href.split("/").slice(-1)[0]
            //get metadata of folder
            console.log(e.href.split("/").slice(-1)[0])
            let b = await fetch(`${host}songs/${album}/info.json`);
            let response1 = await b.json();
            document.querySelector(".cardContainer").innerHTML = document.querySelector(".cardContainer").innerHTML +
                `<div data-folder="${album}" class="card car">
                            <div class="play">
                                <svg viewBox="0 0 24 24" fill="#000000"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
                                        stroke-linejoin="round" />
                                </svg>
                            </div>
                            <img src="${host}songs/${album}/cover.png"
                                alt="Happy Hits">
                            <h2>${response1.title}</h2>
                            <p>${response1.Description}</p>
                        </div>`
        }
    }
    //handeling the playlists
    Array.from(document.getElementsByClassName("car")).forEach((e) => {
        e.addEventListener("click", async (item) => {
            console.log(item.currentTarget.dataset.folder)
            console.log(`songs/${item.currentTarget.dataset.folder}`)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })

}
async function main() {

    // Fetch the songs and log them to the console
    await getSongs("/songs/bolly");

    //loading song 1 in list
    playMusic(songs[0], true)

    //dynamic albums
    displayAlbums()

    // Get the unordered list element where the songs will be displayed

    //adding or attaching event listeners to each songs form list
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/imgs/pause.svg";
        } else {
            currentSong.pause();
            play.src = "/imgs/play.svg";
        }
    });

    //listing timeupdate event to upadate song time
    currentSong.addEventListener("timeupdate", () => {
        //upadte current time of song and duration which is fixed
        document.querySelector(".songtime").innerText = `${secToMin(currentSong.currentTime)}  / ${secToMin(currentSong.duration)}`;
        // console.log(`${secToMin(currentSong.currentTime)}:${secToMin(currentSong.duration)}`);
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    //listing or tracking sekkbar circle
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // e.offsetx means current location and getboundingclient rect().width means total width of seekbar x is X not small
        let percent = (e.offsetX / document.querySelector(".seekbar").getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    //adding hamburger click functionality
    document.querySelector(".ham").addEventListener("click", () => {
        document.querySelector(".left").style.left = -1 + "%";
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = -135 + "%";
    });

    //adding event for previous and next song
    previous.addEventListener("click", () => {
        let index = globalSongList.indexOf(decodeURI(decodeURI(currentSong.src.split(`${currFolder}/`)[1])))
        console.log(globalSongList.indexOf(decodeURI(decodeURI(currentSong.src.split(`${currFolder}/`)[1]))))

        if (index - 1 >= 0) {
            playMusic(globalSongList[index - 1]);
        }
        console.log();
    });
    next.addEventListener("click", () => {
        console.log("next song");
        let index = globalSongList.indexOf(decodeURI(decodeURI(currentSong.src.split(`${currFolder}/`)[1])))

        if (index + 1 <= (globalSongList.length - 1)) {
            playMusic(globalSongList[index + 1]);
        }
        // console.log(songs[index+1]);
    });

    //handeling volume event suing change 
    volume.addEventListener("change", (e) => {
        console.log(e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume img").src = document.querySelector(".volume img").src.replace("/imgs/mute.svg", "/imgs/vol.svg")
        }
        else if (currentSong.volume <= 0) {
            document.querySelector(".volume img").src = document.querySelector(".volume img").src.replace("/imgs/vol.svg", "/imgs/mute.svg")
        }
    })

    //adding event lister to the mute
    document.querySelector(".volume img").addEventListener("click", (e) => {
        if (e.target.src.includes("/imgs/vol.svg")) {
            currentSong.volume = 0.0;
            volume.value = 0.0
            e.target.src = e.target.src.replace("/imgs/vol.svg", "/imgs/mute.svg")
        } else if (e.target.src.includes("mute.svg")) {
            currentSong.volume = 0.5;
            e.target.src = e.target.src.replace("/imgs/mute.svg", "/imgs/vol.svg")
            volume.value = 50
        }
    })
    //playing next song after finished current song
    // currentSong.addEventListener("ended", () => {
    //     let index = globalSongList.indexOf(decodeURI(decodeURI(currentSong.src.split(`${currFolder}/`)[1])))
    //     console.log(globalSongList.indexOf(decodeURI(decodeURI(currentSong.src.split(`${currFolder}/`)[1]))))           
    //     currentIndex = (index + 1) % globalSongList.length; // loops back
    //     playMusic(globalSongList[currentIndex]);
    // });

    let val = false;
    currentSong.addEventListener("ended", () => {
        play.src = "./imgs/play.svg";
        if (val == true) {
            val2 = false;

            suffle.src = "./imgs/suffle.svg";

            let index = globalSongList.indexOf(decodeURI(decodeURI(currentSong.src.split(`${currFolder}/`)[1])))
            console.log(globalSongList.indexOf(decodeURI(decodeURI(currentSong.src.split(`${currFolder}/`)[1]))))
            currentIndex = (index)
            playMusic(globalSongList[currentIndex]);
            console.log("ended")
        }
        play.src = "./imgs/play.svg";

        if (val2 == true) {
            val = false;
            repeat.src = "./imgs/repeat.svg";
            let index = Math.floor(Math.random() * ((globalSongList.length - 1) - 0 + 1)) + 0;
            playMusic(globalSongList[index]);
        }


    });

    currentSong.addEventListener("playing", () => {
        play.src = "./imgs/pause.svg";
        console.log("playing")
    });

    repeat.addEventListener("click", () => {
        if (val == false) {
            val = true;
            repeat.src = "./imgs/repeaton.svg";
            console.log("repeat on")
        }
        else {
            val = false;
            repeat.src = "./imgs/repeat.svg";
            console.log("repeat off")
        }
    });

    let val2 = false;
    suffle.addEventListener("click", () => {
        if (val2 == false) {
            val2 = true
            suffle.src = "./imgs/suffleon.svg";
        } else {
            val2 = false
            suffle.src = "./imgs/suffle.svg";
        }
    });

    logoutt.addEventListener("click", () => {
        if (confirm("Are you sure you want to log out?")) {
            window.location.href = "login.html";
        }
    });
    createplaylist.addEventListener("click", async (e) => {
        if (confirm("Are you sure you want to Create PLaylist?")) {
            window.location.href = "/createPlaylist";
        }
    })




}
main()
