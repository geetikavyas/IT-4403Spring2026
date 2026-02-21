$(document).ready(function () {

    var apiKey = "AIzaSyAaXzebLvsKc4q66a4Ex0cux_FU-lrAalY";
    var allBooks = [];
    var resultsPerPage = 10;

    $("#btnSearch").click(function () {

        var searchTerm = $("#searchTerm").val().trim();
        if (searchTerm === "") {
            alert("Please enter a search term.");
            return;
        }

        var apiUrl =
            "https://www.googleapis.com/books/v1/volumes?q=" +
            encodeURIComponent(searchTerm) +
            "&maxResults=40" +
            "&key=" + apiKey;

        $.getJSON(apiUrl, function (data) {

            allBooks = data.items || [];
            createPagination();
            displayPage(1);

        });

    });

    function createPagination() {
        $("#pageSelect").empty();

        var totalPages = Math.ceil(allBooks.length / resultsPerPage);

        for (var i = 1; i <= totalPages; i++) {
            $("#pageSelect").append(
                "<option value='" + i + "'>" + i + "</option>"
            );
        }
    }

    $("#pageSelect").change(function () {
        var pageNumber = parseInt($(this).val());
        displayPage(pageNumber);
    });

    function displayPage(pageNumber) {

        $("#results").empty();

        var start = (pageNumber - 1) * resultsPerPage;
        var end = start + resultsPerPage;

        var booksToShow = allBooks.slice(start, end);

        booksToShow.forEach(function (book) {

            var title = book.volumeInfo.title || "No title";
            var bookId = book.id;

            var image = "";
            if (book.volumeInfo.imageLinks &&
                book.volumeInfo.imageLinks.thumbnail) {
                image = book.volumeInfo.imageLinks.thumbnail;
            }

            var bookHtml =
                "<div>" +
                "<a href='details.html?id=" + bookId + "'>" + title + "</a><br>" +
                (image ? "<img src='" + image + "'>" : "") +
                "</div><hr>";

            $("#results").append(bookHtml);
        });
    }

});
