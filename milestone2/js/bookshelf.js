const apiKey = "AIzaSyCIXZssIic1z2odLF_9gmFZI7bklRUFZ98";

const volumeIds = [
  "fnmwBgAAQBAJ",
  "sXMYAAAAIAAJ",
  "vJkF6-ZyxsEC",
  "wP5E_K8sFbMC"
];

const container = document.getElementById("books");
container.innerHTML = "Loading...";

async function loadBooks() {
  container.innerHTML = "";

  for (const id of volumeIds) {
    const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`;

    try {
      const res = await fetch(url);

      // If Google returns 403/400 etc, show it clearly
      if (!res.ok) {
        const text = await res.text();
        container.innerHTML += `
          <div style="border:1px solid red; padding:10px; margin:10px;">
            <strong>Failed for ID:</strong> ${id}<br>
            <strong>Status:</strong> ${res.status}<br>
            <pre style="white-space:pre-wrap;">${text}</pre>
          </div>
        `;
        continue;
      }

      const data = await res.json();
      const info = data.volumeInfo || {};

      const title = info.title || "No Title";
      const authors = info.authors ? info.authors.join(", ") : "Unknown Author";
      const published = info.publishedDate || "N/A";
      const thumb = info.imageLinks?.thumbnail || "";

      container.innerHTML += `
        <div style="border:1px solid #ccc; padding:10px; margin:10px;">
          ${thumb ? `<img src="${thumb}" width="100"><br>` : ""}
          <strong>${title}</strong><br>
          ${authors}<br>
          ${published}<br>
          <a href="details.html?id=${id}">View Details</a>
        </div>
      `;

    } catch (err) {
      container.innerHTML += `
        <div style="border:1px solid red; padding:10px; margin:10px;">
          <strong>Network/Error for ID:</strong> ${id}<br>
          <pre style="white-space:pre-wrap;">${err.message}</pre>
        </div>
      `;
    }
  }
}

loadBooks();
