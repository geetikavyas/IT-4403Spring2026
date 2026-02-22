// page2.js
// Page 2: Show album info + all photos (titles + thumbnails)
// Note: JSONPlaceholder photo thumbnails use via.placeholder.com which may be blocked (DNS).
// So we use picsum.photos thumbnails based on photo.id (no server needed).

// 1) Read albumId from URL (example: page2.html?albumId=1)
const params = new URLSearchParams(window.location.search);
const albumId = params.get("albumId");

// 2) Get target divs from page2.html
const albumInfoDiv = document.getElementById("album-info");
const photosDiv = document.getElementById("photos");

if (!albumId) {
  albumInfoDiv.innerHTML = `<p style="color:red;">Error: albumId is missing in the URL.</p>`;
} else {
  // 3) Fetch album info and display it at the top
  fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load album info");
      return res.json();
    })
    .then((album) => {
      albumInfoDiv.innerHTML = `
        <p><strong>Album ID:</strong> ${album.id}</p>
        <p><strong>Album Title:</strong> ${album.title}</p>
        <p><strong>User ID:</strong> ${album.userId}</p>
      `;
    })
    .catch((err) => {
      console.error(err);
      albumInfoDiv.innerHTML = `<p style="color:red;">Error loading album info.</p>`;
    });

  // 4) Fetch photos for this album and display them
  fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load photos");
      return res.json();
    })
    .then((photos) => {
      photosDiv.innerHTML = ""; // clear old content

      if (!photos || photos.length === 0) {
        photosDiv.innerHTML = "<p>No photos found for this album.</p>";
        return;
      }

      photos.forEach((photo) => {
        // Use picsum as thumbnail source (works even if via.placeholder is blocked)
        const thumbUrl = `https://picsum.photos/seed/${photo.id}/150/150`;
        const largeUrl = `https://picsum.photos/seed/${photo.id}/600/600`;

        const photoBlock = document.createElement("div");
        photoBlock.className = "photo-block";

        photoBlock.innerHTML = `
          <p><strong>${photo.title}</strong></p>
          <img 
            src="${thumbUrl}" 
            alt="${photo.title}" 
            width="150" 
            height="150"
            loading="lazy"
          />
          <p>
            <a href="${largeUrl}" target="_blank" rel="noopener noreferrer">
              Open larger image
            </a>
          </p>
          <hr />
        `;

        photosDiv.appendChild(photoBlock);
      });
    })
    .catch((err) => {
      console.error(err);
      photosDiv.innerHTML = `<p style="color:red;">Error loading photos.</p>`;
    });
}
