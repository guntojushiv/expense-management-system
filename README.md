*Expense Management System*:-
This is a full-stack web application built with Node.js, Express, MongoDB, and React for managing expenses, users, budgets, and reports. It supports role-based access control with Admin, Manager, and Employee roles, featuring authentication, expense management, budgeting, reporting, and security measures.

*Setup Instructions*
Node.js: v18.x (LTS) or v20.x
MongoDB: Ensure MongoDB is installed and running (mongod)
Git: For cloning the repository
npm: Included with Node.js

*Installation*
Clone the Repository

- git clone https://github.com/guntojushiv/expense-management-system.git.git
- cd expense-management-system

*Backend Setup*
Navigate to the backend directory:

- cd backend

*Install dependencies*

- npm install

*Create a .env file in the backend directory with the following content*

- PORT=5000
- MONGO_URI=mongodb://localhost:27017/expense_db
- JWT_SECRET=your-secure-secret-key
Replace your-secure-secret-key with a strong, unique string.


*Start the backend server*

- npm run dev
Verify the server is running at http://localhost:5000.

*Frontend Setup*
Navigate to the frontend directory:

- cd frontend

*Install dependencies*

- npm install

*Start the frontend*

- npm start
Open http://localhost:3000 in your browser.


*Database Initialization*
- Ensure MongoDB is running.
- The application will create the expense_db database and collections automatically on first use.

*Testing*
- Sign up with admin@ex.com, manager@ex.com, and employee@ex.com using different passwords.
- Test all features (e.g., expense creation, user management, budgeting, reporting).

*Role Matrix (Who Can Do What)*
 Role	                  Permissions
Admin	    -      Full control over the system<br>- Manage users & companies<br>- View all expense reports<br>- 
                   Set global categories & budget policies
Manager	    -      Approve or reject employee expenses<br>- View team’s transactions<br>- Set team-level budgets
Employee	-      Submit expenses (with optional receipt upload)<br>- View their own expenses and monthly budget usage

*API Collection (Postman)*
Below is a description of the API endpoints for use with Postman. You can import this as a collection by creating a new collection in Postman and adding the following requests.

*Authentication*
1) Signup
- Method: POST
- URL: http://localhost:5000/api/auth/signup
- Headers: Content-Type: application/json
- Body (raw JSON):

{
  "email": "test@ex.com",
  "password": "password123",
  "role": "employee"
}
Response: { "message": "User created successfully" } (201) or error (400/500)


2) Login
- Method: POST
- URL: http://localhost:5000/api/auth/login
- Headers: Content-Type: application/json
- Body (raw JSON):

{
  "email": "test@ex.com",
  "password": "password123"
}
Response: { "token": "your-jwt-token" } (200) or error (401/500)
Note: Use the returned token in the Authorization header (e.g., Bearer your-jwt-token) for protected routes.

*Users*
1) Get All Users (Admin only)
- Method: GET
- URL: http://localhost:5000/api/users
- Headers: Authorization: Bearer your-jwt-token
- Response: Array of user objects (200) or error (403/500)
2) Delete User (Admin only)
- Method: DELETE
- URL: http://localhost:5000/api/users/:id
- Headers: Authorization: Bearer your-jwt-token
- Response: { "message": "User deleted successfully" } (200) or error (404/500)

*Expenses*
1) Create Expense
- Method: POST
- URL: http://localhost:5000/api/expense
- Headers: Authorization: Bearer your-jwt-token, Content-Type: multipart/form-data
- Body (form-data):
title: String
amount: Number
category: String
project: String (optional)
date: Date (e.g., "2025-04-10")
notes: String (optional)
receipt: File (optional, image/PDF)
- Response: Expense object (201) or error (400/500)

2) Get Expenses
- Method: GET
- URL: http://localhost:5000/api/expense
- Headers: Authorization: Bearer your-jwt-token
- Response: Array of expense objects (200) or error (500)

3) Update Expense Status (Approval/Rejection)
- Method: PUT
- URL: http://localhost:5000/api/expense/:id
- Headers: Authorization: Bearer your-jwt-token
- Body (raw JSON):

{ "status": "approved" }
Response: Updated expense object (200) or error (400/404/500)

4) Delete Expense
- Method: DELETE
- URL: http://localhost:5000/api/expense/:id
- Headers: Authorization: Bearer your-jwt-token
- Response: { "message": "Expense deleted" } (200) or error (404/500)

5) Budgets
- Create Budget
Method: POST
URL: http://localhost:5000/api/budget
Headers: Authorization: Bearer your-jwt-token
Body (raw JSON):

{
  "amount": 1000,
  "type": "company",
  "month": "2025-04"
}

or for team:

{
  "amount": 500,
  "type": "team",
  "team": "TeamA",
  "month": "2025-04"
}
Response: Budget object (201) or error (400/500)

6) Get Budgets
- Method: GET
- URL: http://localhost:5000/api/budget
- Headers: Authorization: Bearer your-jwt-token
- Response: Array of budget objects (200) or error (500)

*Notes*
Replace your-jwt-token with the token obtained from the login endpoint.
Use environment variables in Postman (e.g., {{baseUrl}}) for http://localhost:5000 to simplify testing.

*ER Diagram or DB Schema*
Since I cannot generate images, below is a textual representation of the database schema. You can use this to create an ER diagram using tools like Draw.io or Lucidchart.

*Entities and Attributes*
1) User
- _id: ObjectId (Primary Key)
- email: String (Unique, Required)
- password: String (Hashed, Required)
- role: String (Enum: admin, manager, employee, Required)

2) Expense
- _id: ObjectId (Primary Key)
- title: String (Required)
- amount: Number (Required)
- category: String (Required)
- project: String (Optional)
- date: Date (Required)
- notes: String (Optional)
- status: String (Enum: pending, approved, rejected, Default: pending)
- receipt: String (File path, Optional)
- userId: ObjectId (Foreign Key referencing User._id, Required)

3) Budget
- _id: ObjectId (Primary Key)
- amount: Number (Required)
- type: String (Enum: company, team, Required)
- team: String (Required if type is team)
- month: String (e.g., "2025-04", Required)
-createdBy: ObjectId (Foreign Key referencing User._id, Required)