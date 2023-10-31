// html id 선언
const profile = document.getElementById('plofile'); 

// create element 선언
function createGithubFinderElement(item) {
    const itemEl = document.createElement('div'); // div 생성
    itemEl.classList.add('profile_items');
    itemEl.innerText = 'test';

    // append
    itemEl.append(profile);
}
