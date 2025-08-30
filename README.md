# 💰 Personal Finance Tracker API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

## 💡 Project Description

The **Personal Finance Tracker API** helps users manage their finances efficiently. Users can:

* Track **income** and **expenses**
* Organize transactions into **categories**
* Upload **profile pictures**
* View **monthly summaries**
* Protect their data using **JWT authentication**

---

## 🛠 Features

### User Management

* Sign up and log in securely
* JWT-based authentication
* Upload and update profile pictures

### Transaction Management

* Add, update, delete income/expense transactions
* Categorize transactions for better insights

### Financial Insights

* Generate monthly summaries of income and expenses
* Calculate total spending per category

---

## 🔧 Technologies Used

* Node.js & Express.js
* MongoDB (Mongoose)
* JSON Web Tokens (JWT)
* Cloud storage for profile pictures (optional)

---

## 🚀 Getting Started

1. **Clone the repository**

```bash
git clone [<repo_url>](https://github.com/hayle01/Personal-Finance-Tracker-api.git)
cd personal-finance-tracker-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```
PORT=5000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
```

4. **Start the server**

```bash
npm run dev
```

---

## 📄 API Endpoints

### Auth

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | /auth/register | Register a new user |
| POST   | /auth/login  | Log in a user       |

### Transactions

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| GET    | /transactions      | Get all transactions  |
| POST   | /transactions      | Add a new transaction |
| PUT    | /transactions/\:id | Update a transaction  |
| DELETE | /transactions/\:id | Delete a transaction  |

### Profile

| Method | Endpoint     | Description                    |
| ------ | ------------ | ------------------------------ |
| GET    | /auth/profile | Get user profile               |
| PUT    | /auth/profile | Update profile info or picture |

---

## 📈 Example Request

```bash
POST /transactions
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Groceries",
  "amount": -50,
  "type": "expense",
  "category": "Food",
  "date": "2025-05-27"
}
```

## 📄 License

This project is licensed under the MIT License.
