function randomNameGenerator() {
  const names = [
    "John",
    "Jane",
    "Bob",
    "Alice",
    "Charlie",
    "Dave",
    "Eve",
    "Frank",
    "Grace",
    "Henry",
  ];
  return names[Math.floor(Math.random() * names.length)];
}

async function fetchPosts() {
  try {
    const response = await fetch("/api/posts");
    const posts = await response.json();
    displayPosts(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

function displayPosts(posts) {
  const feedContainer = document.getElementById("feed-container");
  feedContainer.innerHTML = posts.map(formatPost).join("");
}

function formatPost(post) {
  const postContainer = document.createElement("div");
  postContainer.classList.add("post-container");

  const titleElement = document.createElement("strong");
  titleElement.textContent = post.user;
  //   console.log("post data: ", post);

  const dateTimeElement = document.createElement("span");
  dateTimeElement.classList.add("created-datetime");
  const dateObj = new Date(post.timestamp);
  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const date = dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  dateTimeElement.textContent = `${date + " at " + time}`;

  const postTextElement = document.createElement("div");
  postTextElement.textContent = post.text;

  const titleContainer = document.createElement("div");
  titleContainer.classList.add("title-container");

  titleContainer.appendChild(titleElement);
  titleContainer.appendChild(dateTimeElement);

  postContainer.appendChild(titleContainer);
  postContainer.appendChild(postTextElement);

  return postContainer.outerHTML;
}

async function submitPost(postText) {
  try {
    await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: randomNameGenerator(),
        text: postText,
      }),
    });
  } catch (error) {
    console.error("Error submitting post:", error);
  }
}

document
  .getElementById("post-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const postInput = document.getElementById("post-input");
    const postText = postInput.value.trim();
    if (postText !== "") {
      await submitPost(postText);
      postInput.value = "";
    }
  });

// Poll for new posts every 4 seconds - short polling example
setInterval(fetchPosts, 4000);

// Fetch posts initially when the page loads
fetchPosts();
