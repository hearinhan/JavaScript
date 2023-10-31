const searchEl = document.getElementById('search');

searchEl.addEventListener('keydown', () => {
    if (event.key === 'Enter') {
        const username = searchEl.value;

        fetch(`https://api.github.com/users/${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Not Found') {
                    profile.innerHTML = 'User not found';
                } else {
                    const html = `
                        <div class="profile_items">
                            <img class="profile_thumnail" src="${data.avatar_url}" alt="${data.login}">
                            <div class="profile_infos">
                                <h2>${data.login}</h2>
                                <p>${data.name}</p>
                                <p>Company: ${data.bio}</p>
                                <p>Website/Blog: ${data.url}</P>
                                <p>Followers: ${data.followers}</p>
                                <p>Following: ${data.following}</p>
                            </div>
                        </div>
                    `;
                    profile.innerHTML = html;
                }
            })
            .catch(error => console.error(error));
    }
})