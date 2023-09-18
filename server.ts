import fs from "fs";
import path from "path";
import http from "http";

async function getPosts() {
	return new Promise((resolve, reject) => {
		fs.readdir("posts", (err, files) => {
			if (err) {
				return reject("Unable to read files: " + err);
			}

			let totalPosts = [];

			files.forEach((file, index) => {
				if (path.extname(file) === ".json") {
					fs.readFile(
						path.join("posts", file),
						"utf8",
						(err, data) => {
							if (err) {
								return reject("Unable to read file: " + err);
							}

							const posts = JSON.parse(data);
							totalPosts = totalPosts.concat(posts);

							if (index === files.length - 1) {
								resolve(totalPosts);
							}
						}
					);
				}
			});
		});
	});
}

const server = http.createServer((req, res) => {
	const pathname = new URL(req.url ?? "", `http://${req.headers.host}`)
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
		const filePath = path.join(__dirname, "index.html");
		fs.readFile(filePath, (err, data) => {
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
	} else {
		const filePath = path.join(__dirname, pathname.slice(1));
		fs.readFile(filePath, (err, data) => {
			if (err) {
				res.writeHead(404);
				return res.end("Not found");
			}

			const ext = path.extname(filePath).toLowerCase();
			let contentType = "text/plain";
			if (ext === ".html" || ext === ".htm") {
				contentType = "text/html";
			} else if (ext === ".css") {
				contentType = "text/css";
			} else if (ext === ".js") {
				contentType = "application/javascript";
			} else if (ext === ".json") {
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
