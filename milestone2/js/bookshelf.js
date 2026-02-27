// Your Google Books API Key
var apiKey = "AIzaSyCIXZssIic1z2odLF_9gmFZI7bklRUFZ98";

// Volume IDs from your Google Books shelf
var volumeIds = [
  "fnmwBgAAQBAJ",
  "sXMYAAAAIAAJ",
  "vJkF6-ZyxsEC",
  "wP5E_K8sFbMC"
];

var $results = $("#bookshelfResults");
$results.html("<p>Loading your bookshelf...</p>");

// Create all API requests
var requests = volumeIds.map(function (id) {
  var url = "https://www.googleapis.com/books/v1/volumes/" + id + "?key=" + apiKey;
  return $.getJSON(url);
});

// Wait for all requests to complete
$.when.apply($, requests)
  .done(function () {

    // Handle single vs multiple responses correctly
    var responses = requests.length === 1 ? [arguments] : arguments;

    var html = '<div style="display:flex;flex-wrap:wrap;gap:20px;">';

    for (var i = 0; i < responses.length; i++) {

      var data = requests.length === 1
        ? responses[0][0]
        : responses[i][0];

      var info = data.volumeInfo || {};

      var title = info.title || "Untitled";
      var authors = info.authors ? info.authors.join(", ") : "Unknown Author";
      var publishedDate = info.publishedDate || "N/A";

      var thumb = (info.imageLinks && info.imageLinks.thumbnail)
        ? info.imageLinks.thumbnail
        : "https://via.placeholder.com/128x192?text=No+Cover";

      var bookId = data.id;

      html += `
        <div class="book-card" style="width:200px;border:1px solid #ddd;padding:15px;border-radius:8px;text-align:center;box-shadow:2px 2px 5px rgba(0,0,0,0.1);">
          
          <a href="details.html?id=${bookId}" style="text-decoration:none;color:black;">
            <img src="${thumb}" alt="${title}" style="width:120px;height:180px;object-fit:cover;margin-bottom:10px;">
            <h3 style="font-size:1rem;margin:5px 0;height:3em;overflow:hidden;">${title}</h3>
          </a>

          <p style="font-size:0.85rem;color:#666;margin:5px 0;">${authors}</p>
          <p style="font-size:0.8rem;color:#999;margin:5px 0;">${publishedDate}</p>

          <a href="details.html?id=${bookId}" 
             style="display:inline-block;margin-top:10px;background:#007bff;color:white;padding:6px 12px;border-radius:4px;text-decoration:none;font-size:0.9rem;">
             View Details
          </a>

        </div>
      `;
    }

    html += "</div>";
    $results.html(html);

  })
  .fail(function (xhr) {
    console.error("Error:", xhr.responseText);
    $results.html("<p style='color:red;'>Error: Could not load bookshelf volumes.</p>");
  });
