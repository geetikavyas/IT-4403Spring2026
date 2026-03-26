$(document).ready(function () {

  const bearerToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTE5ZmIzMmVmZTU2MWE1MWQ2Y2M3ODYxYjM4YzA2OSIsIm5iZiI6MTc3NDU2NTg1OS41NDQsInN1YiI6IjY5YzViOWUzNmY4OWVmMzMxMmFmY2ZkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gmWAZ3hbx73ZzwXI_94e9Lhfh6rQzumLRcLaEF351yU";
  const imageBase = "https://image.tmdb.org/t/p/w500";

  let currentQuery = "";
  let currentPage = 1;

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

  // Render movie cards
  function renderMovieCards(movies, targetSelector) {
    const target = $(targetSelector);
    target.empty();

    if (!movies || movies.length === 0) {
      target.html("<p>No movies found.</p>");
      return;
    }

    movies.forEach(function (movie) {
      const title = movie.title || "No title";
      const poster = movie.poster_path
        ? imageBase + movie.poster_path
        : "https://via.placeholder.com/300x450?text=No+Image";

      const card = $(`
        <div class="movie-card" data-id="${movie.id}">
          <img src="${poster}" alt="${title}">
          <p>${title}</p>
        </div>
      `);

      target.append(card);
    });
  }

  // Load movie details
  function loadMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

    tmdbRequest(
      url,
      function (movie) {
        const poster = movie.poster_path
          ? imageBase + movie.poster_path
          : "https://via.placeholder.com/300x450?text=No+Image";

        $("#details").html(`
          <img src="${poster}">
          <h3>${movie.title || "No title"}</h3>
          <p><strong>Release Date:</strong> ${movie.release_date || "N/A"}</p>
          <p><strong>Rating:</strong> ${movie.vote_average || "N/A"}</p>
          <p><strong>Language:</strong> ${movie.original_language || "N/A"}</p>
          <p><strong>Popularity:</strong> ${movie.popularity || "N/A"}</p>
          <p>${movie.overview || "No description available."}</p>
        `);
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
        renderMovieCards(data.results || [], "#results");
        buildPagination(data.total_pages || 0);
      },
      function () {
        $("#results").html("<p>Error loading search results.</p>");
        $("#pagination").empty();
      }
    );
  }

  // Load Popular Movies (collection)
  function loadPopularMovies() {
    const url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";

    tmdbRequest(
      url,
      function (data) {
        const movies = (data.results || []).slice(0, 10);
        renderMovieCards(movies, "#collection");
      },
      function () {
        $("#collection").html("<p>Error loading popular movies.</p>");
      }
    );
  }

  // Load Top Rated Movies (extra section)
  function loadTopRatedMovies() {
    const url = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

    tmdbRequest(
      url,
      function (data) {
        const movies = (data.results || []).slice(0, 10);
        renderMovieCards(movies, "#topRated");
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
    searchMovies(currentQuery, currentPage);
  });

  // Enter key
  $("#searchInput").on("keypress", function (e) {
    if (e.which === 13) {
      $("#searchBtn").click();
    }
  });

  // Click handler (for ALL movie cards)
  $(document).on("click", ".movie-card", function () {
    const movieId = $(this).data("id");
    loadMovieDetails(movieId);
  });

  // Initial load
  loadPopularMovies();
  loadTopRatedMovies();

});