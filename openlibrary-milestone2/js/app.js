// Search 10 books per page, with access to at most 60 results.
const form = document.getElementById("searchForm");
const input = document.getElementById("searchTerm");
const pages = document.getElementById("pageNumber");
const results = document.getElementById("results");
const message = document.getElementById("message");
const button = document.getElementById("searchButton");
let searchTerm = "";

// A new search starts on page 1.
form.addEventListener("submit", function(event) {
    event.preventDefault();
    if (!input.value.trim()) {
        message.textContent = "Enter a search term.";
        return;
    }
    searchTerm = input.value.trim();
    loadBooks(1);
});

// Changing pages keeps the last submitted search term.
pages.addEventListener("change", function() {
    loadBooks(Number(pages.value));
});

async function loadBooks(page) {
    results.textContent = "";
    message.textContent = "Loading books...";
    button.disabled = true;
    pages.disabled = true;

    // Request only the fields this page uses.
    const url = "https://openlibrary.org/search.json?q="
        + encodeURIComponent(searchTerm)
        + "&fields=key,title,cover_i&limit=10&page=" + page;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Request failed");
        const data = await response.json();

        // Offer only pages needed for the first 60 available results.
        const total = data.numFound ?? data.num_found ?? 0;
        const pageCount = Math.ceil(Math.min(total, 60) / 10);
        pages.textContent = "";
        for (let number = 1; number <= pageCount; number++) {
            const option = document.createElement("option");
            option.value = number;
            option.textContent = number;
            pages.appendChild(option);
        }
        pages.value = page;

        // Each title passes its Work ID to the details page.
        for (const book of data.docs) {
            const item = document.createElement("li");
            const link = document.createElement("a");
            const workId = book.key.split("/").pop();
            link.href = "details.html?workId=" + encodeURIComponent(workId);
            link.textContent = book.title;
            item.appendChild(link);

            if (book.cover_i) {
                const image = document.createElement("img");
                image.src = "https://covers.openlibrary.org/b/id/"
                    + book.cover_i + "-S.jpg?default=false";
                image.alt = "Cover of " + book.title;
                image.onerror = function() { image.replaceWith("Cover unavailable"); };
                item.appendChild(image);
            } else {
                item.append(" — Cover unavailable");
            }
            results.appendChild(item);
        }
        message.textContent = data.docs.length ? "Page " + page : "No books found.";
    } catch (error) {
        message.textContent = "Unable to load books. Please try again.";
    } finally {
        button.disabled = false;
        pages.disabled = pages.options.length === 0;
    }
}
