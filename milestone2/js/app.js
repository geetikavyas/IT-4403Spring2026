$(document).ready(function () {

    var apiKey = "AIzaSyAaXzebLvsKc4q66a4Ex0cux_FU-lrAalY";   // <-- put your key inside quotes

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

        $.getJSON(apiUrl)
            .done(function (data) {
                console.log(data);
            })
            .fail(function (xhr) {
                console.log("Error:", xhr.status, xhr.statusText);
                alert("Google Books API error: " + xhr.status);
            });

    });

});
