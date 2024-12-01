const tipForm = document.getElementById('tip-form');
const gameData = document.getElementById('gameData');
const tipsContainer = document.getElementById('tip-container');
onIceArray = []
var game0 = document.getElementById('game0');

const createCard = (tip) => {
  // Create card
  const cardEl = document.createElement('section');
  cardEl.classList.add('card', 'mb-3');
  cardEl.setAttribute('key', tip.tip_id);

const cardTitleEl = document.createElement('section');
cardTitleEl.classList.add('bg-info');
 cardTitleEl.innerHTML = `${tip.title} </br>` // gameTitle.innerHTML;

  // Create card header
  const cardHeaderEl = document.createElement('h4');
  cardHeaderEl.classList.add(
    'card-header',
    'bg-primary',
    'text-light',
    'p-2',
    'm-0'
  );
  cardHeaderEl.innerHTML = `${tip.username} </br>`;

  // Create card body
  const cardBodyEl = document.createElement('div');
  cardBodyEl.classList.add('card-body', 'bg-light', 'p-2');
  cardBodyEl.innerHTML = `<p>${tip.tip}</p>`;

  // Append the header and body to the card element
  cardEl.appendChild(cardTitleEl);
  cardEl.appendChild(cardHeaderEl);
  cardEl.appendChild(cardBodyEl);

  // Append the card element to the tips container in the DOM
  tipsContainer.appendChild(cardEl);
};

// Get a list of existing tips from the server
const getTips = () =>
  fetch('api/tips', {
    method: 'GET', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error('Error:', error);
    });

// Post a new tip to the page
const postTip = (tip) =>
  fetch('api/tips', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tip),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data);
      createCard(tip);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

// When the page loads, get all the tips
getTips().then((data) => data.forEach((tip) => createCard(tip)));

// Function to handle when a user submits the feedback form
const handleFormSubmit = (e) => {
  e.preventDefault();
  console.log('Form submit invoked');

  const tipTitle = document.getElementById('gameInfo').textContent;

  // Get the value of the tip and save it to a variable
  const tipContent = document.getElementById('tipText').value;

  // get the value of the username and save it to a variable
  const tipUsername = document.getElementById('tipUsername').value.trim();

  console.log(document.getElementById('game0').textContent);

  // Create an object with the tip and username
  const newTip = {
    title: tipTitle,
    username: tipUsername,
    topic: 'UX',
    tip: tipContent,
  };
  // Make a fetch POST request to the server
  postTip(newTip);
};

