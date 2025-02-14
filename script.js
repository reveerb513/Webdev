document.addEventListener('DOMContentLoaded', () => {
    const usersLink = document.getElementById('users-link');
    const postsLink = document.getElementById('posts-link');
    const usersSection = document.getElementById('users-section');
    const postsSection = document.getElementById('posts-section');
    const usersTable = document.getElementById('users-table').getElementsByTagName('tbody')[0];
    const backButton = document.getElementById('back-button');
    const searchInput = document.getElementById('search-input'); // Get the search input field

    let currentUserId = null;
    let allUsers = []; // Store all users to allow search functionality

    // Fetch users and populate the table
    function loadUsers() {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(users => {
                allUsers = users; // Store all users
                displayUsers(users); // Display all users initially
            });
    }

    // Function to display users in the table
    function displayUsers(users) {
        usersTable.innerHTML = ''; // Clear existing rows
        users.forEach(user => {
            const row = usersTable.insertRow();
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.website}</td>
                <td><button class="view-posts" data-user-id="${user.id}">View Posts</button></td>
            `;
        });

        document.querySelectorAll('.view-posts').forEach(button => {
            button.addEventListener('click', () => {
                currentUserId = button.getAttribute('data-user-id');
                loadPosts(currentUserId);
                usersSection.style.display = 'none';
                postsSection.style.display = 'block';
            });
        });
    }

    // Fetch posts for a specific user
    function loadPosts(userId) {
        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
            .then(response => response.json())
            .then(posts => {
                const postsList = document.getElementById('posts-list');
                postsList.innerHTML = ''; // Clear existing posts
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('post');
                    postElement.innerHTML = `
                        <h3>${post.title}</h3>
                        <p>${post.body}</p>
                    `;
                    postsList.appendChild(postElement);
                });
            });
    }

    // Handle back button click
    backButton.addEventListener('click', () => {
        usersSection.style.display = 'block';
        postsSection.style.display = 'none';
    });

    // Initialize the dashboard
    usersLink.addEventListener('click', () => {
        usersLink.classList.add('active');
        postsLink.classList.remove('active');
        usersSection.style.display = 'block';
        postsSection.style.display = 'none';
    });

    postsLink.addEventListener('click', () => {
        postsLink.classList.add('active');
        usersLink.classList.remove('active');
        postsSection.style.display = 'block';
        usersSection.style.display = 'none';
    });

    // Event listener for the search input field
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase(); // Get search query and convert to lowercase
        const filteredUsers = allUsers.filter(user => {
            return (
                user.name.toLowerCase().includes(query) ||  // Filter based on name
                user.email.toLowerCase().includes(query) || // Filter based on email
                user.website.toLowerCase().includes(query)  // Filter based on website
            );
        });
        displayUsers(filteredUsers); // Display the filtered users
    });

    // Load users on page load
    loadUsers();
});
