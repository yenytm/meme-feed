"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
function getPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs_1.default.readdir("posts", (err, files) => {
                if (err) {
                    return reject("Unable to read files: " + err);
                }
                let totalPosts = [];
                files.forEach((file, index) => {
                    if (path_1.default.extname(file) === ".json") {
                        fs_1.default.readFile(path_1.default.join("posts", file), "utf8", (err, data) => {
                            if (err) {
                                return reject("Unable to read file: " + err);
                            }
                            const posts = JSON.parse(data);
                            totalPosts = totalPosts.concat(posts);
                            if (index === files.length - 1) {
                                resolve(totalPosts);
                            }
                        });
                    }
                });
            });
        });
    });
}
const server = http_1.default.createServer((req, res) => {
    var _a;
    const pathname = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "", `http://${req.headers.host}`)
        .pathname;
    if (pathname === "/api/posts") {
        return getPosts()
            .then((posts) => {
            res.writeHead(200, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            });
            res.end(JSON.stringify({ posts }));
        })
            .catch((err) => {
            res.writeHead(500, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            });
            res.end(JSON.stringify({ error: err }));
        });
    }
    // Handle other routes
    if (pathname.endsWith("/")) {
        const filePath = path_1.default.join(__dirname, "index.html");
        fs_1.default.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error loading index.html");
            }
            res.writeHead(200, {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*",
            });
            res.end(data);
        });
    }
    else {
        const filePath = path_1.default.join(__dirname, pathname.slice(1));
        fs_1.default.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Not found");
            }
            const ext = path_1.default.extname(filePath).toLowerCase();
            let contentType = "text/plain";
            if (ext === ".html" || ext === ".htm") {
                contentType = "text/html";
            }
            else if (ext === ".css") {
                contentType = "text/css";
            }
            else if (ext === ".js") {
                contentType = "application/javascript";
            }
            else if (ext === ".json") {
                contentType = "application/json";
            } // add more extensions and MIME types as needed
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        });
    }
});
server.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
});
