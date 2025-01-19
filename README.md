# Prison Management System and Location Tracking System Backend

This repository contains the backend implementation of the **Prison Management System and Location Tracking System**, built using **Express.js** with **TypeScript**. The project focuses on creating an efficient backend system for managing prison-related data and tracking prisoner locations with robust API endpoints and a well-organized file structure.

## Features

### Prison Management System
- CRUD operations for prisoner records and management.
- SQL database integration for storing and retrieving data.
- Secure authentication and role-based access control.
- Comprehensive API endpoints for administrative and operational functionalities.

### Location Tracking System
- API endpoints to track prisoner locations.
- Real-time data updates and efficient handling of geolocation data.
- Map-based location tracking implemented using **React-Leaflet**.

---

## Technologies Used

- **Backend Framework**: Express.js (TypeScript)
- **Database**: SQL-based relational database (e.g., MySQL/PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend Mapping**: React-Leaflet
- **Version Control**: Git
- **Others**: Middleware, Error Handling, and Logging

---

## Contributions

### My Role
I was responsible for designing and implementing the **Prison Management System** module, including:
- Developing API endpoints for prisoner, staff management and alert notifications.
- Designing SQL database schemas for tables related to prisoners, guards, notifications of incidents.
- Implementing authentication and authorization mechanisms using JWT.
- Structuring the backend with a modular and maintainable file organization.
- Writing detailed inline documentation for easy understanding and scalability.

### Key Highlights of My Work
- **API Development**:
  - Designed RESTful APIs for CRUD operations.
  - Secured endpoints with middleware for authentication and role validation.
- **Database Design**:
  - Created and managed SQL database tables for prisoner records, guard assignments, and location tracking.
- **Code Quality**:
  - Wrote clean, maintainable, and TypeScript-compliant code.
  - Followed best practices for file organization, error handling, and logging.

---

## How to Run the Project

### Prerequisites
- Node.js (v14 or higher)
- A SQL database (MySQL/PostgreSQL)
- TypeScript installed globally

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/theSohamTUmbare/PMS-LTS-Backend.git
   cd PMS-LTS-Backend
2. Install dependencies:
   ```bash
   npm install
3. Create a .env file with your variables:
   ```bash
   PGHOST=
   PGDATABASE=
   PGUSER=
   PGPASSWORD=
   PGPORT=
   JWT_SECRET_KEY=
4. Compile the TypeScript code:
   ```bash
   npm run build
5. Run the project:
   ```bash
   npm start


## Credits
- Original Repository: https://github.com/Satyajeet-Das/PMS-LTS-Backend

## Acknowledgments
Special thanks to my teammates for their collaboration and support throughout this project.
