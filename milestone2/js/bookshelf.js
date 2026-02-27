console.log("bookshelf.js LOADED");

$(document).ready(function () {
  // 1. Configuration - Using your provided credentials
  var apiKey = "AIzaSyCIXZssIic1z2odLF_9gmFZI7bklRUFZ98";
  var userId = "117733359037709170153";
  
  // Replace this with the 'as_coll' number from your Google Books URL
  var shelfId = "1001"; 

  var $results = $("#bookshelfResults");
  $results.html("<p>Loading your public bookshelf...</p>");

  // 2. The API URL to retrieve books from your SPECIFIC public bookshelf
  var volumesUrl =
    "https://www.googleapis.com/books/v1/users/" +
    encodeURIComponent(userId) +
    "/bookshelves/" +
    encodeURIComponent(shelfId) +
    "/volumes?maxResults=40&key=" +
    encodeURIComponent(apiKey);

  // 3. Fetch data from Google Books API
  $.getJSON(volumesUrl)
    .done(function (volData) {
      var items = volData.items || [];

      if (items.length === 0) {
        $results.html(
          "<p>Shelf is public but has no books. Add books to your shelf on Google Books and refresh.</p>"
        );
        return;
      }

      // 4. Build the HTML (matching your Search Results layout)
      var html = '<div class="book-grid">'; // Added a wrapper class for styling

      for (var i = 0; i < items.length; i++) {
        var book = items[i];
        var info = book.volumeInfo || {};

        var title = info.title || "No title available";
        var authors = info.authors ? info.authors.join(", ") : "Unknown Author";
        var bookId = book.id;
        
        // Handle missing images with a placeholder
        var img = (info.imageLinks && info.imageLinks.thumbnail) 
                  ? info.imageLinks.thumbnail 
                  : "https://via.placeholder.com/128x192?text=No+Cover";

        // Template for each book card
        html += `
          <div class="book-item" style="border:1px solid #ccc; padding:15px; margin:10px; display:inline-block; vertical-align:top; width:200px; text-align:center;">
            <a href="details.html?id=${encodeURIComponent(bookId)}">
              <img src="${img}" alt="${title}" style="height:200px; margin-bottom:10px;">
              <br>
              <strong>${title}</strong>
            </a>
            <p style="color:#666; font-size:0.9em;">${authors}</p>
            <a href="details.html?id=${encodeURIComponent(bookId)}" class="view-btn">View Details</a>
          </div>
        `;
      }

      html += '</div>';
      $results.html(html);
    })
    .fail(function (xhr) {
      console.log("API Error:", xhr.responseText);
      $results.html(
        "<p>Error retrieving bookshelf. Please check your Shelf ID and ensure it is set to Public.</p>"
      );
    });
});
