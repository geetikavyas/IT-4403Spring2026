console.log("bookshelf.js LOADED");

$(document).ready(function () {
  var apiKey = "AIzaSyCIXZssIic1z2odLF_9gmFZI7bklRUFZ98";
  var userId = "cbRUVHEQnPG3YcfPxNWIew";

  var $results = $("#bookshelfResults");
  $results.html("Loading your public bookshelves...");

  // 1) Get list of PUBLIC bookshelves for this user
  var listShelvesUrl =
    "https://www.googleapis.com/books/v1/users/" +
    encodeURIComponent(userId) +
    "/bookshelves?key=" +
    encodeURIComponent(apiKey);

  $.getJSON(listShelvesUrl)
    .done(function (data) {
      var shelves = data.items || [];

      if (shelves.length === 0) {
        $results.html(
          "No public bookshelves found. Make sure your bookshelf is set to PUBLIC in Google Books."
        );
        return;
      }

      // Pick a shelf automatically:
      // Prefer a custom shelf (not the built-in ones) if available,
      // otherwise just use the first one returned.
      var chosenShelf = null;

      // Try to find any shelf with a title and volumeCount > 0
      for (var i = 0; i < shelves.length; i++) {
        if ((shelves[i].volumeCount || 0) > 0) {
          chosenShelf = shelves[i];
          break;
        }
      }
      if (!chosenShelf) chosenShelf = shelves[0];

      var shelfId = chosenShelf.id;
      var shelfTitle = chosenShelf.title || "My Bookshelf";

      $results.html("Loading books from: <strong>" + shelfTitle + "</strong> ...");

      // 2) Now load volumes from that shelf
      var volumesUrl =
        "https://www.googleapis.com/books/v1/users/" +
        encodeURIComponent(userId) +
        "/bookshelves/" +
        encodeURIComponent(shelfId) +
        "/volumes?maxResults=40&key=" +
        encodeURIComponent(apiKey);

      $.getJSON(volumesUrl)
        .done(function (volData) {
          var items = volData.items || [];

          if (items.length === 0) {
            $results.html(
              "Shelf is public but has no books (or API can't see them). Add books to this public shelf and refresh."
            );
            return;
          }

          var html = "<h2>" + shelfTitle + "</h2>";

          for (var j = 0; j < items.length; j++) {
            var book = items[j];
            var info = book.volumeInfo || {};

            var title = info.title || "No title";
            var authors = info.authors ? info.authors.join(", ") : "Not available";

            var img = "";
            if (info.imageLinks && info.imageLinks.thumbnail) {
              img = info.imageLinks.thumbnail;
            }

            var bookId = book.id;

            html +=
              "<div style='border:1px solid #ccc; padding:10px; margin-bottom:10px;'>" +
                "<a href='details.html?id=" + encodeURIComponent(bookId) + "'>" +
                  "<strong>" + title + "</strong>" +
                "</a><br>" +
                "<span style='color:#555; font-size:13px;'>" + authors + "</span><br><br>" +
                (img
                  ? "<a href='details.html?id=" + encodeURIComponent(bookId) + "'>" +
                      "<img src='" + img + "' style='max-width:150px;'>" +
                    "</a>"
                  : "") +
              "</div>";

          }

          $results.html(html);
        })
        .fail(function (xhr) {
          console.log("Volumes API error:", xhr.status, xhr.statusText, xhr.responseText);
          $results.html("API error (volumes): " + xhr.status + " " + xhr.statusText);
        });
    })
    .fail(function (xhr) {
      console.log("Shelves API error:", xhr.status, xhr.statusText, xhr.responseText);
      $results.html("API error (bookshelves list): " + xhr.status + " " + xhr.statusText);
    });
});
