async function getLobbyData() {
    const lobbyID = getCookie('lobbyid')
    let response = await fetch('/lobby?id=' + lobbyID, {
        method: "POST"
    })
    response = await response.json()

    if (response == 'lobby does not exist') {
        document.querySelector('h1').innerHTML = 'Lobby was deleted'
        document.querySelector('main').innerHTML = '<button onclick="leaveLobby()">leave lobby</button>'
    } else {
        if (response.started) {
            location.href = "/game"
        }
        makeDOM(response)
    }


}


function makeDOM(lobby) {
    switch (getCookie('username')) {
        case lobby.player1:
            if (!document.querySelector('#start')) {
                const startBtn = document.createElement('button')
                startBtn.innerHTML = 'start game'
                startBtn.id = 'start'
                startBtn.addEventListener('click', startGame)
                document.querySelector('span').append(startBtn)
            }

            if (!document.querySelector('#delete')) {
                const deleteBtn = document.createElement('button')
                deleteBtn.innerHTML = 'delete lobby'
                deleteBtn.id = 'delete'
                deleteBtn.addEventListener('click', deleteLobby)
                document.querySelector('span').append(deleteBtn)
            }

            if (lobby.player2) {
                document.querySelector('h1').innerHTML = 'Start the game!'
            } else {
                document.querySelector('h1').innerHTML = 'Waiting for oponent...'
            }
            break;
        case lobby.player2:
            if (!document.querySelector('#leave')) {
                const leaveBtn = document.createElement('button')
                leaveBtn.innerHTML = 'leave lobby'
                leaveBtn.id = 'leave'
                leaveBtn.addEventListener('click', leaveLobby)
                document.querySelector('span').append(leaveBtn)
            }

            document.querySelector('h1').innerHTML = 'Wait for start'
            break;
    }

    if (lobby.player1) { document.getElementById("player1").innerHTML = lobby.player1 }

    if (lobby.player2) { document.getElementById("player2").innerHTML = lobby.player2 }
    else { document.getElementById("player2").innerHTML = lobby.player2 = '' }
}

async function leaveLobby() {
    await fetch('/leave?id=' + getCookie('lobbyid'), {
        method: 'POST'
    })
    document.cookie = `lobbyid=null; SameSite=false`;
    console.log(document.cookie)
    location.href = '/join'
}

async function deleteLobby() {
    await fetch('/delete?id=' + getCookie('lobbyid'), {
        method: 'POST'
    })
    document.cookie = `lobbyid=null; SameSite=false`;
    console.log(document.cookie)
    location.href = '/deleted'
}

async function startGame() {
    let response = await fetch('/start?id=' + getCookie('lobbyid'), {
        method: 'POST'
    })
    response = await response.text();
    console.log(response)
    // location.href = '/game'
}

function getCookie(cookieName) {
    const name = cookieName + '='
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let c = cookieArray[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

getLobbyData()
setInterval(() => {
    getLobbyData()
}, 1000);
