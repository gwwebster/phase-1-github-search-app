const form = document.querySelector('#github_form');
const searchResults = document.querySelector('#github_container');
const userList = document.querySelector('#user_list');
const repoList = document.querySelector('#repos_list');
const Userbutton = document.querySelector('#user_submit_button');
const Repobutton = document.querySelector('#repo_submit_button');
const inputField = document.querySelector('#search');
const repoUl = document.querySelector('#repos_list')

Userbutton.addEventListener('click', (e) => {
    e.preventDefault()
    let input = inputField.value
    fetch(`https://api.github.com/search/users?q=${input}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(res => res.json())
    .then(data => {
        let usersInfoArray = []
        data.items.forEach((user) => {
            let userArray = []
            let nestedLiItems = []
            nestedLiItems.push(user.url)
            nestedLiItems.push(user.avatar_url)
            userArray.push(user.login)
            userArray.push(nestedLiItems)
            usersInfoArray.push(userArray)
        })
        renderUserInfo(usersInfoArray)
    })
});

function renderUserInfo(usersInfoArray) {
    userList.innerHTML = ''
    usersInfoArray.forEach(subArray => {
        let li = document.createElement('li')
        let span = document.createElement('span')
        span.className = 'user'
        span.textContent = subArray[0]
        li.appendChild(span)
        userList.appendChild(li)
        let subUl = document.createElement('ul')
        subUl.className = `${span.textContent}`
        li.appendChild(subUl)
        handleClick(li)
        subArray[1].forEach(url => {
            let subLi = document.createElement('li')
            subLi.textContent = url
            subUl.appendChild(subLi)
        })
    })
};

function handleClick(li) {
    li.addEventListener('click', function postRepos() {
        let userName = li.childNodes[0].textContent
        handleRepoFetch(userName)
    }, {once : true})
};

function handleRepoFetch(userName) {
    let repoArray = []
    fetch(`https://api.github.com/users/${userName}/repos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(res => res.json())
        .then(data => {
            data.forEach(piece => {
                repoArray.push(piece.html_url)
            })
            handleRepoRender(repoArray, userName)
        })
};

function handleRepoRender(repoArray, userName) {
    let subUl = document.querySelector(`.${userName}`)
    repoArray.forEach(url => {
        let newLi = document.createElement('li')
        let a = document.createElement('a')
        a.setAttribute('href', `${url}`)
        a.textContent = `${url}`
        newLi.appendChild(a)
        subUl.appendChild(newLi)
    })  
};

Repobutton.addEventListener('click', (e) => {
    e.preventDefault()
    let input = inputField.value
    handleRepoSearch(input)
});

function handleRepoSearch(input) {
    
    let repoArray = []
    fetch(`https://api.github.com/users/${input}/repos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            }
    })
    .then(res => res.json())
    .then(data => {
        data.forEach(piece => {
            repoArray.push(piece.html_url)
        })
        handleRepoSearchRender(repoArray)
    })
};

function handleRepoSearchRender(repoArray) {
    repoUl.innerHTML = ''
    repoArray.forEach(url => {
        let newLi = document.createElement('li')
        let a = document.createElement('a')
        a.setAttribute('href', `${url}`)
        a.textContent = `${url}`
        newLi.appendChild(a)
        repoUl.appendChild(newLi)
    })
};

