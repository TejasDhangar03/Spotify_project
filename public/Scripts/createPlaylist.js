homee.addEventListener("click", () => {
    window.location.href = "/te";
});

document.getElementById("playlist").addEventListener("submit", async (e) => {
    e.preventDefault();
    const playlistName = document.getElementById("playlistName")
    const dec = document.getElementById("dec")
    const coverpage = document.getElementById("CoverPage")
    const songs = document.getElementById("Songs")

    if (!playlistName.value.trim() || !dec.value.trim() || coverpage.files.length === 0 || songs.files.length === 0) {
        alert("All fields are required: name, description, cover page, and at least one song!");
    }
    else {



        const data = new FormData(e.target)

        const res = await fetch("http://192.168.1.36:3000/protected", {
            method: "POST",
            headers: {
                "authorization": "Bearer " + localStorage.getItem('token')
            },
            body: data
        })

        const r = await res.json()
        console.log(r)
        if (res.status != 401) {
            alert("Playlist Created")
            window.location.href = "/te"
        } else {
            alert("Invalid Error!!!")
        }
    }

})