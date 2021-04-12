# NAR - NextJS Auto Rest

Automatic REST API for NextJS and Prisma.io

- clone this repo
- run yarn
- change prisma/schema.prisma to your database schema and connection url ( you may use enviroment vars )
- run npx prisma db push --preview-feature
- start NextJS
- You are done!

- deploy to vercel.com and link to a https domain
- npx prisma studio to navigate on your database, create a initial user ( let without password to create one on the first access )

This will create your database tables and a REST API will be available for each created table
- CRUD operation on any table
- use prisma include on api url to add connections to others tables
- prisma take and skip to paginate
- the user table with token auth is automaticaly created and a POST /api/login with email/password route will take care of auth and
token creation
- the following access will require a "Authorization: Bearer TOKEN" header to allow access

Examples

- /api/user - get all users from database
- /api/user?take=10&skip=9 - get 10 users starting from the 10th ( pagination )
- /api/user?include=Access - get all users and the access entries from each user on user field "access"
- /api/access?include=User - get all access and the user of each one
- /api/user/123123 - get user id = 123123
- DELETE /api/user/123123 - delete user id = 123123
- PUT /api/user/123123 - update user id = 123123 ( updateds fields on request body )
- POST /api/user - create a new user ( insert fields on request body )

TODO

- searching
- orderBy
