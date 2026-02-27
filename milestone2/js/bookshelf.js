$(document).ready(function () {
  // 1. CONFIGURATION
  var apiKey = "AIzaSyDVf75MgxioDkvXiF5pq5JjPEJctEb9ONY";
  var userId = "cbRUVHEQnPG3YcfPxNWIew"; // Extracted from your URL
  var shelfId = "1001"; // Default for your custom public shelf

  var $results = $("#bookshelfResults");
  $results.html("<p>Loading your public bookshelf...</p>");

  // 2. THE API URL
  // This fetches volumes from your specific shelf using the New ID
  var volumesUrl = "https://www.googleapis.com/books/v1/users/" + userId + "/bookshelves/" + shelfId + "/volumes?key=" + apiKey;

  // 3. FETCH DATA
  $.getJSON(volumesUrl)
    .done(function (data) {
      var items = data.items || [];

      if (items.length === 0) {
        $results.html("<p>No books found. Make sure you have added books to your public shelf and waited a moment for Google to update.</p>");
        return;
      }

      // 4. DISPLAY (Matching Search Results Layout)
      var html = '<div style="display: flex; flex-wrap: wrap; gap: 20px;">';

      $.each(items, function (index, book) {
        var info = book.volumeInfo;
        var title = info.title || "Untitled";
        var authors = info.authors ? info.authors.join(", ") : "Unknown Author";
        var thumb = (info.imageLinks && info.imageLinks.thumbnail) 
                    ? info.imageLinks.thumbnail 
                    : "https://via.placeholder.com/128x192?text=No+Cover";
        var bookId = book.id;

        html += `
          <div class="book-card" style="width: 180px; border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);">
            <a href="details.html?id=${bookId}" style="text-decoration: none; color: black;">
              <img src="${thumb}" alt="${title}" style="width: 120px; height: 180px; object-fit: cover; margin-bottom: 10px;">
              <h3 style="font-size: 1rem; margin: 5px 0; height: 3em; overflow: hidden;">${title}</h3>
            </a>
            <p style="font-size: 0.85rem; color: #666; height: 2.5em; overflow: hidden;">${authors}</p>
            <a href="details.html?id=${bookId}" style="display: inline-block; margin-top: 10px; background: #007bff; color: white; padding: 5px 10px; border-radius: 4px; text-decoration: none; font-size: 0.9rem;">View Details</a>
          </div>
        `;
      });

      html += '</div>';
      $results.html(html);
    })
    .fail(function (xhr, status, error) {
    console.log("status:", status);
    console.log("error:", error);
    console.log("responseText:", xhr.responseText);
    console.log("final URL:", volumesUrl);
    $results.html("<p>Error: Could not retrieve bookshelf. Check console for details.</p>");
    });
});
