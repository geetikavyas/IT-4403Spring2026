$(function () {
  // Task 1: Wikipedia suggestions
  $("#wiki-button").on("click", function () {
    var term = $("#wiki-input").val().trim();
    $("#wiki-results").empty();

    if (term === "") {
      $("#wiki-message").text("Enter a word or partial term.");
      return;
    }

    $("#wiki-message").text("Loading...");
    $("#wiki-button").prop("disabled", true);

    $.ajax({
      url: "https://en.wikipedia.org/w/api.php",
      dataType: "json",
      timeout: 15000,
      data: {
        action: "opensearch",
        search: term,
        limit: 5,
        format: "json",
        origin: "*"
      }
    })
      .done(function (data) {
        var titles = data[1];
        var urls = data[3];

        if (titles.length === 0) {
          $("#wiki-message").text("No suggestions found.");
          return;
        }

        $("#wiki-message").text("");
        for (var i = 0; i < titles.length; i++) {
          var item = $("<li>");
          $("<a>").text(titles[i]).attr("href", urls[i]).appendTo(item);
          $("#wiki-results").append(item);
        }
      })
      .fail(function () {
        $("#wiki-message").text("Request failed. Try again.");
      })
      .always(function () {
        $("#wiki-button").prop("disabled", false);
      });
  });

  // Task 2: ZIP lookup using three request methods
  $(".zip-button").on("click", function () {
    var zip = $("#zip-input").val().trim();
    var method = $(this).attr("data-method");
    $("#zip-results").empty();

    if (!/^[0-9]{5}$/.test(zip)) {
      $("#zip-message").text("Enter exactly five digits.");
      return;
    }

    var url = "https://api.zippopotam.us/us/" + zip;
    $("#zip-message").text("Loading...");
    $(".zip-button").prop("disabled", true);

    if (method === "fetch") {
      fetch(url)
        .then(function (response) {
          if (!response.ok) throw new Error(String(response.status));
          return response.json();
        })
        .then(displayPlaces)
        .catch(function (error) {
          zipError(Number(error.message));
        })
        .finally(zipFinished);
    }

    if (method === "ajax") {
      $.ajax({
        url: url,
        dataType: "json",
        timeout: 15000
      })
        .done(displayPlaces)
        .fail(function (xhr) { zipError(xhr.status); })
        .always(zipFinished);
    }

    if (method === "getJSON") {
      $.getJSON(url)
        .done(displayPlaces)
        .fail(function (xhr) { zipError(xhr.status); })
        .always(zipFinished);
    }
  });

  function displayPlaces(data) {
    var places = data.places || [];
    if (places.length === 0) {
      $("#zip-message").text("No places returned.");
      return;
    }

    $("#zip-message").text("");
    $("<p>").text("ZIP: " + data["post code"]).appendTo("#zip-results");
    $("<p>").text("Country: " + data.country).appendTo("#zip-results");

    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      $("<p>")
        .text(
          (place["place name"] || "Place unavailable") + ", " +
          (place.state || "State unavailable") + " (" +
          (place["state abbreviation"] || "N/A") + ")"
        )
        .appendTo("#zip-results");
    }
  }

  function zipError(status) {
    $("#zip-message").text(
      status === 404 ? "ZIP code not found." : "Request failed. Try again."
    );
  }

  function zipFinished() {
    $(".zip-button").prop("disabled", false);
  }

  // Task 3: Open Library search
  $("#book-button").on("click", function () {
    var term = $("#book-input").val().trim();
    $("#book-results").empty();

    if (term === "") {
      $("#book-message").text("Enter a title or keyword.");
      return;
    }

    $("#book-message").text("Loading...");
    $("#book-button").prop("disabled", true);

    $.ajax({
      url: "https://openlibrary.org/search.json",
      dataType: "json",
      timeout: 20000,
      data: {
        q: term,
        limit: 5,
        fields: "key,title,author_name,first_publish_year,edition_count"
      }
    })
      .done(function (data) {
        var books = data.docs || [];
        if (books.length === 0) {
          $("#book-message").text("No books found.");
          return;
        }

        $("#book-message").text("");
        for (var i = 0; i < books.length; i++) {
          var book = books[i];
          var item = $("<div>").addClass("book");
          var authors = (book.author_name || []).join(", ");

          $("<h3>").text(book.title || "Title unavailable").appendTo(item);
          $("<p>").text("Authors: " + (authors || "Unavailable")).appendTo(item);
          $("<p>")
            .text("First publication year: " + (book.first_publish_year ?? "Unavailable"))
            .appendTo(item);
          $("<p>")
            .text("Edition count: " + (book.edition_count ?? "Unavailable"))
            .appendTo(item);
          $("#book-results").append(item);
        }
      })
      .fail(function () {
        $("#book-message").text("Request failed. Try again.");
      })
      .always(function () {
        $("#book-button").prop("disabled", false);
      });
  });
});
