$(document).ready(function () {

  var apiKey = "AIzaSyAaXzebLvsKc4q66a4Ex0cux_FU-lrAalY";

  $("#btnSearch").click(function () {

    var searchTerm = $("#searchTerm").val().trim();
    if (searchTerm === "") {
      alert("Please enter a search term.");
      return;
    }

    $("#results").html("Loading...");

    var apiUrl =
      "https://www.googleapis.com/books/v1/volumes?q=" +
      encodeURIComponent(searchTerm) +
      "&maxResults=40" +
      "&key=" + apiKey;

    $.getJSON(apiUrl)
      .done(function (data) {

        $("#results").empty();

        if (!data.items || data.items.length === 0) {
          $("#results").html("No results found.");
          return;
        }

        for (var i = 0; i < data.items.length; i++) {
          var book = data.items[i];

          var title = (book.volumeInfo && book.volumeInfo.title) ? book.volumeInfo.title : "No title";
          var bookId = book.id;

          var img = "";
          if (book.volumeInfo &&
              book.volumeInfo.imageLinks &&
              book.volumeInfo.imageLinks.thumbnail) {
            img = book.volumeInfo.imageLinks.thumbnail;
          }

          var html =
            "<div>" +
              "<a href='details.html?id=" + bookId + "'>" + title + "</a><br>" +
              (img ? "<img src='" + img + "'>" : "") +
            "</div><hr>";

          $("#results").append(html);
        }
      })
      .fail(function (xhr) {
        $("#results").html("API error: " + xhr.status);
      });

  });

});
