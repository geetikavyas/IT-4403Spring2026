console.log("app.js loaded");
$(document).ready(function () {

    $("#btnSearch").click(function () {

        var searchTerm = $("#searchTerm").val().trim();

        if (searchTerm === "") {
            alert("Please enter a search term.");
            return;
        }

        var apiUrl = "https://www.googleapis.com/books/v1/volumes?q="
            + encodeURIComponent(searchTerm)
            + "&maxResults=40";

        $.getJSON(apiUrl, function (data) {
            console.log(data);
        });

    });

});
