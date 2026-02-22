// Step 8: Get User 1 and show it on the page

fetch("https://jsonplaceholder.typicode.com/users/1")
  .then(response => response.json())
  .then(user => {
    const userDiv = document.getElementById("user");

    userDiv.innerHTML = `
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
      <p><strong>Website:</strong> ${user.website}</p>
    `;
  })
  .catch(error => {
    console.log("Error loading user:", error);
  });
  // Step 10: Get albums of User 1 and display them

fetch("https://jsonplaceholder.typicode.com/albums?userId=1")
.then(response => response.json())
.then(albums => {
    console.log(albums);
    const albumList = document.getElementById("albums");

  albums.forEach(album => {
    const li = document.createElement("li");

    li.innerHTML = `
      <a href="page2.html?albumId=${album.id}">
        ${album.title}
      </a>
    `;

    albumList.appendChild(li);
  });
})
.catch(error => {
  console.log("Error loading albums:", error);
});

