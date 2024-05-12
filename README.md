# Project Name

## Overview

This project is a web application built using React, Prisma, Material-UI, Express, and PostgreSQL. The PostgreSQL database is hosted on Supabase's free tier.

## Features

- **React**: The frontend of the application is built using React, a popular JavaScript library for building user interfaces.
- **Prisma**: Prisma is used as the ORM (Object-Relational Mapping) to interact with the PostgreSQL database. It provides a type-safe and auto-generated database client.
- **Material-UI**: Material-UI is a React UI framework for building beautiful and responsive user interfaces. It offers pre-designed components following Google's Material Design guidelines.
- **Express**: Express is used as the backend framework for building RESTful APIs and handling server-side logic.
- **PostgreSQL**: The application uses PostgreSQL as its database system, which is hosted on Supabase's free tier.

## Installation

To run this application locally, follow these steps:

1. Clone this repository.
2. Install dependencies on each folder using `npm install`.
3. Configure your PostgreSQL database connection for backend settings in the `.env` file.
4. Run the Prisma migration to initialize the database schema using `npx prisma migrate dev`.
5. Start the server using `npm start`.
6. Access the application in your browser at `http://localhost:PORT`.

## Note

Please note that Facebook sign-in/sign-up functionality is not included in this application. Integrating Facebook sign-in/sign-up requires HTTPS, and it involves a more complicated setup process (need https).

I use dummy gmail as the verification sender so feel free to use it.

