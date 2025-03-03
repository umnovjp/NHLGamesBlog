# NHLGamesBlog
This code allows user to post NHL game reviews online displaying stats that I particularly was intersted in. First a user will select date. ![Alt text](./public/pages/image.png) Then a user selkects game from the list pushing a button. ![Alt text](./public/pages/image-1.png)JavaScript code will display game title, summary of goals and assists and lineups of players for both teams who were on ice when each goal was scored. ![Alt text](./public/pages/image-2.png). User then will enter description of each goal and overall game description in two input fields located one above another.![Alt text](./public/pages/image-3.png)

This script has been developed after another NHL stats page I created earlier: https://github.com/umnovjp/NHLStats. But it is built to post blog online. It has less stats functionality built in. Link above has data for penalties, faceoffs, shots, blocked shots, goals, missed shots. And I could add more data in the future.

There is no live page version. At least for now. If you would like to try it, download from github to local folder, then run it from your laptop. Still this repo has great examples of fs.readfile and fs.writefile. To start program, type node server.js in terminal. Then open http://localhost:3001 in your browser.

Current version was developed to use express.js to create a new blog. Later, I used current files to use databases instead of writing to file. Here is this repo: https://github.com/umnovjp/NHLGamesBlog. I did one react.js NHL project earlier. It kind of worked. Maybe I will make another attempt. 

## Future development
Later I may add more data to reflect which combination of players is on ice when goals are scored, maybe in previous games of the same team as well. But that's for long haul. NHL stats just show plus minus rating for each player. And that one is a little distorted because players do not get minus if goal is scored on PK. In the short term, it would make sense to show that some players were on ice for X goals for and Y goals against, counting those on PK. And check out this repo as well: https://github.com/umnovjp/NHLShiftsStats3. That's my next goal. And that's what I am proud of. Though job is in progress with algorithms changing frequently.  

## Games to run (to be deleted)
WPG lines: 10/30, 11/01, 11/03, 11/05, 11/14, 11/16 FLA, 11/19 FLA, 11/22 PIT, 11/23 NSH, 11/25 MIN 7-27-91 9-15-36 13-55-81 17-22-62, data missing 11/07, 11/09,11/12, 

incorrect data game WPG SJC 02/24 SJC G is missing during 1st goal 3rd goal is wrong as well because same player is added twice #51. incorrect data stars at cbj on 2/25 on goal 9 same player counted twice. 

incorrect lineup stars goals 5,8,9 on 03/02 53 is counted as D and F. car game on 03/02 1st goal 7 players on ice? There is no #10 in CAR. 
