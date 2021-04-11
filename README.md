# NAR - NextJS Auto Rest

Automatic REST API for NextJS and Prisma.io

- checkoout this repo
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
token creationg
- consequent access will require a "Authorization: Bearer TOKEN" header to allow access
