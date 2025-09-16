import path from "path"
import fsp from "fs/promises"
import fs from "fs"

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const playlistCreate = async (name, dec) => {

    // console.log(path.join(__dirname,"../song_db/songs",name))

    const data = {
        "title": name,
        "Description": dec
    }

    if (fs.existsSync(path.join(__dirname, "../song_db/songs", name))) {
        console.log("repete")
        return 0;
    } 
    else 
    {
        // console.log(path.join(__dirname, "../song_db/songs", name))
        await fsp.mkdir(path.join(__dirname, "../song_db/songs", name), { recursive: true })
        await fsp.appendFile(path.join(__dirname, "../song_db/songs", name, "info.json"), JSON.stringify(data))

        //Replace logic 
        const files = await fsp.readdir(path.join(__dirname, "../uploads"))

        for (let index = 0; index < files.length; index++) {
            const ele = files[index];
            console.log(path.join(__dirname, "../uploads", ele))
            console.log(path.join(__dirname, "../song_db/songs", name, ele))
            await fsp.rename(path.join(__dirname, "../uploads", ele), path.join(__dirname, "../song_db/songs", name, ele))
        }

        // console.log("created")

    }
}

export default playlistCreate;