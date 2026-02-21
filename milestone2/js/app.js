console.log("app.js LOADED");
$(document).ready(function () {

  var apiKey = "AIzaSyAaXzebLvsKc4q66a4Ex0cux_FU-lrAalY";  // keep your real key here
  var allBooks = [];
  var resultsPerPage = 10;

  $("#btnSearch").click(function () {

    var searchTerm = $("#searchTerm").val().trim();

    if (searchTerm === "") {
      alert("Please enter a search term.");
      return;
    }

    $("#results").html("Loading...");
    $("#pageSelect").empty();

    // NOTE: maxResults allowed per request is 40
    var apiUrl =
      "https://www.googleapis.com/books/v1/volumes?q=" +
      encodeURIComponent(searchTerm) +
      "&maxResults=40" +
      "&key=" + apiKey;

    $.getJSON(apiUrl)
      .done(function (data) {

        allBooks = data.items || [];

        if (allBooks.length === 0) {
          $("#results").html("No results found.");
          return;
        }

        createPagination();
        $("#pageSelect").val("1");
        displayPage(1);

      })
      .fail(function (xhr) {
        $("#results").html("API error: " + xhr.status);
      });

  });

  $("#pageSelect").on("change", function () {
    var pageNumber = parseInt($(this).val(), 10);
    displayPage(pageNumber);
  });

  function createPagination() {
    $("#pageSelect").empty();

    var totalPages = Math.ceil(allBooks.length / resultsPerPage);

    for (var i = 1; i <= totalPages; i++) {
      $("#pageSelect").append("<option value='" + i + "'>" + i + "</option>");
    }
  }

  function displayPage(pageNumber) {

    $("#results").empty();

    var start = (pageNumber - 1) * resultsPerPage;
    var end = start + resultsPerPage;

    var booksToShow = allBooks.slice(start, end);

    for (var i = 0; i < booksToShow.length; i++) {

      var book = booksToShow[i];

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
  }

});
