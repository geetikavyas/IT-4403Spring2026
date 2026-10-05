// Change these IDs to choose your own bookshelf books.
// Titles and covers come from the API, not this array.
const workIds = ["OL17422847W", "OL45804W", "OL27448W"];
const results = document.getElementById("results");
const message = document.getElementById("message");

async function loadBookshelf() {
    message.textContent = "Loading bookshelf...";
    for (const workId of workIds) {
        const item = document.createElement("li");
        results.appendChild(item);
        try {
            const response = await fetch("https://openlibrary.org/works/" + workId + ".json");
            if (!response.ok) throw new Error("Request failed");
            const book = await response.json();
            const link = document.createElement("a");
            link.href = "details.html?workId=" + encodeURIComponent(workId);
            link.textContent = book.title;
            item.appendChild(link);

            const coverId = book.covers?.find(id => id > 0);
            if (coverId) {
                const image = document.createElement("img");
                image.src = "https://covers.openlibrary.org/b/id/" + coverId + "-S.jpg?default=false";
                image.alt = "Cover of " + book.title;
                image.onerror = function() { image.replaceWith("Cover unavailable"); };
                item.appendChild(image);
            } else {
                item.append(" — Cover unavailable");
            }
        } catch (error) {
            item.textContent = "Unable to load book " + workId + ".";
        }
        // Space out individual record requests to avoid a burst of requests.
        if (workId !== workIds[workIds.length - 1]) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    message.textContent = "";
}
loadBookshelf();
