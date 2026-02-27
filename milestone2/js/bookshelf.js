// Google Books API Key
const apiKey = "AIzaSyCIXZssIic1z2odLF_9gmFZI7bklRUFZ98";

// Volume IDs
const volumeIds = [
  "fnmwBgAAQBAJ",
  "sXMYAAAAIAAJ",
  "vJkF6-ZyxsEC",
  "wP5E_K8sFbMC"
];

const container = document.getElementById("books");
container.innerHTML = "Loading your bookshelf...";

async function loadBooks() {
  container.innerHTML = "";

  for (const id of volumeIds) {
    try {
      const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const info = data.volumeInfo || {};

      const title = info.title || "Untitled";
      const authors = info.authors ? info.authors.join(", ") : "Unknown Author";
      const publishedDate = info.publishedDate || "N/A";
      const thumb = info.imageLinks?.thumbnail || "";

      container.innerHTML += `
        <div style="border:1px solid #ccc; padding:10px; margin:10px;">
          ${thumb ? `<img src="${thumb}" alt="${title}" width="100"><br>` : ""}
          <strong>${title}</strong><br>
          ${authors}<br>
          ${publishedDate}<br>
          <a href="details.html?id=${id}">View Details</a>
        </div>
      `;
    } catch (err) {
      console.error("Error loading book", id, err);
      container.innerHTML += `
        <div style="border:1px solid #f99; padding:10px; margin:10px;">
          Could not load book: ${id}
        </div>
      `;
    }
  }
}

loadBooks();
