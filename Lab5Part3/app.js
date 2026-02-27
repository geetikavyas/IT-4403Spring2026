const results = document.getElementById("results");

const API_KEY = "AIzaSyDVf75MgxioDkvXiF5pq5JjPEJctEb9ONY";  // use your key

const volumeIDs = [
  "vJkF6-ZyxsEC",
  "wP5E_K8sFbMC",
  "fnmwBgAAQBAJ"
];

function showBook(info) {
  const title = info.title || "No title";
  const authors = info.authors ? info.authors.join(", ") : "Unknown Author";
  const date = info.publishedDate || "Unknown date";
  const image = info.imageLinks && info.imageLinks.thumbnail ? info.imageLinks.thumbnail : "";

  const div = document.createElement("div");
  div.className = "book";
  div.innerHTML = `
    <h3>${title}</h3>
    <p><strong>Author(s):</strong> ${authors}</p>
    <p><strong>Published:</strong> ${date}</p>
    ${image ? `<img src="${image}" alt="Cover image for ${title}">` : ""}
  `;
  results.appendChild(div);
}

async function loadBooks() {
  results.innerHTML = "";

  for (let i = 0; i < volumeIDs.length; i++) {
    const id = volumeIDs[i];

    try {
      const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`;
      const res = await fetch(url);

      // Handle rate limit / bad responses
      if (!res.ok) {
        const div = document.createElement("div");
        div.className = "book";
        div.innerHTML = `<h3>${id}</h3><p>Error: API returned ${res.status}. Try again later.</p>`;
        results.appendChild(div);

        // if 429, stop further calls to avoid spamming
        if (res.status === 429) break;

        continue;
      }

      const data = await res.json();

      // If volumeInfo is missing, show a friendly message
      if (!data.volumeInfo) {
        const div = document.createElement("div");
        div.className = "book";
        div.innerHTML = `<h3>${id}</h3><p>No volumeInfo returned.</p>`;
        results.appendChild(div);
        continue;
      }

      showBook(data.volumeInfo);

      // small delay to reduce 429 risk
      await new Promise(r => setTimeout(r, 250));

    } catch (err) {
      const div = document.createElement("div");
      div.className = "book";
      div.innerHTML = `<h3>${id}</h3><p>Error loading book.</p>`;
      results.appendChild(div);
      console.error(err);
    }
  }
}

loadBooks();
