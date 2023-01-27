import dotenv from 'dotenv';
import Path from 'path';
const path = Path.resolve("../env/.env");
const options = {
    path: __dirname + path, 
}
const config = dotenv.config(options);
console.log("dev config", config);

const localLogin = "https://mytechsoles.com:34349/login";

module.exports = {localLogin};