async function renderPosts() {
	try {
		const res = await fetch("/api/posts");
		if (!res.ok) {
			throw new Error("Network response was not ok " + res.statusText);
		}
		const data = await res.json();
		const posts = data.posts;

		let totalPosts = posts.length;

		// Step 3 & 4: Create new HTML elements and append to #feed
		posts.forEach((post) => {
			const postElement = document.createElement("div");
			postElement.classList.add("post");

			const headerElement = document.createElement("div");
			headerElement.classList.add("header");

			const titleElement = document.createElement("h3");
			titleElement.textContent = post.title;
			headerElement.appendChild(titleElement);

			const dateElement = document.createElement("p");
			dateElement.textContent = post.date;
			headerElement.appendChild(dateElement);

			postElement.appendChild(headerElement);

			const imgElement = document.createElement("img");
			imgElement.src = post.image.startsWith("http")
				? post.image
				: `../memes/${post.image}`;
			imgElement.alt = "";
			postElement.appendChild(imgElement);

			const footerElement = document.createElement("div");
			footerElement.classList.add("footer");

			const commentElement = document.createElement("p");
			commentElement.textContent = post.comment;
			footerElement.appendChild(commentElement);

			const hashtagsElement = document.createElement("p");
			hashtagsElement.textContent = post.hashtags.join(" ");
			footerElement.appendChild(hashtagsElement);

			postElement.appendChild(footerElement);

			document.querySelector("#feed").appendChild(postElement);
		});

		// Step 5: Display total number of posts in the footer
		document.querySelector(
			"#post-count"
		).textContent = `Total posts: ${totalPosts}`;
	} catch (err) {
		console.error("Failed to fetch posts:", err);
	}
}

renderPosts();
