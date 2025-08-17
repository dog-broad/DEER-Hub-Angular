# DEER Hub Angular Application

A comprehensive employee management system built with Angular and JSON Server.

## Features

- **User Authentication**: Login and registration system
- **Dashboard**: Overview of leaves, documents, and announcements
- **Leave Management**: Apply, approve, and track leave requests
- **Document Management**: Upload, organize, and share documents
- **Announcements**: Create and manage company announcements and events
- **Role-based Access**: Different views for managers and employees

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### 1. Start JSON Server (Database)
```bash
npm run json-server
```
This will start the JSON Server on `http://localhost:3001` with the database file `public/db.json`.

### 2. Start Angular Development Server
```bash
npm start
```
This will start the Angular application on `http://localhost:4200`.

## Database Structure

The application uses JSON Server as a mock REST API with the following endpoints:

- **Users**: `http://localhost:3000/users`
- **Leaves**: `http://localhost:3000/leaves`
- **Documents**: `http://localhost:3000/documents`
- **Announcements**: `http://localhost:3000/announcements`

## Default Users

The application comes with pre-configured users:

1. **Manager Account**:
   - Username: `priya.sharma`
   - Password: `password123`
   - Role: Manager

2. **Employee Accounts**:
   - Username: `rahul.kumar` / Password: `password123`
   - Username: `amit.patel` / Password: `password123`
   - Role: Employee

## Architecture

- **Services**: All services use HTTP calls to JSON Server instead of in-memory data
- **Observables**: Proper Observable patterns for reactive data flow
- **Reactive Forms**: Consistent form patterns across all components using `myForm` and `myFc` getter
- **Simplified Components**: Clean, straightforward component implementations without over-engineering
- **Type Safety**: Full TypeScript support with proper interfaces

## Available Scripts

- `npm start` - Start Angular development server
- `npm run build` - Build the application for production
- `npm run json-server` - Start JSON Server for the database
- `npm test` - Run unit tests

## Technology Stack

- **Frontend**: Angular 19
- **Database**: JSON Server (mock REST API)
- **Styling**: Bootstrap 5
- **Icons**: Font Awesome
- **HTTP Client**: Angular HttpClient with Observables
