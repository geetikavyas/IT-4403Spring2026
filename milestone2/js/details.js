$(document).ready(function () {

  var apiKey = "AIzaSyAaXzebLvsKc4q66a4Ex0cux_FU-lrAalY";

  function getBookIdFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  var bookId = getBookIdFromUrl();

  if (!bookId) {
    $("#bookDetails").html("No book ID provided.");
    return;
  }

  var apiUrl =
    "https://www.googleapis.com/books/v1/volumes/" +
    bookId +
    "?key=" + apiKey;

  $.getJSON(apiUrl)
    .done(function (book) {

      var info = book.volumeInfo || {};

      var title = info.title || "No title";
      var authors = info.authors ? info.authors.join(", ") : "Not available";
      var publisher = info.publisher || "Not available";
      var description = info.description || "Not available";

      var img = "";
      if (info.imageLinks && info.imageLinks.thumbnail) {
        img = info.imageLinks.thumbnail;
      }

      var price = "Not available";
      if (book.saleInfo && book.saleInfo.listPrice && book.saleInfo.listPrice.amount) {
        price = book.saleInfo.listPrice.amount + " " + (book.saleInfo.listPrice.currencyCode || "");
      }

      var html =
        "<h2>" + title + "</h2>" +
        (img ? "<img src='" + img + "'>" : "") +
        "<p><strong>Authors:</strong> " + authors + "</p>" +
        "<p><strong>Publisher:</strong> " + publisher + "</p>" +
        "<p><strong>Price:</strong> " + price + "</p>" +
        "<p><strong>Description:</strong></p>" +
        "<p>" + description + "</p>";

      $("#bookDetails").html(html);

    })
    .fail(function (xhr) {
      $("#bookDetails").html("API error: " + xhr.status);
    });

});
