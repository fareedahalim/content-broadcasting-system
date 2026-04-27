# Content Broadcasting System

Backend assignment built using:

- Node.js
- Express
- PostgreSQL
- JWT Authentication
- Multer File Upload

---

## Features

- Teacher login
- Principal login

- Content upload

- Approval / Rejection workflow

- Subject-based broadcasting

- Rotation scheduling

- Public live content API


---

## Tech Stack

Backend:
Node.js
Express

Database:
PostgreSQL

Authentication:
JWT
bcrypt

Upload:
Multer


---

## Installation

Clone project

git clone - (https://github.com/fareedahalim/content-broadcasting-system)

cd content_broadcasting_system


Install packages

npm install


---

## Environment Variables

Create .env

PORT=5000

JWT_SECRET=mysecret

DB_USER=postgres

DB_PASSWORD=root

DB_HOST=localhost

DB_PORT=5433

DB_NAME=school_system


---

## Run Project

npm run dev


Server:

http://localhost:5000


---

## Database Setup

Create database:

CREATE DATABASE school_system;


Run tables from SQL scripts.

Tables:

users

contents

content_schedules


---

## API Endpoints

Auth

POST /auth/register

POST /auth/login


Teacher

POST /content/upload

GET /content/my-content


Principal

GET /content/pending

GET /content/all

PATCH /content/:id/approve

PATCH /content/:id/reject


Public

GET /content/live/:teacherId?subject=Maths


---

## Example Public API

GET

/content/live/1?subject=Maths


Returns currently active content.


---

## Scheduling Logic

Content rotation uses cyclic scheduling:

elapsed_time % total_cycle

Example:

Content A 5 mins

Content B 5 mins

Loop repeats continuously.


---

## Edge Cases Handled

- No content available

- Invalid subject returns empty response

- Approved but inactive content hidden

- Overlapping schedules blocked


---

## Assumptions

- Uploaded and pending states are merged

- Local file storage used 

- Redis and S3 not implemented (future scope)


---

## Future Improvements

- Redis caching

- Rate limiting

- S3 uploads

- Swagger docs

