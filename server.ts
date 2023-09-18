import fs from "node:fs";
import path from "node:path";

async function getPosts() {
	return new Promise((resolve, reject) => {
		fs.readdir("posts", (err, files) => {
			if (err) {
				return reject("Unable to read files: " + err);
			}

			let totalPosts: any[] = [];

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

const server = Bun.serve({
	port: 3000,
	fetch(req) {
		const pathname = new URL(req.url).pathname;

		if (pathname === "/api/posts") {
			return getPosts()
				.then(
					(posts) =>
						new Response(JSON.stringify({ posts }), {
							headers: {
								"Content-Type": "application/json",
								"Access-Control-Allow-Origin": "*",
							},
						})
				)
				.catch(
					(err) =>
						new Response(JSON.stringify({ error: err }), {
							status: 500,
							headers: {
								"Content-Type": "application/json",
								"Access-Control-Allow-Origin": "*",
							},
						})
				);
		}

		// Handle other routes as you were before
		if (req.url.endsWith("/")) {
			const path = "./index.html";
			const file = Bun.file(path);
			return new Response(file, {
				headers: {
					"content-type": "text/html",
					"Access-Control-Allow-Origin": "*",
				},
			});
		} else {
			const path = `.${pathname}`;
			const file = Bun.file(path);
			return new Response(file);
		}
	},
});

console.log("Listening on http://localhost:3000");
