# Github_API Project

## to run the project : 
- git clone git@github.com:MrBiscuit25/github_api.git
- cd github_api;  
- docker compose up;

## backend has 3 endpoints:
- http://localhost:5000/api/repos  // get all recent trending repositories 
- http://localhost:5000/api/repos/:name_or_id // get trending repository by name or id
- http://localhost:5000/api/repos/reset // force synchronization with github

## frontend 
- http://localhost:3000
