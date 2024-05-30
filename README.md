# Northcoders News API

### Overview

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
in May 2024. The goal was to set up a working backend API for a database of news articles, using Node.js, Postgres, and Express.js. 

### hosting

A version of this API is hosted online with Superbase and is available at: https://supabase.com/dashboard/project/efxozfydzbiwisqvhqyc. This deployment requires the environmental variable DATABASE_URL, specified in .env.production. 

For security purposes .env files have not been uploaded to GitHub. To connect to local test and development versions of the database it will be necessary to create a .env.test and a .env.development file in the root directory. Each file will need to contain the test 'PGDATABASE=databaseName' (without quotes), replacing 'databaseName with the relevant name of the database. Database names can be found in db/data/setup.sql.

### Dependences

The developer dependencies used for this project, as of 30/5/2024 are:
- husky: ^8.0.2,
- jest: ^27.5.1,
- jest-extended: ^2.0.0,
- jest-sorted: ^1.0.15,

The non-developer dependencies are:
- dotenv: ^16.4.5,
- express: ^4.19.2,
- pg: ^8.7.3,
- pg-format: ^1.0.4,
- supertest: ^7.0.0

All dependencies were installed using NPM. 

### Testing

Ingegration testing was conducted locally using Jest and Supertest. Developers can run these tests locally by running the riles in the \_\_test\_\_ folder, which uses test data stored in db/data/test-data.

To run all available tests, use 'npm run test'. 

### Endpoint directory

A full directory of all endpoints is available in the endpoints.json file, found in the root directory. The JSON contains information for each endpoint, including the relevant url, any queries, and an example response. 



