$(document).ready(function () {
  var apiKey = "AIzaSyDVf75MgxioDkvXiF5pq5JjPEJctEb9ONY";
  var userId = "117733359037709170153";
  var $results = $("#bookshelfResults");

  var listShelvesUrl = `https://www.googleapis.com/books/v1/users/${userId}/bookshelves?key=${apiKey}`;

  $.getJSON(listShelvesUrl)
    .done(function (data) {
      if (!data.items) {
        $results.html("No public shelves found. Check Google Books Settings.");
        return;
      }

      var discoveryHtml = "<h3>Your Public Shelf IDs:</h3><ul>";
      data.items.forEach(function(shelf) {
        discoveryHtml += `<li><strong>${shelf.title}</strong> - ID: ${shelf.id} (Books: ${shelf.volumeCount})</li>`;
      });
      discoveryHtml += "</ul><p>Copy the ID you want and put it in your code!</p>";
      $results.html(discoveryHtml);
    })
    .fail(function(xhr) {
      $results.html("Error: " + xhr.status + " - " + xhr.statusText);
    });
});
