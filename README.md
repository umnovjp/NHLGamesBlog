# NHLGamesBlog
This code allows user to post NHL game reviews online. First a user will select date then select a game from list. JavaScript code will add game title and summary of goals to the webpage. A user then will enter description of each goal and overall game description in two input located one above another. User cal also click button Print Roster to find players list, who scored or assisted on a goal.  

This script has been developed after another NHL stats page I created earlier: https://github.com/umnovjp/NHLStats. But it is built to post blog online. It has less stats functionality built in. Only rosters and goals, also goals chart. Website above has data for penalties, faceoffs, shots, blocked shots, goals, missed shots. And it could have more. But index.js file has 600 lines. I will redesign it to make files more manageable. Also, I will add team rosters and more stats data like hits, penalties, shots number, shot locations, including missed shots. 

There is no live page version. At least for now. If you would like to use it, download from github to local folder, then run it from your laptop. Still this repo has great examples of fs.readfile and fs.writefile. 

## Future development
Current version was developed to use express.js to create a new blog. Later, I used current files to use databases instead of writing to file. Here is new repo: https://github.com/umnovjp/NHLGamesBlog. 
