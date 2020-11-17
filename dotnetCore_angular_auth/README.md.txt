This project use Asp.Net core web api to authenticate user and create jwt for client authentication/authorization.
Asp.Net core backend use Identity package to store manage users and roles.
The user data is stored in the a postgress database. 
Angular app provides a simple client interface to test the registration and login function and authorization of the backend, and implements authorization on the client side aswell.

To run the application:

1. Download repository.
2. Run docker-compose up where the docker-compose.yml file is located. The docker will run the services and displays error that the database is not found.
3. Go to the backend directory and run ***dotnet ef database update --connection "Host=localhost;Port=5432;Username=postgres;Password=admin;Database=appdb;"*** it will create the database in the postgres service. 