function selectGame() {
  // var inputVal = document.getElementById('myInput').value;
  var inputVal = document.getElementById('datepicker').value;
 // console.log('inputVal= ' + inputVal);

  var date = inputVal.split('/');
  // console.log(date);
  var formatted = date[2] + '-' + date[0] + '-' + date[1];
  console.log(formatted);
  var requestURL = 'https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/schedule/'+ formatted;
  //'https://statsapi.web.nhl.com/api/v1/schedule/?date=' 
  console.log(requestURL);
  fetch(requestURL, {
    "method": "GET", "headers": {    }
  })

    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('I am in schedule then')
      console.log(data.gameWeek[0].games);
    //  console.log(data.gameWeek[0].games[0].awayTeam.abbrev);
      var numberOfGames = data.gameWeek[0].games.length;
      for (var i = 0; i < numberOfGames; i++) {
        var gameName = document.createElement('button');
        gameName.setAttribute('id', 'game' + i);
        var idx = gameName.getAttribute('id');
        gameName.innerHTML = 'Game ' + i + ': ' + data.gameWeek[0].games[i].awayTeam.abbrev + ' ' + data.gameWeek[0].games[i].homeTeam.abbrev;
        document.getElementById('gamesPlayed').appendChild(gameName);
        gameName.addEventListener('click', displayGameData);
      }

      function displayGameData(event) {
        idx = event.currentTarget;
        idxString = event.currentTarget.textContent;
        idxArray = idxString.split(':');
        idxNumber = idxArray[0].split(' ');
        console.log(idxNumber);
        gameNumber = idxNumber[1];

        const gameId = data.gameWeek[0].games[gameNumber].id;
        console.log(gameId);
        var requestURL = 'https://cors-anywhere.herokuapp.com/api-web.nhle.com/v1/gamecenter/' + gameId + '/play-by-play';
        fetch(requestURL, {
          "method": "GET", "headers": { }
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log('I am in second then')
            console.log(data);
            const gameInfo = document.createElement('section');
            gameInfo.setAttribute('id', 'gameInfo');
            document.getElementById('schedule').appendChild(gameInfo);
            const gameInfoHome = document.createElement('section');
            gameInfoHome.setAttribute('id', 'gameInfoHome');
            document.getElementById('schedule').appendChild(gameInfoHome);
            const gameInfoAway = document.createElement('section');
            gameInfoAway.setAttribute('id', 'gameInfoAway');
            document.getElementById('schedule').appendChild(gameInfoAway);
            var gameTitle = document.createElement('h2');
            gameTitle.textContent = '';
            gameTitle.innerHTML = 'You are watching stats for ' + data.awayTeam.abbrev + ' at ' + data.homeTeam.abbrev + ' game';
            document.getElementById('gameInfo').appendChild(gameTitle);
            

            for (i = 0; i < data.plays.length; i++) { //171-213
              if (data.plays[i].typeDescKey==='goal') {
                scoringPlay = data.plays[i];
                var newGoal = document.createElement('p');
                periodNumber = data.plays[i].periodDescriptor.number;
                goalTime = data.plays[i].timeInPeriod;
                newGoal.innerHTML = 'Period: ' + data.plays[i].periodDescriptor.number + ' Time: ' + data.plays[i].timeInPeriod + ' Score: ' + data.plays[i].details.awayScore + ' : ' + data.plays[i].details.homeScore;
                document.getElementById('gameInfo').appendChild(newGoal);
                for (j=0; j<data.rosterSpots.length; j++) {if (data.rosterSpots[j].playerId === data.plays[i].details.scoringPlayerId) {
                  var goalScorer = document.createElement('span');
                  goalScorer.innerHTML = 'goal: ' + data.rosterSpots[j].firstName.default + ' ' + data.rosterSpots[j].lastName.default + ' ';
                  document.getElementById('gameInfo').appendChild(goalScorer);
                }
              else if ((data.plays[i].details.assist1PlayerId>1000)&&(data.rosterSpots[j].playerId === data.plays[i].details.assist1PlayerId)) {
                var assist1 = document.createElement('span');
                assist1.innerHTML = 'assist 1 ' + data.rosterSpots[j].firstName.default + ' ' + data.rosterSpots[j].lastName.default + ' ';
                  document.getElementById('gameInfo').appendChild(assist1);
              }
              else if (data.rosterSpots[j].playerId === data.plays[i].details.assist2PlayerId) {
                var assist2 = document.createElement('span');
                assist2.innerHTML = 'assist 2 ' + data.rosterSpots[j].firstName.default + ' ' + data.rosterSpots[j].lastName.default + ' ';
                document.getElementById('gameInfo').appendChild(assist2);
              }}
              
              var requestURL1 = 'https://cors-anywhere.herokuapp.com/api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=' + gameId;
              fetch(requestURL1, {"method": "GET", "headers": {}
              })
              .then(function (response) {
                 return response.json();
                })
                .then(function (data) {
                console.log('I am in third then', data)
                for (j=0; j<data.data.length;j++) {
                 // if (data.data[j].typeCode===517) {
                    shiftStart = data.data[j].startTime.split(":");
              shiftStartSeconds=Number(shiftStart[0])*60+Number(shiftStart[1]);
              shiftEnd = data.data[j].endTime.split(':');
              shiftEndSeconds=Number(shiftEnd[0]*60) + Number(shiftEnd[1]);
              
              goalTimeSeconds=Number(goalTime.split(':')[0])*60 + Number(goalTime.split(':')[1]);
              if ((shiftStartSeconds<goalTimeSeconds)&&(shiftEndSeconds>=goalTimeSeconds)&&(data.data[j].period===periodNumber)) {
                console.log(data.data[j].lastName, data.data[j].startTime, goalTimeSeconds, shiftStartSeconds, shiftEndSeconds)
                onIceArray.push(data.data[j].lastName, data.data[j].startTime, goalTimeSeconds, shiftStartSeconds, shiftEndSeconds)}
              
           // }
          } // end j loop
          console.log(onIceArray)
                });
                         
            }
            
          } // end i loop
          
          });

          

        // function getRoster(event) { // this function is not used for now
        //   var genre = event.currentTarget.value;
        //   console.log('u r in get roster');

        //   var requestURL = 'https://statsapi.web.nhl.com/api/v1/game/' + gameId + '/feed/live';
        //   fetch(requestURL, {
        //     "method": "GET", "headers": {
        //     }
        //   })

        //     .then(function (response) {
        //       return response.json();
        //     })
        //     .then(function (data) {
        //       console.log(data.gameData.players)

        //       var obj = data.gameData.players;
        //       var keys = Object.keys(obj);

        //       var awayRoster = document.createElement('h2');
        //       awayRoster.innerHTML = data.gameData.teams.away.name + ' Roster ';
        //       awayRoster.setAttribute('id', 'awayTeamId');
        //       document.getElementById('gameInfoAway').appendChild(awayRoster);

        //       var homeRoster = document.createElement('h2');
        //       homeRoster.innerHTML = data.gameData.teams.home.name + ' Roster ';
        //       homeRoster.setAttribute('id', 'homeTeamId');
        //       document.getElementById('gameInfoHome').appendChild(homeRoster);
        //       const homeRosterArray = [];
        //       const awayRosterArray = [];

        //       for (var i = 0; i < keys.length; i++) {
        //         var val = obj[keys[i]];
        //         const playerName1 = val.fullName;
        //         const lastName = val.lastName;
        //         const primaryNumber1 = val.primaryNumber;
        //         const tempAttribute = playerName1;
        //         var playerName = document.createElement('p');
        //         if (val.primaryPosition.code == 'G')
        //         {playerName.innerHTML = val.primaryNumber + ' ' + val.fullName + ', ' + val.primaryPosition.code + ' catches:' + val.shootsCatches + ','}
        //         else 
        //         {playerName.innerHTML = val.primaryNumber + ' ' + val.fullName + ', ' + val.primaryPosition.code + ' shoots:' + val.shootsCatches + ','};
        //         playerName.setAttribute('id', tempAttribute);
        //         if (val.currentTeam.id == data.gameData.teams.away.id) {
        //           document.getElementById('awayTeamId').appendChild(playerName);
        //           awayRosterArray.push(primaryNumber1);
        //           awayRosterArray.push(playerName1);
        //           rosterArray = awayRosterArray;
        //         }
        //         else if (val.currentTeam.id == data.gameData.teams.home.id) {
        //           //    console.log(val.fullName + ' ' + val.currentTeam.name + ' ' + val.currentTeam.id + data.gameData.teams.home.id);
        //           document.getElementById('homeTeamId').appendChild(playerName);
        //           homeRosterArray.push(primaryNumber1);
        //           homeRosterArray.push(playerName1);
        //         }
        //       }
        //       console.log(homeRosterArray);
        //       console.log(awayRosterArray);
        //     });
        // }
      }
    }
    );
}

tipForm.addEventListener('submit', handleFormSubmit);

