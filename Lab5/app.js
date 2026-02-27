const results = document.getElementById("results");

fetch("https://www.googleapis.com/books/v1/volumes?q=data+analysis&maxResults=10")
  .then(response => {
    if (!response.ok) {
      throw new Error("API request failed with status " + response.status);
    }
    return response.json();
  })
  .then(data => {
    results.innerHTML = "";

    if (!data.items) {
      results.innerHTML = "No books found or API limit reached. Please try again later.";
      return;
    }

    data.items.forEach(item => {
      const title = item.volumeInfo.title || "No title available";
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
    results.innerHTML = "Error loading books. Please try again later.";
  });
