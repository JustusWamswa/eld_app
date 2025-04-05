# ELD (Electronic Logging Device) App
## Overview
The ELD (Electronic Logging Device) app is a web application designed for managing and generating compliance logs for drivers in the transportation industry. The app allows users to log their trip data, generate Electronic Logging Device (ELD) compliance reports, and track their driving hours in accordance with regulatory requirements.

This application has a React frontend for user interaction, with a Django backend to handle data storage and processing. The logs are generated dynamically Material-UI (MUI) Charts, ensuring a seamless and responsive user experience.

## Features
Trip Log Generation: Automatically generate logs for a trip based on the provided data.

Compliance Tracking: Track compliance with ELD regulations for each trip and ensure drivers meet the necessary requirements.

User Interface: The frontend is built with React and Material-UI (MUI) to provide an intuitive, modern interface for users.

Backend: The backend, built with Django, is responsible for handling data storage, retrieval, and processing. It ensures that trip logs are saved and accessible when needed.

## Technologies Used
### Frontend:

React

Material-UI (MUI)


### Backend:

Django

PostgreSQL

Data Storage: All trip logs and compliance data are stored and retrieved from the Django backend.

## How It Works
Logging Trips: Users enter trip data through the frontend, which is then processed and stored in the backend.

Generating Compliance Logs: By clicking a button, users can generate a compliance log based on the recorded trip data. This log includes driving hours, breaks, and other relevant information.

Compliance Check: The app checks whether the trip adheres to legal requirements and highlights areas of non-compliance.

## Installation
### Prerequisites
Node.js (for the frontend)

Python 3.x (for the backend)

Django and related dependencies

PostgreSQL (database)

### Frontend Setup
Clone the repository:

`git clone https://github.com/JustusWamswa/eld_app.git`

Navigate to the frontend directory and install dependencies:

`cd frontend`

`npm install`

Create a `.env` file and add environment variables as defined in `env.example`

Start the React development server:

`npm run dev`

### Backend Setup
Navigate to the backend directory:

`cd backend`

Create a python environment depending on your OS and activate. 

Install Python dependencies:

`pip install -r requirements.txt`

Apply database migrations:

`python manage.py makemigrations eld_app`

`python manage.py migrate`

Create a `.env` file and add environment variables as defined in `env.example`

Start the Django development server:

`python manage.py runserver`

## Usage
Navigate to the frontend URL (e.g., http://localhost:5173).

Hosted version can be found at https://eld-app.vercel.app/login

Log in or register a new user.

Enter the trip data for a driver.

Click the "Generate Log" button in a trip to generate and view the log.

Review the log to check for compliance with ELD regulations.