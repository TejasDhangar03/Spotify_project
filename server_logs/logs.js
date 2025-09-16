import fs from "fs/promises";
import path from "path"
import { fileURLToPath } from "url";
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logging=async function(data){
    try{
        await fs.appendFile(path.join(__dirname,"logs.text"),data+"\n");
    }
    catch(err){
        console.log("Error logging data");
    }
}
export default logging;