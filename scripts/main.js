const access_token = `<YOUR ACCESS TOKEN>`

const query = `query {
    viewer {
      name
      avatarUrl
      login
      bio
      repositories(first: 20) {
        nodes {
          id
          name
          updatedAt
          parent {
            description
            stargazerCount
            forkCount
          }
          languages(first: 1) {
            nodes {
              name
              color
              id
            }
          }
        }
      }
      status {
          emoji
        emojiHTML
        message
      }
    }
  }
  
  `;

const variables = null;

const request = (query, variables, callback) => {
    //check if query has a variable else if not  call without variables value
    const body = variables
        ? JSON.stringify({ query, variables })
        : JSON.stringify({ query });

    fetch(`https://api.github.com/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        body,
    })
        .then((r) => r.json())
        .then((data) => callback(data))
        .catch((error) => {
            throw new Error(error);
        });
};

request(query, variables, ({ data }) => initializeUI(data));

const profileSummaryScroll = document.getElementById('profile-summary-scroll')

window.onscroll = function () {
    "use strict";
    if (document.body.scrollTop >= 330 || document.documentElement.scrollTop >= 330) {
        profileSummaryScroll.classList.remove('hidden-md-and-up')
    } else {
        profileSummaryScroll.classList.add('hidden-md-and-up')
    }
};

function initializeUI(data) {
    const { avatarUrl, name, repositories, login, status, bio } = data.viewer
    const { emojiHTML } = status

    const imageContainers = document.querySelectorAll('#avatar')
    const fullName = document.querySelectorAll('#fullname')
    const username = document.querySelectorAll('#username')
    const repositoryCounter = document.querySelectorAll('#repository-count')
    const statusContainer = document.getElementById('status')
    const statusInputContainer = document.getElementById('status-input')
    const bioContainer = document.querySelectorAll('#bio')
    const repoListContainer = document.getElementById('repo-list')

    imageContainers.forEach(container => container.setAttribute("src", avatarUrl))
    imageContainers[0].style.display = 'block';

    statusInputContainer.innerHTML = `${emojiHTML} Edit Status`

    fullName.forEach(el => el.innerHTML = name)
    username.forEach(el => el.innerHTML = login)

    bioContainer.forEach(el => el.innerHTML = bio)

    repositoryCounter.forEach(container => container.innerHTML = repositories.nodes.length)
    repositories.nodes.map(repo => {
        repoListContainer.innerHTML += `
    <div class="repository">
        <div class="star-name d-flex">
            <div class="repo-name">${repo.name}</div>
            <div class="star-cont">
                <button class="d-flex">
                    <svg class="mr-1" viewBox="0 0 16 16" version="1.1" width="16"
                        height="16" aria-hidden="true">
                        <path fill-rule="evenodd"
                            d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
                        </path>
                    </svg>Star
                </button>
            </div>
        </div>
        <div class="repo-details d-flex">
            <div class="language-container d-flex">
                <div class="language-colour" style="background: ${repo.languages && repo.languages.nodes.length > 0 ? repo.languages.nodes[0].color : '#563d7c'}"></div>
                <div class="language">${repo.languages && repo.languages.nodes.length > 0 ? repo.languages.nodes[0].name : ''}</div>
            </div>
            <div class="star-count  d-flex">
                <div>
                    <svg class="mr-1" viewBox="0 0 16 16" version="1.1" width="16"
                        height="16" aria-hidden="true">
                        <path fill-rule="evenodd"
                            d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
                        </path>
                    </svg>
                </div>
                <div class="star-count">${formatNumber(Number(repo.parent ? repo.parent.stargazerCount : 0))}</div>
            </div>
            <div class="members  d-flex">
                <div>
                    <svg aria-label="fork" viewBox="0 0 16 16"
                        version="1.1" width="16" height="16" role="img">
                        <path fill-rule="evenodd"
                            d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z">
                        </path>
                    </svg>
                </div>
                <div class="members-count">${formatNumber(Number(repo.parent ? repo.parent.forkCount : 0))}</div>
            </div>
            <div class="updated-at">Updated ${formatDate(repo.updatedAt)}</div>
        </div>
    </div>`
    })

    statusContainer.innerHTML = `<div class="status d-flex align-center justify-space-around">${emojiHTML}</div>`

}

function formatNumber(num) {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
}

function formatDate(date) {
    const options = { day: "numeric", month: "short" };
    return new Date(date).toLocaleDateString("en-NG", options);
}