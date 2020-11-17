Backend: ASP.NET Core 5 Web API. Entityframework core 5. Identity. Issuing and validating JWT token.

Frontend: Angular v11 served by nginx

Database: Postgres v10.15

Reverse proxy: nginx

Running in docker.


To run the application: (you will need docker)

1. Download repository.
2. Run ***docker-compose up*** where the docker-compose.yml file is located. The docker will build the images and run the services. It will display error that the database is not found.
3. Go to the backend directory and run ***dotnet ef database update --connection "Host=localhost;Port=5432;Username=postgres;Password=admin;Database=appdb;"***. This will create the database.
4. Where the docker-composy.yml file located run the following command: ***docker-compose down***. It will shutdown the 3 services that was running what the 2nd step was made.
5. Run ***docker-compose up*** again and this time it will find the database.
6. Go to ***http://localhost:80*** in the browser which will show client app and you can register and login users. 

There are two initial users. ***user:password***(with user role) and ***admin:password*** (with admin role). 
