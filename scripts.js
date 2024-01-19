$(document).ready(function () {
    var currentPage = 1;
    var reposPerPage = 12; // Change this value based on the number of repositories you want per page
    var repositoriesData; // Store repositories data for pagination

    // Add an event listener for form submission
    $('#myForm').submit(function (e) {
        e.preventDefault();

        // Get the input value (GitHub username)
        var username = $('#search').val();

        // Fetch user data and repositories from GitHub API
        fetchUserData(username);
    });

    // Function to fetch user data and repositories from GitHub API
    function fetchUserData(username) {
        // Clear previous results
        $('#result').empty();

        // Make a GET request to GitHub API for user data
        $.get(`https://api.github.com/users/${username}`)
            .done(function (userData) {
                // Display user information
                displayUserInfo(userData);

                // Fetch and display user repositories
                fetchUserRepositories(username);
            })
            .fail(function (error) {
                // Display an error message
                $('#result').html('<p class="text-danger">User not found. Please check the username and try again.</p>');
            });
    }

    // Function to fetch user repositories from GitHub API
    function fetchUserRepositories(username) {
        // Make a GET request to GitHub API for user repositories
        $.get(`https://api.github.com/users/${username}/repos`)
            .done(function (repositories) {
                // Store repositories data for pagination
                repositoriesData = repositories;

                // Display user repositories for the current page
                displayUserRepositories();
            })
            .fail(function (error) {
                // Display an error message
                $('#result').append('<p class="text-danger">Error fetching user repositories.</p>');
            });
    }

    // Function to display user information
    function displayUserInfo(userData) {
        // Create HTML content for user information
        var userInfoHTML = `
            <div class="card mt-2">
                <img src="${userData.avatar_url}" class="card-img-top" alt="${userData.login}'s Avatar" style="max-width: 200px;">
                <div class="card-body">
                    <h5 class="card-title">${userData.name}</h5>
                    <p class="card-text">${userData.bio || 'No bio available'}</p>
                    <p class="card-text"><strong>Contact:</strong> ${userData.email || 'Not available'}</p>
                    <p class="card-text"><strong>Location:</strong> ${userData.location || 'Not available'}</p>
                    <p class="card-text"><strong>GitHub:</strong> <a href="${userData.html_url}" target="_blank">${userData.login}</a></p>
                </div>
            </div>
        `;

        // Append user information to the result div
        $('#result').html(userInfoHTML);
    }

    function displayUserRepositories() {
        // Create HTML content for user repositories
        var repositoriesHTML = '<h3 class="mt-3">Repositories</h3>';
        var startIndex = (currentPage - 1) * reposPerPage;
        var endIndex = startIndex + reposPerPage;
    
        repositoriesHTML += '<div class="row">';
    
        for (var i = startIndex; i < Math.min(endIndex, repositoriesData.length); i++) {
            var repo = repositoriesData[i];
    
            // Get the programming languages used in the repository
            var languages = repo.language ? `<p class="card-text"><strong>Languages:</strong> ${repo.language}</p>` : '';
    
            repositoriesHTML += `
                <div class="col-md-3">
                    <div class="card mb-1" style="height: 100%;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title ">${repo.name}</h5>
                            <p class="card-text flex-grow-1">${repo.description || 'No description available'}</p>
                            ${languages}
                        </div>
                    </div>
                </div>
            `;
        }
    
        repositoriesHTML += '</div>';
        // Append user repositories to the result div
        $('#result').append(repositoriesHTML);

        // Add pagination buttons
        addPaginationButtons();
    }

    // Function to add pagination buttons
    function addPaginationButtons() {
        var totalPages = Math.ceil(repositoriesData.length / reposPerPage);
    
        // Display current page number
        $('#result').append(`<p class="mt-2">Page ${currentPage} of ${totalPages}</p>`);
    
        // Add "Next" button if there are more pages
        if (currentPage < totalPages) {
            $('#result').append(`<button class="btn btn-primary mb-3" id="nextPage">Next</button>`);
            $('#nextPage').click(function () {
                currentPage++;
                // Clear previous results before fetching next page
                $('#result').empty();
                displayUserRepositories();
            });
        }
    
        // Add "Previous" button if not on the first page
        if (currentPage > 1) {
            $('#result').append(`<button class="btn btn-primary mb-3 ml-2" id="prevPage">Previous</button>`);
            $('#prevPage').click(function () {
                currentPage--;
                // Clear previous results before fetching previous page
                $('#result').empty();
                displayUserRepositories();
            });
        }
    }
});
