const tipForm = document.getElementById('tip-form');
const tipsContainer = document.getElementById('tip-container');
onIceArray = []; goalsNumber = []; var gameId;
var goalType6=[]; var goalTime2=[[],[]];
seasonData = [{team: 'WPG', lineup: []}, {team: 'DAL', lineup: []}, {team: 'COL', lineup: []}, {team: 'MIN', lineup: []}, {team: 'VGK', lineup: []}, {team: 'UTA', lineup: []}];
var game0 = document.getElementById('game0'); 

const createCard = (tip) => { // Create card
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
  // var requestURL = 'https://corsproxy.io/https://api-web.nhle.com/v1/schedule/'+ formatted; // date games displayed formatted example 2025-11-14
  var requestURL = 'https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/schedule/'+ formatted; 
  fetch(requestURL, {
    "method": "GET", "headers": {}
  })
    .then(function (response) {return response.json()})
    .then(function (data2) { // console.log('I am in schedule then', data2);
      var numberOfGames = data2.gameWeek[0].games.length;
      for (var i = 0; i < numberOfGames; i++) { var gameName = document.createElement('button');
        gameName.setAttribute('id', 'game' + i); var idx = gameName.getAttribute('id');
        gameName.innerHTML = 'Game ' + i + ': ' + data2.gameWeek[0].games[i].awayTeam.abbrev + ' ' + data2.gameWeek[0].games[i].homeTeam.abbrev;
        document.getElementById('gamesPlayed').appendChild(gameName);
        gameName.addEventListener('click', displayGameData)
      }

      function displayGameData(event) { idx = event.currentTarget; idxString = event.currentTarget.textContent;
        idxArray = idxString.split(':'); idxNumber = idxArray[0].split(' '); gameNumber = idxNumber[1];
        var gameId = data2.gameWeek[0].games[gameNumber].id;
        var gameIdSplit = String(gameId).split(''); var gameType;

        if (gameIdSplit[5]==='3') {gameType='playoff'}
        else if ((gameIdSplit[5]==='2')||(gameIdSplit[5]==='1')) {gameType='regular'}
        else {gameType='who knows'}
        var requestURL = 'https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/gamecenter/' + gameId + '/play-by-play';
        // var requestURL = 'https://corsproxy.io/https://api-web.nhle.com/v1/gamecenter/' + gameId + '/play-by-play'; to select game on certain date
        // var requestURL = 'https://corsproxy.io/https://api-web.nhle.com/v1/gamecenter/' + gameId + '/play-by-play';
        fetch(requestURL, {
          "method": "GET", "headers": { }
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) { console.log('I am in second then', data.awayTeam.abbrev, data.homeTeam.abbrev);
            console.log(data);
            const gameIdNumber = document.createElement('section'); gameIdNumber.setAttribute('id', 'gameIdNumber');
            gameIdNumber.innerHTML=gameId+' '+data.awayTeam.id+' '+data.homeTeam.id;
            document.getElementById('schedule').appendChild(gameIdNumber);
            const gameInfo = document.createElement('section'); gameInfo.setAttribute('id', 'gameInfo');
            document.getElementById('schedule').appendChild(gameInfo);
            var gameTitle = document.createElement('h2'); gameTitle.textContent = '';
            gameTitle.innerHTML = 'You are watching stats for ' + data.awayTeam.abbrev + ' at ' + data.homeTeam.abbrev + ' game # ' + gameId + ' on ' + formatted + '. ';
            document.getElementById('gameInfo').appendChild(gameTitle);
            const lineups = document.createElement('section');
            document.getElementById('gameInfo').appendChild(lineups);
            fullLineup = [[],[]];
            fetch ('/api/tips',
          {'method': 'GET'
           }
          )
          .then(function(response) {return(response.json())})
          .then(function(data3) { console.log(data3, gameId)
            topicArray =[]; // Data3Global = data3;
            for (i=0;i<data3.length;i++) {topicArray.push(parseInt(data3[i].topic))}
          //   if (topicArray.includes(gameId)) {console.log('game already there')}
          // else {console.log('game is not there')}
          console.log('I am in checking loop');
            
            for (i=0;i<data.rosterSpots.length;i++) { 
              const obj = {playerId: data.rosterSpots[i].playerId, teamId: data.rosterSpots[i].teamId, number: data.rosterSpots[i].sweaterNumber, position: data.rosterSpots[i].positionCode, fiveOnFive: [0,0], PP: [0,0], PK: [0,0], specialTeams: [0,0], FiveOnSix: [0,0], SixOnFive: [0,0], overtime: [0,0]}
            if (data.rosterSpots[i].teamId===data.awayTeam.id) { fullLineup[1].push(obj) }
            else {fullLineup[0].push(obj) }
            }
                   
          var requestURL1 = 'https://cors-anywhere.herokuapp.com/https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=' + gameId; // charts to find which players were on ice
          // var requestURL1 = 'https://corsproxy.io/?key=2ddedfd8&url=https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=' + gameId;
          fetch(requestURL1, {"method": "GET", "headers": {}
          })
          .then(function (response) { return response.json()
            })
            .then(function (data1) { console.log('I am in third then', data1);

               for (i=0;i<data.plays.length;i++) { if (data.plays[i].typeCode===505) // goal loop
                { var whoScored ='whichTeam';
                  if (data.plays[i].eventDescription==='Shootout') {console.log(data.plays[i].lastName)}
                  if (data.plays[i].details.eventOwnerTeamId===data.awayTeam.id) {whoScored='awayGoal'}
                  else if (data.plays[i].details.eventOwnerTeamId===data.homeTeam.id) {whoScored='homeGoal'}
                  
                  // periodNumber=data.plays[i].periodDescriptor.number; 
                  goalTime=data.plays[i].timeInPeriod
                  periodNumber = data.plays[i].periodDescriptor.number; goalsNumber.push(i); // goalTime = data.plays[i].startTime;
                  goalTimeSeconds=Number(goalTime.split(':')[0])*60 + Number(goalTime.split(':')[1]);
                  goalTimeSecondsAbsolute=goalTimeSeconds+(periodNumber-1)*1200; 
                  
                  onIceArray.push('newGoal', goalTimeSecondsAbsolute);
                  for (j=0; j<data1.data.length;j++) { // j loop counts all shifts and checks if a player was on ice when a goal was scored
                  shiftStart = data1.data[j].startTime.split(":"); shiftStartSeconds=Number(shiftStart[0])*60+Number(shiftStart[1]);
                  shiftEnd = data1.data[j].endTime.split(':'); shiftEndSeconds=Number(shiftEnd[0]*60) + Number(shiftEnd[1]);
                  
                  if ((shiftStartSeconds<goalTimeSeconds)&&(shiftEndSeconds>=goalTimeSeconds)&&(data1.data[j].period===periodNumber)) {
                    for (k=0;k<data.rosterSpots.length;k++) {if (data.rosterSpots[k].playerId===data1.data[j].playerId) { onIceArray.push(data.rosterSpots[k].teamId, data.rosterSpots[k].sweaterNumber, shiftStartSeconds, shiftEndSeconds);
                  }}} // end if and end k loop
                    } // end j loop
                    console.log(whoScored, goalTimeSecondsAbsolute)
                    // onIceArray structure: newGoal string follows by time of the goal in seconds, teamId, sweaterNumber, shiftSratSeconds, shiftEndSeconds
                    // game vs BUF on 04/15/26 is example of a game with multiple SO goals/ Score was 3:3 but shootout was 3:2 Stars
                    const goalType = [[],[]];
                    goalType[0].push(data.homeTeam.id); goalType[1].push(data.awayTeam.id);
                    const lastIndexOfOnIceArray = onIceArray.lastIndexOf('newGoal'); // that is wrong when a goal is scored in shootout but started working on that
                    
                    for (j=0;j<(onIceArray.length-2-lastIndexOfOnIceArray)/4;j++) { if (onIceArray[lastIndexOfOnIceArray+2+4*j]===data.homeTeam.id) {goalType[0].push(onIceArray[lastIndexOfOnIceArray+3+4*j])}
                  else if (onIceArray[lastIndexOfOnIceArray+2+4*j]===data.awayTeam.id) {goalType[1].push(onIceArray[lastIndexOfOnIceArray+3+4*j])}}
                  goalType2=[[],[]];
                  for (j=0;j<data.rosterSpots.length;j++) {for (k=0;k<2;k++) // k is home or away team
                    { for (l=1;l<goalType[k].length+1;l++) {if ((goalType[k][0]===data.homeTeam.id)&&(goalType[k][l]===data.rosterSpots[j].sweaterNumber)&&(data.rosterSpots[j].teamId===data.homeTeam.id)) {goalType2[k].push(data.rosterSpots[j].positionCode)}
                  else if ((goalType[k][0]===data.awayTeam.id)&&(goalType[k][l]===data.rosterSpots[j].sweaterNumber)&&(data.rosterSpots[j].teamId===data.awayTeam.id)) {goalType2[k].push(data.rosterSpots[j].positionCode)}
                  }}}
                  // goalType is array of players on ice, but goalType2 is array of their positions like G or D or C or L or R
                  // goalType5 is array of numbers by position who was on ice during the goal
                    goalType5 = [[[],[],[]],[[],[],[]]]; // do not need to count D and F separately, just total number and if a goalie was present
                    for (j=0;j<2;j++) {for (k=0;k<goalType2[j].length;k++) {
                      if (goalType2[j][k]==='G') { goalType5[j][0].push(goalType[j][k+1])}
                      else if (goalType2[j][k]==='D') { goalType5[j][1].push(goalType[j][k+1])}
                      else if ((goalType2[j][k]==='C')||(goalType2[j][k]==='R')||(goalType2[j][k]==='L')) { goalType5[j][2].push(goalType[j][k+1])}
                    }}
                    // goalType5 should be solution to count goal as 5x5 or other
                    for (j=0;j<2;j++) {goalTime2[j].push(goalTimeSecondsAbsolute)} // goalTime2[0] and goalTime2[1] are arrays of when a goal was scored. But goalTime2[0] is an ordered array
                    goalTime2[0].sort((a,b) => a-b); // do not need it anymore
                                        
                    var goalType4;
                    if ((goalType5[0][0].length===1)&&(goalType5[0][1].length+goalType5[0][2].length===5)&&(goalType5[1][0].length===1)&&(goalType5[1][1].length+goalType5[1][2].length===5)&&(whoScored==='homeGoal')) {goalType4='fiveOnFiveHome'}
                    else if ((goalType5[0][0].length===1)&&(goalType5[0][1].length+goalType5[0][2].length===5)&&(goalType5[1][0].length===1)&&(goalType5[1][1].length+goalType5[1][2].length===5)&&(whoScored==='awayGoal')) {goalType4='fiveOnFiveAway'}
                    else if ((data.plays[i].periodDescriptor.number===5)&&(gameType='regular')) {goalType4='shootout'} // need to add a loop to add different players to shutout not just one scorer
                    else if ((data.plays[i].periodDescriptor.number===4)&&(gameType='regular')&&(goalType5[0][1].length+goalType5[0][2].length===goalType5[1][1].length+goalType5[1][2].length)&&(whoScored==='homeGoal')) {goalType4='OTHome'}
                    else if ((data.plays[i].periodDescriptor.number===4)&&(gameType='regular')&&(goalType5[0][1].length+goalType5[0][2].length===goalType5[1][1].length+goalType5[1][2].length)&&(whoScored==='awayGoal')) {goalType4='OTAway'}
                    else if ((goalType5[0][0].length+goalType5[0][1].length+goalType5[0][2].length>goalType5[1][0].length+goalType5[1][1].length+goalType5[1][2].length)&&(whoScored==='homeGoal')) {goalType4='HomePP_AwayPK'}
                    else if ((goalType5[0][0].length+goalType5[0][1].length+goalType5[0][2].length>goalType5[1][0].length+goalType5[1][1].length+goalType5[1][2].length)&&(whoScored==='awayGoal')) {goalType4='AwaySH'}
                    else if ((goalType5[0][0].length+goalType5[0][1].length+goalType5[0][2].length<goalType5[1][0].length+goalType5[1][1].length+goalType5[1][2].length)&&(whoScored==='awayGoal')) {goalType4='HomePK_AwayPP'}
                    else if ((goalType5[0][0].length+goalType5[0][1].length+goalType5[0][2].length<goalType5[1][0].length+goalType5[1][1].length+goalType5[1][2].length)&&(whoScored==='homeGoal')) {goalType4='HomeSH'}
                    else if ((goalType5[0][0].length===1)&&(goalType5[1][0].length===0)&&(goalType5[0][1].length+goalType5[0][2].length===5)&&(goalType5[1][1].length+goalType5[1][2].length===6)&&(whoScored==='homeGoal')) {goalType4='homeEN'}
                    else if ((goalType5[1][0].length===1)&&(goalType5[0][0].length===0)&&(goalType5[1][1].length+goalType5[1][2].length===5)&&(goalType5[0][1].length+goalType5[0][2].length===6)&&(whoScored==='awayGoal')) {goalType4='awayEN'}
                    else if ((goalType5[0][0].length===1)&&(goalType5[1][0].length===0)&&(goalType5[0][1].length+goalType5[0][2].length===5)&&(goalType5[1][1].length+goalType5[1][2].length===6)&&(whoScored==='awayGoal')) {goalType4='awaySixOnFive'}
                    else if ((goalType5[1][0].length===1)&&(goalType5[0][0].length===0)&&(goalType5[1][1].length+goalType5[1][2].length===5)&&(goalType5[0][1].length+goalType5[0][2].length===6)&&(whoScored==='homeGoal')) {goalType4='homeSixOnFive'}                    
                    else if ((goalType5[0][0].length===1)&&(goalType5[0][1].length+goalType5[0][2].length<5)&&(goalType5[1][0].length===1)&&(goalType5[1][1].length+goalType5[1][2].length<5)&&(goalType5[1][1].length+goalType5[1][2].length===goalType5[0][1].length+goalType5[0][2].length)&&
                    (gameType='regular')&&(data.plays[i].periodDescriptor.number<4)) {goalType4='SpecialTeams'}
                    else if ((goalType5[0][0].length===1)&&(goalType5[0][1].length+goalType5[0][2].length<5)&&(goalType5[1][0].length===1)&&(goalType5[1][1].length+goalType5[1][2].length<5)&&(goalType5[1][1].length+goalType5[1][2].length===goalType5[0][1].length+goalType5[0][2].length)&&
                    (gameType='playoff')) {goalType4='SpecialTeams'}
                    else {goalType4='something else'} // end if loop goalType4
                    goalType6.push('newGoal', goalTimeSecondsAbsolute, goalType5, goalType4);
                    // console.log('goalType6', goalType6)
    
                    if (goalType4==='fiveOnFiveHome') {for (j=0;j<fullLineup[0].length;j++) {if ((goalType[0].includes(fullLineup[0][j].number))&&(goalType[0].lastIndexOf(fullLineup[0][j].number)>0))
                      { fullLineup[0][j].fiveOnFive[0]=fullLineup[0][j].fiveOnFive[0]+1 }}
                      for (j=0;j<fullLineup[1].length;j++) {if ((goalType[1].includes(fullLineup[1][j].number))&&(goalType[1].lastIndexOf(fullLineup[1][j].number)>0))
                      { fullLineup[1][j].fiveOnFive[1]=fullLineup[1][j].fiveOnFive[1]+1 }}}
                    else if (goalType4==='fiveOnFiveAway') {for (j=0;j<fullLineup[0].length;j++) {if ((goalType[0].includes(fullLineup[0][j].number))&&(goalType[0].lastIndexOf(fullLineup[0][j].number)>0))
                      { fullLineup[0][j].fiveOnFive[1]=fullLineup[0][j].fiveOnFive[1]+1 }}
                      for (j=0;j<fullLineup[1].length;j++) {if ((goalType[1].includes(fullLineup[1][j].number))&&(goalType[1].lastIndexOf(fullLineup[1][j].number)>0)) 
                      { fullLineup[1][j].fiveOnFive[0]=fullLineup[1][j].fiveOnFive[0]+1 }}}
                    else if (goalType4==='HomePK_AwayPP') {for (j=0;j<fullLineup[0].length;j++) {if ((goalType[0].includes(fullLineup[0][j].number))&&(goalType[0].lastIndexOf(fullLineup[0][j].number)>0)) 
                      { fullLineup[0][j].PK[1]=fullLineup[0][j].PK[1]+1 }}
                      for (j=0;j<fullLineup[1].length;j++) {if ((goalType[1].includes(fullLineup[1][j].number))&&(goalType[1].lastIndexOf(fullLineup[1][j].number)>0)) {
                      fullLineup[1][j].PP[0]=fullLineup[1][j].PP[0]+1 }}}
                    else if (goalType4==='HomePP_AwayPK') { for (j=0;j<fullLineup[0].length;j++) {if ((goalType[0].includes(fullLineup[0][j].number))&&(goalType[0].lastIndexOf(fullLineup[0][j].number)>0)) {
                      fullLineup[0][j].PP[0]=fullLineup[0][j].PP[0]+1 }}
                      for (j=0;j<fullLineup[1].length;j++) {if ((goalType[1].includes(fullLineup[1][j].number))&&(goalType[1].lastIndexOf(fullLineup[1][j].number)>0)) {
                      fullLineup[1][j].PK[1]=fullLineup[1][j].PK[1]+1 }}}
                    else if (goalType4==='HomeSH') { for (j=0;j<fullLineup[0].length;j++) {if ((goalType[0].includes(fullLineup[0][j].number))&&(goalType[0].lastIndexOf(fullLineup[0][j].number)>0)) {
                      fullLineup[0][j].PK[0]=fullLineup[0][j].PK[0]+1 }}
                      for (j=0;j<fullLineup[1].length;j++) {if ((goalType[1].includes(fullLineup[1][j].number))&&(goalType[1].lastIndexOf(fullLineup[1][j].number)>0)) {
                      fullLineup[1][j].PP[1]=fullLineup[1][j].PP[1]+1 }}}
                    else if (goalType4==='AwaySH') { for (j=0;j<fullLineup[0].length;j++) {if ((goalType[0].includes(fullLineup[0][j].number))&&(goalType[0].lastIndexOf(fullLineup[0][j].number)>0)) {
                      fullLineup[0][j].PP[1]=fullLineup[0][j].PP[1]+1 }}
                      for (j=0;j<fullLineup[1].length;j++) {if ((goalType[1].includes(fullLineup[1][j].number))&&(goalType[1].lastIndexOf(fullLineup[1][j].number)>0)) {
                      fullLineup[1][j].PK[0]=fullLineup[1][j].PK[0]+1 }}}
                    else if (goalType4==='homeEN') { for (j=0;j<fullLineup[0].length;j++) {if ((goalType[0].includes(fullLineup[0][j].number))&&(goalType[0].lastIndexOf(fullLineup[0][j].number)>0)) {
                      fullLineup[0][j].FiveOnSix[0]=fullLineup[0][j].FiveOnSix[0]+1 }}
                      for (j=0;j<fullLineup[1].length;j++) {if ((goalType[1].includes(fullLineup[1][j].number))&&(goalType[1].lastIndexOf(fullLineup[1][j].number)>0)) {
                      fullLineup[1][j].SixOnFive[1]=fullLineup[1][j].SixOnFive[1]+1 }}}
                    else if (goalType4==='awaySixOnFive') { for (j=0;j<fullLineup[0].length;j++) {if ((goalType[0].includes(fullLineup[0][j].number))&&(goalType[0].lastIndexOf(fullLineup[0][j].number)>0)) {
                      fullLineup[0][j].FiveOnSix[1]=fullLineup[0][j].FiveOnSix[1]+1 }}
                      for (j=0;j<fullLineup[1].length;j++) {if ((goalType[1].includes(fullLineup[1][j].number))&&(goalType[1].lastIndexOf(fullLineup[1][j].number)>0)) {
                      fullLineup[1][j].SixOnFive[0]=fullLineup[1][j].SixOnFive[0]+1 }}}
                    else if (goalType4==='awayEN') { for (j=0;j<fullLineup[0].length;j++) {if ((goalType[0].includes(fullLineup[0][j].number))&&(goalType[0].lastIndexOf(fullLineup[0][j].number)>0)) {
                      fullLineup[0][j].SixOnFive[1]=fullLineup[0][j].SixOnFive[1]+1 }}
                      for (j=0;j<fullLineup[1].length;j++) {if ((goalType[1].includes(fullLineup[1][j].number))&&(goalType[1].lastIndexOf(fullLineup[1][j].number)>0)) {
                      fullLineup[1][j].FiveOnSix[0]=fullLineup[1][j].FiveOnSix[0]+1 }}}
                    else if (goalType4==='homeSixOnFive') { for (j=0;j<fullLineup[0].length;j++) {if ((goalType[0].includes(fullLineup[0][j].number))&&(goalType[0].lastIndexOf(fullLineup[0][j].number)>0)) {
                      fullLineup[0][j].SixOnFive[0]=fullLineup[0][j].SixOnFive[0]+1 }}
                      for (j=0;j<fullLineup[1].length;j++) {if ((goalType[1].includes(fullLineup[1][j].number))&&(goalType[1].lastIndexOf(fullLineup[1][j].number)>0)) {
                      fullLineup[1][j].FiveOnSix[1]=fullLineup[1][j].FiveOnSix[1]+1 }}}
                    else if (goalType4==='OTHome') { for (j=0;j<fullLineup[0].length;j++) {if ((goalType[0].includes(fullLineup[0][j].number))&&(goalType[0].lastIndexOf(fullLineup[0][j].number)>0)) {
                      fullLineup[0][j].overtime[0]=fullLineup[0][j].overtime[0]+1 }}
                      for (j=0;j<fullLineup[1].length;j++) {if ((goalType[1].includes(fullLineup[1][j].number))&&(goalType[1].lastIndexOf(fullLineup[1][j].number)>0)) {
                      fullLineup[1][j].overtime[1]=fullLineup[1][j].overtime[1]+1 }}}
                    else if (goalType4==='OTAway') { for (j=0;j<fullLineup[0].length;j++) {if ((goalType[0].includes(fullLineup[0][j].number))&&(goalType[0].lastIndexOf(fullLineup[0][j].number)>0)) {
                      fullLineup[0][j].overtime[1]=fullLineup[0][j].overtime[1]+1 }}
                      for (j=0;j<fullLineup[1].length;j++) {if ((goalType[1].includes(fullLineup[1][j].number))&&(goalType[1].lastIndexOf(fullLineup[1][j].number)>0)) {
                      fullLineup[1][j].overtime[0]=fullLineup[1][j].overtime[0]+1 }}} // fullLineup ends here

                    goalTime=[[],[]]; //goalTime[0] and goalTime[1] are array of times when each goal was scored [0] is ordered chronologically
                    for (j=0;j<onIceArray.length;j++) {if (onIceArray[j]==='newGoal') {goalTime[0].push(onIceArray[j+1]); goalTime[1].push(onIceArray[j+1]); k=k+1} // why do I need goalTime if I have goalTime2? 
                  } // end short j loop 
                  goalTime[0].sort((a,b) => a-b) // will delete it need to get rid of index 0
                    }} // end goal if 505 statement and i loop

                  for (j=0;j<seasonData.length;j++) {if (data.awayTeam.abbrev===seasonData[j].team) {console.log('homeTeam')}}
                  for (j=0;j<seasonData.length;j++) {if (data.homeTeam.abbrev===seasonData[j].team) {console.log('awayTeam')}}

                    console.log(seasonData, data3[data3.length-1].seasonData, topicArray, data.id)
                    if (topicArray.includes(data.id)) {console.log('gane is there')}
                    else (console.log('add me'))
                    // need to figure out how to check if any goals were scored by this team before. Probably check if game is there already
                   
                  goalType7=[];
                  for (j=0;j<goalTime2[0].length;j++) { goalType7.push(goalType6[4*goalTime2[1].indexOf(goalTime2[0][j])+1], goalType6[4*goalTime2[1].indexOf(goalTime2[0][j])+2], goalType6[4*goalTime2[1].indexOf(goalTime2[0][j])+3]) }
                    console.log(goalType7, 'fullLineup', fullLineup);
                    console.log('end of the line', data3, goalsNumber, data.plays);
                  for (i=0;i<goalsNumber.length;i++) { var newGoal3 = document.createElement('span'); var assists1 = ''; var assists2 = '';
                  for (j=0;j<data.rosterSpots.length;j++) { 
                    if (data.rosterSpots[j].playerId===data.plays[goalsNumber[i]].details.scoringPlayerId) { 
                      var scorer = data.rosterSpots[j].firstName.default + ' ' + data.rosterSpots[j].lastName.default}
                    if (data.plays[goalsNumber[i]].details.assist1PlayerId) { if (data.rosterSpots[j].playerId===data.plays[goalsNumber[i]].details.assist1PlayerId) {
                        var assists1 = data.rosterSpots[j].firstName.default + ' ' + data.rosterSpots[j].lastName.default }}
                      if (data.plays[goalsNumber[i]].details.assist2PlayerId) { if (data.rosterSpots[j].playerId===data.plays[goalsNumber[i]].details.assist2PlayerId) {
                          var assists2 = data.rosterSpots[j].firstName.default + ' ' + data.rosterSpots[j].lastName.default }}
                    }
                  
                  newGoal3.innerHTML='<br>'+'Period: '+data.plays[goalsNumber[i]].periodDescriptor.number+' Time: '+data.plays[goalsNumber[i]].timeInPeriod+' '+goalType7[3*i+2]+' '+' Scorer: '+ scorer +
                  ' Assists:' + assists1 + ' ' + assists2 + goalType7[3*i+1][1][0]+'-'+goalType7[3*i+1][1][1]+'-'+goalType7[3*i+1][1][2]+' '+goalType7[3*i+1][0][0]+'-'+goalType7[3*i+1][0][1]+'-'+goalType7[3*i+1][0][2];
                  document.getElementById('gameInfo').appendChild(newGoal3)}
                  })
                  }); // end third second .then
                  }); // end second second .then
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

// Post a new tip to the page if it does not exist yet
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
  // console.log(tipTitle)
  const tipIdNumber = document.getElementById('gameIdNumber').textContent;

  // Create an object with the tip and username
  const newTip = { title: tipTitle,
    username: tipUsername,
    topic: tipIdNumber,
    tip: tipContent,
    seasonData: seasonData
  };
  // Make a fetch POST request to the server
  postTip(newTip);
}

tipForm.addEventListener('submit', handleFormSubmit);