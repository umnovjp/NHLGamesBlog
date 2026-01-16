const tipForm = document.getElementById('tip-form');
const gameData = document.getElementById('gameData');
const tipsContainer = document.getElementById('tip-container');
onIceArray = []; onIceArray2 = []; goalsNumber = []; var gameId; const plusMinusArray = [[[],[],[]],[[],[],[]]];
var game0 = document.getElementById('game0');
const frequency = (arr, item) => {let count = 0;
  for (let i = 0; i < arr.length; i++) {if (arr[i] === item) {count++}}
  return count;
};

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

function selectGame() {var inputVal = document.getElementById('datepicker').value;
  var date = inputVal.split('/');
  var formatted = date[2] + '-' + date[0] + '-' + date[1];
  // var requestURL = 'https://corsproxy.io/https://api-web.nhle.com/v1/schedule/'+ formatted; date games displayed
  var requestURL = 'https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/schedule/'+ formatted;
  console.log(requestURL);
  fetch(requestURL, {
    "method": "GET", "headers": {}
  })
    .then(function (response) {return response.json()})
    .then(function (data2) { console.log('I am in schedule then');
      var numberOfGames = data2.gameWeek[0].games.length;
      for (var i = 0; i < numberOfGames; i++) { var gameName = document.createElement('button');
        gameName.setAttribute('id', 'game' + i); var idx = gameName.getAttribute('id');
        gameName.innerHTML = 'Game ' + i + ': ' + data2.gameWeek[0].games[i].awayTeam.abbrev + ' ' + data2.gameWeek[0].games[i].homeTeam.abbrev;
        document.getElementById('gamesPlayed').appendChild(gameName);
        gameName.addEventListener('click', displayGameData);
      }

      function displayGameData(event) { idx = event.currentTarget; idxString = event.currentTarget.textContent;
        idxArray = idxString.split(':'); idxNumber = idxArray[0].split(' ');
        console.log(idxNumber); gameNumber = idxNumber[1];
        var gameId = data2.gameWeek[0].games[gameNumber].id; gameIdNumber=document.createElement('span');
        gameIdNumber.setAttribute('id', 'gameId');
        gameIdNumber.innerHTML='abc';
        
        console.log(gameId);
        // var requestURL = 'https://corsproxy.io/https://api-web.nhle.com/v1/gamecenter/' + gameId + '/play-by-play'; to select game on certain date
        var requestURL = 'https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/gamecenter/' + gameId + '/play-by-play';
        fetch(requestURL, {
          "method": "GET", "headers": { }
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) { console.log('I am in second then');
            const gameInfo = document.createElement('section'); gameInfo.setAttribute('id', 'gameInfo');
            document.getElementById('schedule').appendChild(gameInfo);
            const gameInfoHome = document.createElement('section');
            gameInfoHome.setAttribute('id', 'gameInfoHome');
            document.getElementById('schedule').appendChild(gameInfoHome);
            var gameTitle = document.createElement('h2'); gameTitle.textContent = '';
            gameTitle.innerHTML = 'You are watching stats for ' + data.awayTeam.abbrev + ' at ' + data.homeTeam.abbrev + ' game # ' + gameId + '. ';
            document.getElementById('gameInfo').appendChild(gameTitle);
                   
          var requestURL1 = 'https://cors-anywhere.herokuapp.com/https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=' + gameId; // charts to find which players were on ice
          // var requestURL1 = 'https://corsproxy.io/?key=2ddedfd8&url=https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=' + gameId;
          fetch(requestURL1, {"method": "GET", "headers": {}
          })
          .then(function (response) { return response.json()
            })
            .then(function (data1) { console.log('I am in third then', data1);            
               for (i=0;i<data1.data.length;i++) { if (data1.data[i].typeCode===505) // goal loop
               { periodNumber = data1.data[i].period; goalsNumber.push(i); goalTime = data1.data[i].startTime; 
                goalTimeSeconds=Number(goalTime.split(':')[0])*60 + Number(goalTime.split(':')[1]);
                goalTimeSecondsAbsolute=goalTimeSeconds+(periodNumber-1)*1200; onIceArray.push('newGoal', goalTimeSecondsAbsolute);
                // console.log('period', periodNumber, 'data', data1.data[i])
                for (j=0; j<data1.data.length;j++) { // j loop counts all shifts and checks if a player was on ice when a goal was scored
                  shiftStart = data1.data[j].startTime.split(":"); shiftStartSeconds=Number(shiftStart[0])*60+Number(shiftStart[1]);
                  shiftEnd = data1.data[j].endTime.split(':'); shiftEndSeconds=Number(shiftEnd[0]*60) + Number(shiftEnd[1]);
                  
                  if ((shiftStartSeconds<goalTimeSeconds)&&(shiftEndSeconds>=goalTimeSeconds)&&(data1.data[j].period===periodNumber)) {
                    for (k=0;k<data.rosterSpots.length;k++) {if (data.rosterSpots[k].playerId===data1.data[j].playerId) {
                    onIceArray.push(data.rosterSpots[k].teamId, data.rosterSpots[k].sweaterNumber, shiftStartSeconds, shiftEndSeconds);
                  }}} // end if and end k loop
                    } // end j loop
                    console.log('onIceArray', onIceArray)
                    // console.log(data.homeTeam.id, data.awayTeam.id)
                    const goalType = [[],[]];
                    goalType[0].push(data.homeTeam.id); goalType[1].push(data.awayTeam.id);
                    const lastIndexOfOnIceArray = onIceArray.lastIndexOf('newGoal');
                    console.log('status', lastIndexOfOnIceArray, onIceArray)
                    
                    for (j=0;j<(onIceArray.length-2-lastIndexOfOnIceArray)/4;j++) { // console.log('onIceArray')
                      if (onIceArray[lastIndexOfOnIceArray+2+4*j]===data.homeTeam.id) {goalType[0].push(onIceArray[lastIndexOfOnIceArray+3+4*j])}
                  else if (onIceArray[lastIndexOfOnIceArray+2+4*j]===data.awayTeam.id) {goalType[1].push(onIceArray[lastIndexOfOnIceArray+3+4*j])}
                }
                  console.log('i= ', i, goalType); goalType2=[[],[]];
                  for (j=0;j<data.rosterSpots.length;j++) {for (k=0;k<2;k++) // k is home or away team
                    { for (l=1;l<goalType[k].length+1;l++) {if ((goalType[k][0]===data.homeTeam.id)&&(goalType[k][l]===data.rosterSpots[j].sweaterNumber)&&(data.rosterSpots[j].teamId===data.homeTeam.id)) {goalType2[k].push(data.rosterSpots[j].positionCode)}
                  else if ((goalType[k][0]===data.awayTeam.id)&&(goalType[k][l]===data.rosterSpots[j].sweaterNumber)&&(data.rosterSpots[j].teamId===data.awayTeam.id)) {goalType2[k].push(data.rosterSpots[j].positionCode)}
                  }}}
                    // console.log(goalType2);
                    goalType3=[[0,0,0,0],[0,0,0,0]];
                    for (j=0;j<2;j++) {for (k=0;k<goalType2[j].length;k++) {
                      if (goalType2[j][k]==='G') {goalType3[j][0]=goalType3[j][0]+1, goalType3[j][3]=goalType3[j][3]+1}
                      else if (goalType2[j][k]==='D') {goalType3[j][1]=goalType3[j][1]+1, goalType3[j][3]=goalType3[j][3]+1}
                      else if ((goalType2[j][k]==='C')||(goalType2[j][k]==='R')||(goalType2[j][k]==='L')) {goalType3[j][2]=goalType3[j][2]+1, goalType3[j][3]=goalType3[j][3]+1}
                    }}
                    console.log(goalType3);
                    var goalType4; 
                    if (data1.data[i].period===5) {goaltype4='shootout'}
                    else if ((goalType3[0][0]=1)&&(goalType3[0][1]=2)&&(goalType3[0][2]=3)&&(goalType3[1][0]=1)&&(goalType3[1][1]=2)&&(goalType3[1][2]=3)&&(data1.data[i].period<5)) {goalType4='5x5'}
                    else if ((goalType3[0][3]>goalType3[1][3])&&(goalType3[0][0]=1)&&(goalType3[1][0]=1)&&(data1.data[i].period<5)) {goalType4='homePP'}
                    else if ((goalType3[0][3]<goalType3[1][3])&&(goalType3[0][0]=1)&&(goalType3[1][0]=1)&&(data1.data[i].period<5)) {goalType4='homePK'}
                    else if ((goalType3[0][0]=0)&&(data1.data[i].period<5)) {goalType4='AwayEN'}
                    else if ((goalType3[1][0]=0)&&(data1.data[i].period<5)) {goalType4='HomeEN'}
                    else if ((goalType3[0][0]=1)&&(goalType3[1][0]=1)&&(goalType3[0][3]<6)&&(goalType3[1][3]<6)&&(goalType3[0][3]=goalType3[1][3])&&(data1.data[i].period<5)) {goalType4='specialTeams'}
                    else {goalType4='goalType4 undefined'}
                    
                    console.log(goalType4)
                    onIceSplit=[]; k=-1; goalTime=[[],[]]; onIceSplit2 = []; //goalTime[0] and goalTime[1] are array of times when each goal was scored [0] is ordered chronologically
                    for (j=0;j<onIceArray.length;j++) { if (onIceArray[j]==='newGoal') {onIceSplit.push([]);
                      goalTime[0].push(onIceArray[j+1]); goalTime[1].push(onIceArray[j+1]); k=k+1}
                    else {onIceSplit[k].push(onIceArray[j])}
                  } // end short j loop
                  goalTime[0].sort((a,b) => a-b);
                  // console.log(goalTime[0])
                 for (j=0;j<onIceSplit.length;j++) { // this loop is to order goals chronologically
                  onIceLineup = [[],[]];
                  onIceSplit2.push(onIceSplit[goalTime[1].indexOf(goalTime[0][j])]);
                  // console.log(onIceSplit2)
                    for (k=0;k<data.rosterSpots.length;k++) { for (l=0;l<(onIceSplit2[j].length-1)/4;l++) {                 
                    if ((data.rosterSpots[k].teamId===onIceSplit2[j][4*l+1])&&(data.rosterSpots[k].sweaterNumber===onIceSplit2[j][4*l+2])&&(data.rosterSpots[k].positionCode==='G')&&(data.rosterSpots[k].teamId===data.awayTeam.id))
                    { onIceLineup[0].push(onIceSplit2[j][4*l+2], 'G')}
                    else if ((data.rosterSpots[k].teamId===onIceSplit2[j][4*l+1])&&(data.rosterSpots[k].sweaterNumber===onIceSplit2[j][4*l+2])&&(data.rosterSpots[k].positionCode==='D')&&(data.rosterSpots[k].teamId===data.awayTeam.id))
                    { onIceLineup[0].push(onIceSplit2[j][4*l+2], 'D')}
                    else if ((data.rosterSpots[k].teamId===onIceSplit2[j][4*l+1])&&(data.rosterSpots[k].sweaterNumber===onIceSplit2[j][4*l+2])&&((data.rosterSpots[k].positionCode==='C')||(data.rosterSpots[k].positionCode==='R')||(data.rosterSpots[k].positionCode==='L'))&&(data.rosterSpots[k].teamId===data.awayTeam.id))
                    { onIceLineup[0].push(onIceSplit2[j][4*l+2], 'F')}
                    else if ((data.rosterSpots[k].teamId===onIceSplit2[j][4*l+1])&&(data.rosterSpots[k].sweaterNumber===onIceSplit2[j][4*l+2])&&(data.rosterSpots[k].positionCode==='G')&&(data.rosterSpots[k].teamId===data.homeTeam.id))
                    { onIceLineup[1].push(onIceSplit2[j][4*l+2], 'G')}                     
                    else if ((data.rosterSpots[k].teamId===onIceSplit2[j][4*l+1])&&(data.rosterSpots[k].sweaterNumber===onIceSplit2[j][4*l+2])&&(data.rosterSpots[k].positionCode==='D')&&(data.rosterSpots[k].teamId===data.homeTeam.id))
                    { onIceLineup[1].push(onIceSplit2[j][4*l+2], 'D')}
                    else if ((data.rosterSpots[k].teamId===onIceSplit2[j][4*l+1])&&(data.rosterSpots[k].sweaterNumber===onIceSplit2[j][4*l+2])&&((data.rosterSpots[k].positionCode==='C')||(data.rosterSpots[k].positionCode==='R')||(data.rosterSpots[k].positionCode==='L'))&&(data.rosterSpots[k].teamId===data.homeTeam.id))
                    { onIceLineup[1].push(onIceSplit2[j][4*l+2], 'F')}
                  }} // end k loop
                  for (k=0;k<2;k++) { var lineUp =''; var lineUpG ='';
                    if (onIceLineup[k].indexOf('G')!=-1) {lineUpG = onIceLineup[k][onIceLineup[k].indexOf('G')-1].toString()+' '}
                    else {lineUpG = ' '}
                    for (l=1;l<onIceLineup[k].length;l++) { if (frequency(onIceLineup[k], 'D')===1) {lineUp=lineUpG.concat(onIceLineup[k][l-1].toString())}
                    else { if (onIceLineup[k][l]==='D') {
                      if (l==onIceLineup[k].lastIndexOf('D')) {lineUp=lineUpG.concat(onIceLineup[k][l-1].toString())}
                  else {lineUp=lineUpG.concat(onIceLineup[k][l-1].toString(), '-')}
                  lineUpG=lineUp }}}
                    lineUpG=lineUp;
    
                    for (l=0;l<onIceLineup[k].length;l++) {if (onIceLineup[k][l]==='F') {if (l===onIceLineup[k].indexOf('F')) { lineUp=lineUpG.concat(' ', onIceLineup[k][l-1].toString(), '-')}
                    // should it be D and not F? Will look tomorrow
                    else if (l===onIceLineup[k].lastIndexOf('F')) {lineUp=lineUpG.concat(onIceLineup[k][l-1].toString())}
                    else (lineUp=lineUpG.concat(onIceLineup[k][l-1].toString(), '-'))
                    lineUpG=lineUp}}
                    onIceArray2.push(lineUp)
                    // new function will determine if play was 5x5 or PP or PK or other special teams like 3x3 in OT
                  }} // end k,j loop                   
                    }} // end goal if statement and i loop

                    console.log('onIceArray2', onIceArray2)
                    for (i=0;i<goalsNumber.length;i++) { var newGoal2 = document.createElement('span');
                    newGoal2.innerHTML='<br>'+'Period: '+data1.data[goalsNumber[goalTime[1].indexOf(goalTime[0][i])]].period+' Time: '+data1.data[goalsNumber[goalTime[1].indexOf(goalTime[0][i])]].startTime+' Scorer: '+data1.data[goalsNumber[goalTime[1].indexOf(goalTime[0][i])]].lastName+
                    ' Assists: '+data1.data[goalsNumber[goalTime[1].indexOf(goalTime[0][i])]].eventDetails+' '+onIceArray2[onIceArray2.length-2*onIceSplit.length+2*i]+' '+onIceArray2[1+onIceArray2.length-2*onIceSplit.length+2*i];
                    document.getElementById('gameInfo').appendChild(newGoal2);  
                    // to split onIceArray2 above to 2-3 elements
                  }
            }); // end third second .then
          });
      } // end function displayGamedata
    } // end first second .then
    )} // end function selectGame

    // Get a list of existing tips from the server
const getTips = () =>
  fetch('api/tips', { method: 'GET', // or 'PUT'
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

console.log(gameId)

// Function to handle when a user submits the feedback form
const handleFormSubmit = (e) => {
  e.preventDefault();
  console.log('Form submit invoked');

  const tipTitle = document.getElementById('gameInfo').textContent;

  // Get the value of the tip and save it to a variable
  const tipContent = document.getElementById('tipText').value;

  // get the value of the username and save it to a variable
  const tipUsername = document.getElementById('tipUsername').value.trim();
  // const gameIdNumber = document.getElementById('gameId').textContent;
  console.log(tipTitle)

  // Create an object with the tip and username
  const newTip = {
    title: tipTitle,
    username: tipUsername,
    topic: 'UX',
    tip: tipContent,
    // tip_id
    // gameId: gameIdNumber
  };
  // Make a fetch POST request to the server
  postTip(newTip);
}

tipForm.addEventListener('submit', handleFormSubmit);