const results = document.getElementById("results");

const API_KEY = "AIzaSyDVf75MgxioDkvXiF5pq5JjPEJctEb9ONY";

fetch(`https://www.googleapis.com/books/v1/volumes?q=data+analysis&maxResults=10&key=${API_KEY}`)
  .then(response => {
    if (!response.ok) {
      throw new Error("API error: " + response.status);
    }
    return response.json();
  })
  .then(data => {
    results.innerHTML = "";

    if (!data.items) {
      results.innerHTML = "No books found.";
      return;
    }

    data.items.forEach(item => {
      const title = item.volumeInfo.title || "No title";
      const authors = item.volumeInfo.authors
        ? item.volumeInfo.authors.join(", ")
        : "Unknown Author";

      const div = document.createElement("div");
      div.className = "book";
      div.innerHTML = `
        <h3>${title}</h3>
        <p>Author: ${authors}</p>
      `;
      results.appendChild(div);
    });
  })
  .catch(error => {
    console.error(error);
    results.innerHTML = "Error loading books.";
  });
