$(document).ready(function () {

  const bearerToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTE5ZmIzMmVmZTU2MWE1MWQ2Y2M3ODYxYjM4YzA2OSIsIm5iZiI6MTc3NDU2NTg1OS41NDQsInN1YiI6IjY5YzViOWUzNmY4OWVmMzMxMmFmY2ZkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gmWAZ3hbx73ZzwXI_94e9Lhfh6rQzumLRcLaEF351yU";
  const imageBase = "https://image.tmdb.org/t/p/w500";

  let currentQuery = "";
  let currentPage = 1;
  let currentView = "grid";

  let currentSearchResults = [];
  let currentPopularMovies = [];
  let currentTopRatedMovies = [];

  // Generic AJAX function
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

  // Format movie data for Mustache templates
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
        showOverview: currentView === "list"
      };
    });
  }

  // Render movie cards using Mustache
  function renderMovieCards(movies, targetSelector) {
    const target = $(targetSelector);
    target.empty();

    if (!movies || movies.length === 0) {
      target.html("<p>No movies found.</p>");
      return;
    }

    const formattedMovies = formatMoviesForTemplate(movies);
    const template = $("#movie-card-template").html();
    const html = Mustache.render(template, { movies: formattedMovies });

    target.html(html);

    if (currentView === "list") {
      target.removeClass("movie-grid").addClass("movie-list");
    } else {
      target.removeClass("movie-list").addClass("movie-grid");
    }
  }

  // Render movie details using Mustache
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

  // Load movie details
  function loadMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

    tmdbRequest(
      url,
      function (movie) {
        renderMovieDetails(movie);
      },
      function () {
        $("#details").html("<p>Error loading movie details.</p>");
      }
    );
  }

  // Pagination
  function buildPagination(totalPages) {
    $("#pagination").empty();

    const maxPages = Math.min(5, totalPages);

    for (let i = 1; i <= maxPages; i++) {
      const btn = $(`<button>${i}</button>`);

      if (i === currentPage) {
        btn.addClass("active");
      }

      btn.on("click", function () {
        currentPage = i;
        searchMovies(currentQuery, currentPage);
      });

      $("#pagination").append(btn);
    }

    if (maxPages > 0) {
      $("#pagination").append(`<span> Current page: ${currentPage}</span>`);
    }
  }

  // Search movies
  function searchMovies(query, page) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`;

    tmdbRequest(
      url,
      function (data) {
        currentSearchResults = data.results || [];
        renderMovieCards(currentSearchResults, "#results");
        buildPagination(data.total_pages || 0);
      },
      function () {
        $("#results").html("<p>Error loading search results.</p>");
        $("#pagination").empty();
      }
    );
  }

  // Load Popular Movies
  function loadPopularMovies() {
    const url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";

    tmdbRequest(
      url,
      function (data) {
        currentPopularMovies = (data.results || []).slice(0, 10);
        renderMovieCards(currentPopularMovies, "#collection");
      },
      function () {
        $("#collection").html("<p>Error loading popular movies.</p>");
      }
    );
  }

  // Load Top Rated Movies
  function loadTopRatedMovies() {
    const url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

    tmdbRequest(
      url,
      function (data) {
        currentTopRatedMovies = (data.results || []).slice(0, 10);
        renderMovieCards(currentTopRatedMovies, "#topRated");
      },
      function () {
        $("#topRated").html("<p>Error loading top rated movies.</p>");
      }
    );
  }

  // Search button click
  $("#searchBtn").on("click", function () {
    currentQuery = $("#searchInput").val().trim();

    if (!currentQuery) {
      alert("Enter a search term");
      return;
    }

    currentPage = 1;
    $("#showSearchTab").click();
    searchMovies(currentQuery, currentPage);
  });

  // Enter key
  $("#searchInput").on("keypress", function (e) {
    if (e.which === 13) {
      $("#searchBtn").click();
    }
  });

  // Click handler for all movie cards
  $(document).on("click", ".movie-card", function () {
    const movieId = $(this).data("id");
    loadMovieDetails(movieId);
  });

  // Grid view button
  $("#gridViewBtn").on("click", function () {
    currentView = "grid";

    $("#gridViewBtn").addClass("active-view");
    $("#listViewBtn").removeClass("active-view");

    renderMovieCards(currentSearchResults, "#results");
    renderMovieCards(currentPopularMovies, "#collection");
    renderMovieCards(currentTopRatedMovies, "#topRated");
  });

  // List view button
  $("#listViewBtn").on("click", function () {
    currentView = "list";

    $("#listViewBtn").addClass("active-view");
    $("#gridViewBtn").removeClass("active-view");

    renderMovieCards(currentSearchResults, "#results");
    renderMovieCards(currentPopularMovies, "#collection");
    renderMovieCards(currentTopRatedMovies, "#topRated");
  });

  // Tab switching
  $("#showSearchTab").on("click", function () {
    $("#searchTab").show();
    $("#bookshelfTab").hide();

    $("#showSearchTab").addClass("active-tab");
    $("#showBookshelfTab").removeClass("active-tab");
  });

  $("#showBookshelfTab").on("click", function () {
    $("#searchTab").hide();
    $("#bookshelfTab").show();

    $("#showBookshelfTab").addClass("active-tab");
    $("#showSearchTab").removeClass("active-tab");
  });

  // Initial load
  loadPopularMovies();
  loadTopRatedMovies();

});