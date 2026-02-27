// Google Books API Key

const apiKey = "AIzaSyCIXZssIic1z2odLF_9gmFZI7bklRUFZ98";

const volumeIds = [
  "fnmwBgAAQBAJ",
  "sXMYAAAAIAAJ",
  "vJkF6-ZyxsEC",
  "wP5E_K8sFbMC"
];

const container = document.getElementById("books");

async function loadBooks() {
  container.innerHTML = "";

  for (let id of volumeIds) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`
      );

      const data = await response.json();

      const title = data.volumeInfo?.title || "No Title";
      const authors = data.volumeInfo?.authors
        ? data.volumeInfo.authors.join(", ")
        : "Unknown Author";
      const published = data.volumeInfo?.publishedDate || "N/A";
      const thumbnail = data.volumeInfo?.imageLinks?.thumbnail || "";

      container.innerHTML += `
        <div style="border:1px solid #ccc; margin:10px; padding:10px;">
          ${thumbnail ? `<img src="${thumbnail}" width="100"><br>` : ""}
          <strong>${title}</strong><br>
          ${authors}<br>
          ${published}<br>
          <a href="details.html?id=${id}">View Details</a>
        </div>
      `;
    } catch (error) {
      console.error("Error loading book:", id, error);
    }
  }
}

loadBooks();
