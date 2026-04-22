$(document).ready(function () {

  const bearerToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTE5ZmIzMmVmZTU2MWE1MWQ2Y2M3ODYxYjM4YzA2OSIsIm5iZiI6MTc3NDU2NTg1OS41NDQsInN1YiI6IjY5YzViOWUzNmY4OWVmMzMxMmFmY2ZkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gmWAZ3hbx73ZzwXI_94e9Lhfh6rQzumLRcLaEF351yU";
  const imageBase = "https://image.tmdb.org/t/p/w500";

  let currentQuery = "";
  let currentPage = 1;
  let currentView = "grid";

  let currentSearchResults = [];
  let currentPopularMovies = [];
  let currentTopRatedMovies = [];

  function tmdbRequest(url, onSuccess, onError) {
    $.ajax({
      url: url,
      method: "GET",
      headers: {
        Authorization: "Bearer " + bearerToken,
        accept: "application/json"
      },
      success: onSuccess,
      error: onError
    });
  }

  function formatMoviesForTemplate(movies) {
    return movies.map(function (movie) {
      return {
        id: movie.id,
        title: movie.title || "No title",
        overview: movie.overview || "No description available.",
        poster: movie.poster_path
          ? imageBase + movie.poster_path
          : "https://via.placeholder.com/300x450?text=No+Image",
        viewClass: currentView === "list" ? "movie-list-item" : "",
        showOverview: currentView === "list",
        colClass: currentView === "list" ? "col-12" : "col-sm-6 col-md-4 col-xl-3"
      };
    });
  }

  function renderMovieCards(movies, targetSelector) {
    const target = $(targetSelector);
    target.empty();

    if (!movies || movies.length === 0) {
      target.html("<p class='text-muted'>No movies found.</p>");
      return;
    }

    const formattedMovies = formatMoviesForTemplate(movies);
    const template = $("#movie-card-template").html();
    const html = Mustache.render(template, { movies: formattedMovies });
    target.html(html);
  }

  function renderMovieDetails(movie) {
    const detailsData = {
      poster: movie.poster_path
        ? imageBase + movie.poster_path
        : "https://via.placeholder.com/300x450?text=No+Image",
      title: movie.title || "No title",
      release_date: movie.release_date || "N/A",
      vote_average: movie.vote_average || "N/A",
      original_language: movie.original_language || "N/A",
      popularity: movie.popularity || "N/A",
      overview: movie.overview || "No description available."
    };

    const template = $("#movie-details-template").html();
    const html = Mustache.render(template, detailsData);
    $("#details").html(html);
  }

  function renderMovieTable(movies) {
    const tbody = $("#movieTableBody");
    tbody.empty();

    if (!movies || movies.length === 0) {
      tbody.html(`
        <tr>
          <td colspan="5" class="text-center text-muted">No movies found.</td>
        </tr>
      `);
      return;
    }

    movies.forEach(function (movie) {
      const poster = movie.poster_path
        ? imageBase + movie.poster_path
        : "https://via.placeholder.com/80x120?text=No+Image";

      const row = `
        <tr>
          <td><img src="${poster}" alt="${movie.title || "No title"}" style="width:60px; height:90px; object-fit:cover; border-radius:4px;"></td>
          <td>${movie.title || "No title"}</td>
          <td>${movie.vote_average || "N/A"}</td>
          <td>${movie.original_language || "N/A"}</td>
          <td>${movie.popularity || "N/A"}</td>
        </tr>
      `;
      tbody.append(row);
    });
  }

  function loadMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

    tmdbRequest(
      url,
      function (movie) {
        renderMovieDetails(movie);
      },
      function () {
        $("#details").html("<p class='text-danger mb-0'>Error loading movie details.</p>");
      }
    );
  }

  function buildPagination(totalPages) {
    $("#pagination").empty();

    const maxPages = Math.min(5, totalPages);

    if (maxPages === 0) return;

    const list = $('<ul class="pagination mb-0 flex-wrap"></ul>');

    for (let i = 1; i <= maxPages; i++) {
      const item = $(`
        <li class="page-item ${i === currentPage ? "active" : ""}">
          <button class="page-link" type="button">${i}</button>
        </li>
      `);

      item.on("click", function () {
        currentPage = i;
        searchMovies(currentQuery, currentPage);
      });

      list.append(item);
    }

    $("#pagination").append(list);
    $("#pagination").append(`<div class="small text-muted mt-2">Current page: ${currentPage}</div>`);
  }

  function searchMovies(query, page) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`;

    tmdbRequest(
      url,
      function (data) {
        currentSearchResults = data.results || [];
        renderMovieCards(currentSearchResults, "#results");
        renderMovieTable(currentSearchResults);
        buildPagination(data.total_pages || 0);
      },
      function () {
        $("#results").html("<p class='text-danger'>Error loading search results.</p>");
        $("#movieTableBody").html(`
          <tr>
            <td colspan="5" class="text-center text-danger">Error loading table data.</td>
          </tr>
        `);
        $("#pagination").empty();
      }
    );
  }

  function loadPopularMovies() {
    const url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";

    tmdbRequest(
      url,
      function (data) {
        currentPopularMovies = (data.results || []).slice(0, 10);
        renderMovieCards(currentPopularMovies, "#collection");
      },
      function () {
        $("#collection").html("<p class='text-danger'>Error loading popular movies.</p>");
      }
    );
  }

  function loadTopRatedMovies() {
    const url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

    tmdbRequest(
      url,
      function (data) {
        currentTopRatedMovies = (data.results || []).slice(0, 10);
        renderMovieCards(currentTopRatedMovies, "#topRated");
      },
      function () {
        $("#topRated").html("<p class='text-danger'>Error loading top-rated movies.</p>");
      }
    );
  }

  $("#searchForm").on("submit", function (e) {
    e.preventDefault();

    currentQuery = $("#searchInput").val().trim();

    if (!currentQuery) {
      alert("Enter a search term");
      return;
    }

    currentPage = 1;
    $("#showSearchTab").click();
    searchMovies(currentQuery, currentPage);
  });

  $(document).on("click", ".movie-card", function () {
    const movieId = $(this).data("id");
    loadMovieDetails(movieId);
  });

  $("#gridViewBtn").on("click", function () {
    currentView = "grid";

    $("#gridViewBtn").addClass("active-view");
    $("#listViewBtn").removeClass("active-view");

    renderMovieCards(currentSearchResults, "#results");
    renderMovieCards(currentPopularMovies, "#collection");
    renderMovieCards(currentTopRatedMovies, "#topRated");
  });

  $("#listViewBtn").on("click", function () {
    currentView = "list";

    $("#listViewBtn").addClass("active-view");
    $("#gridViewBtn").removeClass("active-view");

    renderMovieCards(currentSearchResults, "#results");
    renderMovieCards(currentPopularMovies, "#collection");
    renderMovieCards(currentTopRatedMovies, "#topRated");
  });

  $("#showSearchTab").on("click", function () {
    $("#searchTab").show();
    $("#bookshelfTab").hide();

    $("#showSearchTab").addClass("active-tab active");
    $("#showBookshelfTab").removeClass("active-tab active");
  });

  $("#showBookshelfTab").on("click", function () {
    $("#searchTab").hide();
    $("#bookshelfTab").show();

    $("#showBookshelfTab").addClass("active-tab active");
    $("#showSearchTab").removeClass("active-tab active");
  });

  loadPopularMovies();
  loadTopRatedMovies();

});