function getShots(event) {
  var requestURL = 'https://statsapi.web.nhl.com/api/v1/game/' + gameId + '/feed/live';
  fetch(requestURL, {
    "method": "GET"
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.liveData.plays);
      console.log(gameId);
      const arrayShotsHome = [];
      const arrayShotsRoad = [];
      const arrayShots = [];

      for (i = 0; i < data.liveData.plays.allPlays.length; i++) {
        if (data.liveData.plays.allPlays[i].result.event == 'Shot') {
//          console.log(data.liveData.plays.allPlays[i].players);
            fullNameShooter = data.liveData.plays.allPlays[i].players;
          const onestring = data.liveData.plays.allPlays[i].players;
          const one = JSON.stringify(onestring);        
          testArray = one.split("fullName");
          name1 = testArray[1].slice(3);
          name1array = name1.split('"');
          fullNameShooter = name1array[0];
          name2 = testArray[2].slice(3);
          name2array = name2.split('"');
          fullNameSavior = name2array[0];
 //         console.log(testArray, fullNameShooter, fullNameSavior);
 //         console.log(data.liveData.plays.allPlays[i].coordinates);
          var foWin = document.createElement('span');
          var foLoss = document.createElement('span');
          foWin.innerHTML = 'SH,';
          foLoss.innerHTML = 'SV,';
          var check1 = document.getElementById(fullNameShooter);
          var check2 = document.getElementById(fullNameSavior);
          if (check1 == null || check2 == null)
          {console.log('error in shots', fullNameShooter)} //Daniel Sprong
          else {
          document.getElementById(fullNameShooter).appendChild(foWin);
          document.getElementById(fullNameSavior).appendChild(foLoss);
console.log(fullNameShooter, fullNameSavior)}
          var coordinates = { x: data.liveData.plays.allPlays[i].coordinates.x, y: data.liveData.plays.allPlays[i].coordinates.y };
          arrayShots.push(coordinates);
          if (document.getElementById('gameInfoAway').textContent.includes(fullNameShooter))
          {arrayShotsRoad.push(coordinates)}
          
           else if (document.getElementById('gameInfoHome').textContent.includes(fullNameShooter))
           {arrayShotsHome.push(coordinates)} 
           else console.log('error');
        }
      }
//           console.log(arrayShots);
      new Chart("shotsChart", {
        type: "scatter",
        data: {
          datasets: [{
            pointRadius: 4,
            pointBackgroundColor: "rgb(0,0,255)",
            data: arrayShotsHome                    
          },
          {
            pointRadius: 4,
            pointBackgroundColor: "rgb(0,255,0)",
            data: arrayShotsRoad               
          }
        ]
        },
        options: {
          legend: { display: true,
          text: 'Road team' },                
            title: {
                display: true,
                text: 'Shots on goals'                  
        },
          scales: {
            xAxes: [{ ticks: { min: -100, max: 100 } }],
            yAxes: [{ ticks: { min: -42.5, max: 42.5 } }],
          }
        }
      });
      console.log(arrayShotsHome);
           console.log(arrayShotsRoad);
    });
}
module.exports = getShots