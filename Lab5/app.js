const results = document.getElementById("results");

fetch("https://www.googleapis.com/books/v1/volumes?q=data+analysis&maxResults=10")
  .then(response => response.json())
  .then(data => {
    data.items.forEach(item => {
      const book = document.createElement("div");

      const title = item.volumeInfo.title;
      const authors = item.volumeInfo.authors
        ? item.volumeInfo.authors.join(", ")
        : "Unknown Author";

      book.innerHTML = `
        <h3>${title}</h3>
        <p>Author: ${authors}</p>
      `;

      results.appendChild(book);
    });
  })
  .catch(error => {
    results.innerHTML = "Error loading books.";
    console.error(error);
  });