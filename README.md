# d-bank
Distributed bank app based on nodejs and angular, integrating e-paxos for consensus

To run this app you need to have node.js and docker / docker-compose installed on your pc

Then to open the app you need to 
- open a terminal in back-end and run
- npm install
- node server.js

- open another terminal for front end and run
- npm install
- npm install -g @angular/cli
- ng serve


Due to some orchestration bug under docker images that blocks the processing interval of rerunning docker version cannot work yet


Otherwise you would be able to do 
- clone 
- npm install 
- npm run ci

and the app will launch automatically ( both ways )
- on localhost:4200 for front end and
- on localhost:4201 for api
And you can navigate throughout the app to 


Todo list that is covered in this app

- Back end api for distributed banking 

- Front end for interactions and automated scenarios

@2021
Panagiotis Kolaitis

