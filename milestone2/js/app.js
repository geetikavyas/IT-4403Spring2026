$(document).ready(function () {

    var apiKey = "PASTE_YOUR_API_KEY_HERE";

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

            $("#results").empty();

            if (data.items) {

                data.items.forEach(function (book) {

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

    });

});
