console.log("bookshelf.js LOADED");

$(document).ready(function () {

  // Use the same API key you used in app.js
  var apiKey = "AIzaSyAaXzebLvsKc4q66a4Ex0cux_FU-lrAalY";

  // From your Google Books shelf URL:
  // https://books.google.com/books?uid=117733359037709170153&as_coll=0&...
  var userId = "117733359037709170153";
  var shelfId = "0";

  // Where results will appear (must exist in bookshelf.html)
  var $results = $("#bookshelfResults");

  // Build the API URL (public shelf)
  // Endpoint: GET /users/{userId}/bookshelves/{shelf}/volumes
  var apiUrl =
    "https://www.googleapis.com/books/v1/users/" +
    encodeURIComponent(userId) +
    "/bookshelves/" +
    encodeURIComponent(shelfId) +
    "/volumes?maxResults=40&key=" +
    encodeURIComponent(apiKey);

  $results.html("Loading bookshelf...");

  $.getJSON(apiUrl)
    .done(function (data) {

      var items = data.items || [];

      if (items.length === 0) {
        $results.html(
          "No books found in this shelf. Make sure the shelf is PUBLIC and has books."
        );
        return;
      }

      var html = "";

      for (var i = 0; i < items.length; i++) {

        var book = items[i];
        var info = book.volumeInfo || {};

        var title = info.title || "No title";
        var authors = info.authors ? info.authors.join(", ") : "Not available";

        var img = "";
        if (info.imageLinks && info.imageLinks.thumbnail) {
          img = info.imageLinks.thumbnail;
        }

        // Link each book to your Step-4 details page
        var bookId = book.id;

        html +=
          "<div style='border:1px solid #ccc; padding:10px; margin-bottom:10px;'>" +
            "<a href='details.html?id=" + encodeURIComponent(bookId) + "'>" +
              "<strong>" + title + "</strong>" +
            "</a><br>" +
            "<span style='color:#555; font-size:13px;'>" + authors + "</span><br><br>" +
            (img ? "<a href='details.html?id=" + encodeURIComponent(bookId) + "'><img src='" + img + "' style='max-width:150px;'></a>" : "") +
          "</div>";
      }

      $results.html(html);

    })
    .fail(function (xhr) {
      console.log("Bookshelf API error:", xhr.status, xhr.statusText, xhr.responseText);
      $results.html("API error: " + xhr.status + " " + xhr.statusText);
    });

});
