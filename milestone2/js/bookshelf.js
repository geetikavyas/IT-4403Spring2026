// Instead of using users/{userId}/bookshelves/{shelfId}/volumes
var apiKey = "YOUR_API_KEY";

// A few volume IDs copied from Google Books URLs for books on your shelf:
var volumeIds = [
  "fnmwBgAAQBAJ",
];

var $results = $("#bookshelfResults");
$results.html("<p>Loading your bookshelf...</p>");

var requests = volumeIds.map(function (id) {
  var url = "https://www.googleapis.com/books/v1/volumes/" + id + "?key=" + apiKey;
  return $.getJSON(url);
});

$.when.apply($, requests)
  .done(function () {
    var responses = arguments.length === 3 ? arguments : Array.from(arguments);
    var html = '<div style="display:flex;flex-wrap:wrap;gap:20px;">';

    responses.forEach(function (resp) {
      // resp[0] is the data when using $.when with $.getJSON
      var data = Array.isArray(resp) ? resp[0] : resp;
      var info = data.volumeInfo || {};
      var title = info.title || "Untitled";
      var authors = info.authors ? info.authors.join(", ") : "Unknown Author";
      var thumb = info.imageLinks && info.imageLinks.thumbnail
        ? info.imageLinks.thumbnail
        : "https://via.placeholder.com/128x192?text=No+Cover";
      var bookId = data.id;

      html += `
        <div class="book-card" style="width:180px;border:1px solid #ddd;padding:15px;border-radius:8px;text-align:center;box-shadow:2px 2px 5px rgba(0,0,0,0.1);">
          <a href="details.html?id=${bookId}" style="text-decoration:none;color:black;">
            <img src="${thumb}" alt="${title}" style="width:120px;height:180px;object-fit:cover;margin-bottom:10px;">
            <h3 style="font-size:1rem;margin:5px 0;height:3em;overflow:hidden;">${title}</h3>
          </a>
          <p style="font-size:0.85rem;color:#666;height:2.5em;overflow:hidden;">${authors}</p>
          <a href="details.html?id=${bookId}" style="display:inline-block;margin-top:10px;background:#007bff;color:white;padding:5px 10px;border-radius:4px;text-decoration:none;font-size:0.9rem;">View Details</a>
        </div>
      `;
    });

    html += "</div>";
    $results.html(html);
  })
  .fail(function (xhr) {
    console.log("Error:", xhr.responseText);
    $results.html("<p>Error: Could not load bookshelf volumes.</p>");
  });
