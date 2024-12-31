const tipForm = document.getElementById('tip-form');
const gameData = document.getElementById('gameData');
const tipsContainer = document.getElementById('tip-container');
onIceArray = []; 
var game0 = document.getElementById('game0');

const createCard = (tip) => {
  // Create card
  const cardEl = document.createElement('section');
  cardEl.classList.add('card', 'mb-3');
  cardEl.setAttribute('key', tip.tip_id);

const cardTitleEl = document.createElement('section');
cardTitleEl.classList.add('bg-info');
 cardTitleEl.innerHTML = `${tip.title} </br>`

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
rosterSpots = [];

function selectGame() {var inputVal = document.getElementById('datepicker').value;
  var date = inputVal.split('/');
  var formatted = date[2] + '-' + date[0] + '-' + date[1];
  console.log(formatted);
  var requestURL = 'https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/schedule/'+ formatted;
  console.log(requestURL);
  fetch(requestURL, {
    "method": "GET", "headers": {}
  })
    .then(function (response) {return response.json()})
    .then(function (data2) { 
      console.log('I am in schedule then');
      var numberOfGames = data2.gameWeek[0].games.length;
      for (var i = 0; i < numberOfGames; i++) {
        var gameName = document.createElement('button');
        gameName.setAttribute('id', 'game' + i);
        var idx = gameName.getAttribute('id');
        gameName.innerHTML = 'Game ' + i + ': ' + data2.gameWeek[0].games[i].awayTeam.abbrev + ' ' + data2.gameWeek[0].games[i].homeTeam.abbrev;
        document.getElementById('gamesPlayed').appendChild(gameName);
        gameName.addEventListener('click', displayGameData);
      }

      function displayGameData(event) {
        idx = event.currentTarget; idxString = event.currentTarget.textContent;
        idxArray = idxString.split(':'); idxNumber = idxArray[0].split(' ');
        console.log(idxNumber); gameNumber = idxNumber[1];
        const gameId = data2.gameWeek[0].games[gameNumber].id;
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
            console.log(data.rosterSpots);
            var gameTitle = document.createElement('h2'); gameTitle.textContent = '';
            gameTitle.innerHTML = 'You are watching stats for ' + data.awayTeam.abbrev + ' at ' + data.homeTeam.abbrev + ' game';
            document.getElementById('gameInfo').appendChild(gameTitle);
   
            for (i=0; i<data.rosterSpots.length; i++) {rosterSpots.push(data.rosterSpots[i].teamId, data.rosterSpots[i].sweaterNumber, data.rosterSpots[i].positionCode, data.rosterSpots[i].playerId)}
            console.log(rosterSpots);
                   
          var requestURL1 = 'https://cors-anywhere.herokuapp.com/api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=' + gameId;
          fetch(requestURL1, {"method": "GET", "headers": {}
          })
          .then(function (response) {
             return response.json();
            })
            .then(function (data1) {
            console.log('I am in third then', data1);
            
               for (i=0;i<data1.data.length;i++) { if (data1.data[i].typeCode===505) // goal loop
              { const gameInfoHome = document.createElement('section');
              gameInfoHome.setAttribute('id', 'gameInfoHome');
              document.getElementById('schedule').appendChild(gameInfoHome);
              // const totalScore = data.awayTeam.score + data.homeTeam.score;
              // console.log(totalScore);
              // console.log(i)
     
                periodNumber = data1.data[i].period;
                goalTime = data1.data[i].startTime; 
                goalTimeSeconds=Number(goalTime.split(':')[0])*60 + Number(goalTime.split(':')[1]);
                goalTimeSecondsAbsolute=goalTimeSeconds+(periodNumber-1)*1200;
                onIceArray.push('newGoal', goalTimeSecondsAbsolute)
                for (j=0; j<data1.data.length;j++) { // j loop counts all shifts and checks if a player was on ice when a goal was scored
                  shiftStart = data1.data[j].startTime.split(":");
                  shiftStartSeconds=Number(shiftStart[0])*60+Number(shiftStart[1]);
                  shiftEnd = data1.data[j].endTime.split(':');
                  shiftEndSeconds=Number(shiftEnd[0]*60) + Number(shiftEnd[1]);
                  
                  if ((shiftStartSeconds<goalTimeSeconds)&&(shiftEndSeconds>=goalTimeSeconds)&&(data1.data[j].period===periodNumber)) {
                  // console.log('player on ice ', j)
                    for (k=0;k<rosterSpots.length/4;k++) {if (rosterSpots[4*k+3]===data1.data[j].playerId) {
                    onIceArray.push(rosterSpots[4*k], rosterSpots[4*k+1], shiftStartSeconds, shiftEndSeconds)}
                  }} // end if and end k loop
                    } // end j loop
                    onIceSplit=[]; k=-1; goalTime=[[],[]]; onIceSplit2 = [];
                    for (j=0;j<onIceArray.length;j++) {
                    if (onIceArray[j]==='newGoal') {onIceSplit.push([]);
                      goalTime[0].push(onIceArray[j+1]);
                      goalTime[1].push(onIceArray[j+1]);
                      k=k+1}
                    else {onIceSplit[k].push(onIceArray[j]);
                    }
                  } // end short j loop
                  goalTime[0].sort((a, b) => a - b);
                 for (j=0;j<onIceSplit.length;j++) { // tempIndex=goalTime.indexOf(goalTime[1][j])
                  //   for (k=0;goalTime.length;k++) {if(goalTime[j]===onIceSplit[k][0]) {onIceSplit2.push([])
                  console.log(onIceSplit.length);
                  onIceSplit2.push(onIceSplit[goalTime[1].indexOf(goalTime[0][j])]);
                    for (k=0;k<(onIceSplit2[j].length-1)/4;k++) {onIceLineup = [[],[],[],[]]
                      console.log(j, k, onIceSplit2[j][4*k+2], onIceSplit2[j][4*k+1])
                      if (data.homeTeam.id===onIceSplit2[j][4*k+1]) {for (l=0;l<rosterSpots.length/4;l++) {
                        if ((data.homeTeam.id===rosterSpots[4*l])&&(rosterSpots[4*l+2]==='D')) {onIceLineup[2].push(rosterSpots[4*l+1])}
                         else if ((data.homeTeam.id===rosterSpots[4*l])&&((rosterSpots[4*l+2]==='R')||(rosterSpots[4*l+2]==='C')||(rosterSpots[4*l+2]==='L'))) {onIceLineup[3].push(rosterSpots[4*l+1])}
                      }
                    }
                    else if (data.awayTeam.id===onIceSplit2[j][4*k+1]) {}
                  }
                } // end j loop
                    console.log(goalTime, onIceSplit, onIceSplit2);
                    // onIceLineup = [[],[],[],[]]
                  //   for (j=0;j<(onIceSplit2[j].length-1)/4;j++) {if (data.homeTeam.id===onIceSplit2[j][4*j+1]) {for (k=0;k<rosterSpots.length/4;k++) {
                  //     if ((data.homeTeam.id===rosterSpots[4*k])&&(rosterSpots[4*k+2]==='D')) {onIceLineup[2].push(rosterSpots[4*k+1])}
                  //     else if ((data.homeTeam.id===rosterSpots[4*k])&&(rosterSpots[4*k+2]!='G')) {onIceLineup[3].push(rosterSpots[4*k+1])}
                  //   }}
                  // else if (data.awayTeam.id===onIceSplit2[j][4*j+1]) {for (k=0;k<rosterSpots.length/4;k++) {
                  //     if ((data.awayTeam.id===rosterSpots[4*k])&&(rosterSpots[4*k+2]==='D')) {onIceLineup[0].push(rosterSpots[4*k+1])}
                  //     else if ((data.awayTeam.id===rosterSpots[4*k])&&(rosterSpots[4*k+2]!='G')) {onIceLineup[1].push(rosterSpots[4*k+1])}
                  //   }}
                  // }
                  console.log(onIceLineup)
                    var newGoal1 = document.createElement('span');
                    // console.log(data1.data[i], data1.data.length, rosterSpots);
                    newGoal1.innerHTML = 'Period: ' + data1.data[i].period + ' Time: ' + data1.data[i].startTime + ' Scorer: ' + data1.data[i].lastName + ' Assists: ' + data1.data[i].eventDetails;
                      document.getElementById('gameInfoHome').appendChild(newGoal1);
                   //  console.log(onIceArray, rosterSpots)
              }            
              } // end i loop          
            }); // end third second .then
          });
      } // end displayGamedata
    } // end first second .then
    );
}

tipForm.addEventListener('submit', handleFormSubmit);

