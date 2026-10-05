// Read the Work ID passed in the URL.
const workId = new URLSearchParams(location.search).get("workId");
const details = document.getElementById("details");
const message = document.getElementById("message");

// Add text safely without treating API data as HTML.
function addText(label, value) {
    const paragraph = document.createElement("p");
    paragraph.textContent = label + value;
    details.appendChild(paragraph);
}

async function loadDetails() {
    if (!workId || !/^OL[0-9]+W$/.test(workId)) {
        message.textContent = "Select a valid book from Home or My Bookshelf.";
        return;
    }
    message.textContent = "Loading book...";
    try {
        const response = await fetch("https://openlibrary.org/works/" + workId + ".json");
        if (!response.ok) throw new Error("Request failed");
        const book = await response.json();
        addText("Title: ", book.title);
        addText("Work ID: ", workId);

        // A description can be text or an object with a value property.
        const description = typeof book.description === "string"
            ? book.description : book.description?.value;
        addText("Description: ", description || "Description unavailable");
        addText("Subjects: ", book.subjects?.slice(0, 10).join(", ") || "Subjects unavailable");

        // Work records use covers, rather than the search field cover_i.
        const coverId = book.covers?.find(id => id > 0);
        if (coverId) {
            const image = document.createElement("img");
            image.src = "https://covers.openlibrary.org/b/id/" + coverId + "-M.jpg?default=false";
            image.alt = "Cover of " + book.title;
            image.onerror = function() { image.replaceWith("Cover unavailable"); };
            details.appendChild(image);
        } else {
            addText("", "Cover unavailable");
        }

        const link = document.createElement("a");
        link.href = "https://openlibrary.org/works/" + workId;
        link.textContent = "View this book on Open Library";
        details.appendChild(link);
        message.textContent = "";
    } catch (error) {
        message.textContent = "Unable to load this book. Please try again.";
    }
}
loadDetails();
