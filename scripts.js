$(document).ready(function () {
    var currentPage = 1;
    var reposPerPage = 12;
    var repositoriesData;

    $('#myForm').submit(function (e) {
        e.preventDefault();

        var username = $('#search').val();

        fetchUserData(username);
    });

    function fetchUserData(username) {

        $('#result').empty();

        $.get(`https://api.github.com/users/${username}`)
            .done(function (userData) {

                displayUserInfo(userData);


                fetchUserRepositories(username);
            })
            .fail(function (error) {

                $('#result').html('<p class="text-danger">User not found. Please check the username and try again.</p>');
            });
    }

    function fetchUserRepositories(username) {

        $.get(`https://api.github.com/users/${username}/repos`)
            .done(function (repositories) {

                repositoriesData = repositories;
                displayUserRepositories();
            })
            .fail(function (error) {

                $('#result').append('<p class="text-danger">Error fetching user repositories.</p>');
            });
    }
    function displayUserInfo(userData) {

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


        $('#result').html(userInfoHTML);
    }

    function displayUserRepositories() {

        var repositoriesHTML = '<h3 class="mt-3">Repositories</h3>';
        var startIndex = (currentPage - 1) * reposPerPage;
        var endIndex = startIndex + reposPerPage;

        repositoriesHTML += '<div class="row">';

        for (var i = startIndex; i < Math.min(endIndex, repositoriesData.length); i++) {
            var repo = repositoriesData[i];


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

        $('#result').append(repositoriesHTML);


        addPaginationButtons();
    }

    function addPaginationButtons() {
        var totalPages = Math.ceil(repositoriesData.length / reposPerPage);


        $('#result').append(`<p class="mt-2">Page ${currentPage} of ${totalPages}</p>`);

        if (currentPage < totalPages) {
            $('#result').append(`<button class="btn btn-primary mb-3" id="nextPage">Next</button>`);
            $('#nextPage').click(function () {
                currentPage++;
                $('#result').empty();
                displayUserRepositories();
            });
        }
        if (currentPage > 1) {
            $('#result').append(`<button class="btn btn-primary mb-3 ml-2" id="prevPage">Previous</button>`);
            $('#prevPage').click(function () {
                currentPage--;
                $('#result').empty();
                displayUserRepositories();
            });
        }
    }
});
