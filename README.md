# drawer-calculator

https://react-drawer-count.surge.sh/

Drawer Calculator is an app created to assist cash handling employees count cash drawers and calculate the exact denominations to leave in the drawer and to remove into the deposit. Submitting all the currency denominations to the API will return the calculated amounts for the drawer and deposit as well as save the submission in the user's history for future use.

The front end of this app is built on React with redux and the backend is built with Express. History information is saved in a postgres database.

The front end is served using Surge.sh, the backend is served using Render Hosting, and the database is served on ElephantSQL. These choices are for demonstrating the product, the plan for final deployment is dockerizing the backend and hosting on AWS ECS, with AWS RDS as the database server. Finally, the frontend will be served in an nginx container also hosted on ECS
