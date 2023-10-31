const searchBtn = document.getElementById('searchBtn');
const search = document.getElementById('search');
const profile = document.getElementById('profile');

searchBtn.addEventListener('click', () => {
    const username = search.value;

    // GitHub API를 호출하여 사용자 정보 가져오기
    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Not Found') {
                profile.innerHTML = 'User not found';
            } else {
                const html = `
                    <div>
                        <img src="${data.avatar_url}" alt="${data.login}">
                        <h2>${data.login}</h2>
                        <p>${data.name}</p>
                        <p>${data.bio}</p>
                        <p>Followers: ${data.followers}</p>
                        <p>Following: ${data.following}</p>
                    </div>
                `;
                profile.innerHTML = html;
            }
        })
        .catch(error => console.error(error));
});
