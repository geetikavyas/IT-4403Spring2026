const results = document.getElementById("results");

// 🔹 Replace these with YOUR real Volume IDs
const volumeIDs = [
  "7z60DwAAQBAJ",
  "m8dPPgAACAAJ",
  "OEBPSW_ABC12"
];

volumeIDs.forEach(id => {
  fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
    .then(response => response.json())
    .then(data => {
      const info = data.volumeInfo;

      const title = info.title || "No title";
      const authors = info.authors ? info.authors.join(", ") : "Unknown Author";
      const date = info.publishedDate || "Unknown date";
      const image = info.imageLinks?.thumbnail || "";

      const div = document.createElement("div");
      div.className = "book";

      div.innerHTML = `
        <h3>${title}</h3>
        <p><strong>Author:</strong> ${authors}</p>
        <p><strong>Published:</strong> ${date}</p>
        ${image ? `<img src="${image}" alt="Book cover">` : ""}
      `;

      results.appendChild(div);
    })
    .catch(error => {
      console.error("Error loading book:", error);
    });
});
