$(document).ready(function () {

  $("#btnSearch").click(function () {

    var searchTerm = $("#searchTerm").val().trim();

    if (searchTerm === "") {
      alert("Please enter a search term.");
      return;
    }

    $("#btnSearch").prop("disabled", true);

    var apiUrl =
      "https://www.googleapis.com/books/v1/volumes?q=" +
      encodeURIComponent(searchTerm) +
      "&maxResults=40";

    $.getJSON(apiUrl)
      .done(function (data) {
        console.log(data);
      })
      .fail(function (xhr) {
        console.log("Error:", xhr.status, xhr.statusText);
        alert("Google Books API error: " + xhr.status);
      })
      .always(function () {
        setTimeout(function () {
          $("#btnSearch").prop("disabled", false);
        }, 1500); // wait 1.5 seconds before allowing another request
      });

  });

});
