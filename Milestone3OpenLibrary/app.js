$(function () {
  var books = [];
  var page = 1;
  var busy = false;

  // One API request at a time; wait one second before allowing another.
  function request(url, data, success, failure) {
    if (busy) return;
    busy = true;
    $("button, input").prop("disabled", true);
    $("#status").text("Loading...");

    $.ajax({
      url: url,
      data: data,
      dataType: "json",
      timeout: 20000
    }).done(success).fail(failure).always(function () {
      $("#status").text("Please wait...");
      setTimeout(function () {
        busy = false;
        $("button, input").prop("disabled", false);
        $("#pagination button").each(function () {
          $(this).prop("disabled", Number($(this).text()) === page);
        });
        $("#status").text("");
      }, 1000);
    });
  }

  function cover(container, id, size) {
    if (!id || id <= 0) {
      $("<p>").text("Cover unavailable.").appendTo(container);
      return;
    }
    $("<img>", {
      src: "https://covers.openlibrary.org/b/id/" + id + "-" + size + ".jpg?default=false",
      alt: "Book cover"
    }).on("error", function () {
      $(this).replaceWith($("<p>").text("Cover unavailable."));
    }).appendTo(container);
  }

  // Search and collection items use the same layout and details handler.
  function showBooks(list, container) {
    container.empty();
    list.forEach(function (book) {
      var item = $("<div>").addClass("book");
      $("<button>", {
        type: "button",
        text: book.title || "Untitled book",
        disabled: busy
      }).on("click", function () {
        showDetails(book);
      }).appendTo(item);
      cover(item, book.cover_i || book.cover_id, "S");
      container.append(item);
    });
  }

  function showPage() {
    var count = Math.ceil(books.length / 10);
    showBooks(books.slice((page - 1) * 10, page * 10), $("#results"));
    $("#pagination").empty();
    if (!count) return;

    $("<p>").text("Page " + page + " of " + count).appendTo("#pagination");
    for (var i = 1; i <= count; i++) {
      $("<button>", {
        type: "button",
        text: i,
        disabled: busy || i === page
      }).on("click", function () {
        page = Number($(this).text());
        showPage();
      }).appendTo("#pagination");
    }
  }

  $("#search-form").on("submit", function (event) {
    event.preventDefault();
    if (busy) return;
    var term = $("#search-term").val().trim();
    if (!term) {
      $("#search-message").text("Please enter a title or keywords.");
      return;
    }
    books = [];
    page = 1;
    showPage();
    $("#search-message").text("Searching...");
    request("https://openlibrary.org/search.json", {
      q: term,
      limit: 50,
      fields: "key,title,cover_i,author_name"
    }, function (data) {
      books = (data.docs || []).slice(0, 50);
      $("#search-message").text(books.length ?
        books.length + " results for: " + term : "No books found.");
      showPage();
    }, function () {
      $("#search-message").text("Search failed. Please try again.");
    });
  });

  function showDetails(book) {
    if (busy) return;
    // API keys can be /works/OL...W or simply OL...W.
    var id = (book.key || "").split("/").pop();
    if (!/^OL\d+W$/.test(id)) {
      $("#details").text("Book details unavailable: missing or invalid Work ID.");
      return;
    }
    $("#details").text("Loading book details...");
    request("https://openlibrary.org/works/" + id + ".json", {}, function (data) {
      var details = $("#details").empty();
      var description = data.description;
      if (description && typeof description === "object") {
        description = description.value;
      }
      var authors = book.author_name ||
        (book.authors || []).map(function (author) { return author.name; });
      authors = authors.filter(Boolean);

      $("<h3>").text(data.title || book.title || "Untitled book").appendTo(details);
      $("<p>").text("Work ID: " + id).appendTo(details);
      $("<p>").text("Authors: " +
        (authors.join(", ") || "Author information unavailable.")).appendTo(details);
      $("<p>").text(description || "Description unavailable.").appendTo(details);
      $("<p>").text("Subjects: " +
        ((data.subjects || []).slice(0, 10).join(", ") ||
          "Subject information unavailable.")).appendTo(details);
      var coverId = (data.covers || []).find(function (value) { return value > 0; });
      cover(details, coverId || book.cover_i || book.cover_id, "M");
      $("<a>", {
        href: "https://openlibrary.org/works/" + id,
        text: "View on Open Library",
        target: "_blank",
        rel: "noopener"
      }).appendTo(details);
    }, function () {
      $("#details").text("Could not load book details. Select the book to try again.");
    });
  }

  function loadCollection() {
    if (busy) return;
    $("#collection").empty();
    $("#collection-message").text("Loading collection...");
    request("https://openlibrary.org/subjects/science_fiction.json",
      { limit: 10 }, function (data) {
        var collection = (data.works || []).slice(0, 10);
        $("#collection-message").text(collection.length ? "" : "No collection books available.");
        showBooks(collection, $("#collection"));
      }, function () {
        $("#collection-message").text("Collection unavailable. Use Reload collection to try again.");
      });
  }

  $("#reload-collection").on("click", loadCollection);
  loadCollection();
});
