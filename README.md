# 🏦 Banking System

A full-stack **Digital Banking System** built with the MERN stack. The application simulates core banking operations including user registration, authentication, account management, fund transfers, debit-card payments, transaction PIN verification, and transaction history.

The project is designed to demonstrate how a modern full-stack banking application can separate frontend, backend, authentication, business logic, and database responsibilities.

---

## ✨ Features

### 🔐 Authentication

* Mobile-number based registration
* Registration restricted to pre-registered bank accounts
* Duplicate registration prevention
* Password confirmation and validation
* Password hashing using `bcryptjs`
* JWT-based authentication
* Protected API routes
* Retrieve currently authenticated user

### 🏦 Account Management

* Pre-existing bank accounts
* Account number based identification
* Account holder information
* Savings account support
* Account balance management
* Registered mobile number association

### 💸 Fund Transfers

* Transfer money between bank accounts
* Receiver account validation
* Sender account validation
* Insufficient-balance validation
* Self-transfer prevention
* Automatic sender balance deduction
* Automatic receiver balance update
* Transaction record generation

### 💳 Debit Card

* Automatic card generation after registration
* 16-digit card number
* CVV generation
* Expiry date generation
* Card type support
* Active/inactive card state
* Card-linked bank account

### 💰 Card Payments

* Card number validation
* Expiry date validation
* CVV validation
* Transaction PIN verification
* Linked bank account validation
* Receiver account validation
* Balance verification
* Self-payment prevention
* Transaction creation after successful payment

### 🔢 Transaction PIN

* First-time PIN setup
* PIN status tracking
* PIN verification for financial operations

### 📜 Transactions

Transactions store information such as:

* Payment method
* Sender account
* Receiver account
* Sender card
* Amount
* Transaction type
* PIN verification status
* Transaction status
* Remarks
* Unique transaction reference number
* Creation/update timestamps

---

# 🛠️ Tech Stack

## Frontend

| Technology    | Purpose                        |
| ------------- | ------------------------------ |
| React         | UI development                 |
| TypeScript    | Type-safe frontend development |
| Vite          | Frontend build tool            |
| React Router  | Client-side routing            |
| Axios         | API communication              |
| Tailwind CSS  | Styling                        |
| Framer Motion | UI animations                  |
| Lucide React  | Icons                          |
| React Icons   | Additional icons               |

## Backend

| Technology     | Purpose                   |
| -------------- | ------------------------- |
| Node.js        | JavaScript runtime        |
| Express.js     | REST API framework        |
| Mongoose       | MongoDB ODM               |
| MongoDB        | Database                  |
| JSON Web Token | Authentication            |
| bcryptjs       | Password hashing          |
| dotenv         | Environment configuration |
| CORS           | Cross-origin requests     |

---

# 🏗️ Architecture

The application follows a client-server architecture.

```text
                         ┌─────────────────────┐
                         │      React UI       │
                         │  TypeScript + Vite  │
                         └──────────┬──────────┘
                                    │
                                  Axios
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Express Server   │
                         │      REST APIs      │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
              Middleware       Controllers        Routes
                    │               │
                    │               ▼
                    │          Business Logic
                    │               │
                    └───────────────┤
                                    ▼
                         ┌─────────────────────┐
                         │      Mongoose       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       MongoDB       │
                         └─────────────────────┘
```

---

# 📂 Project Structure

```text
Banking-System/
│
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/
│   ├── config/
│   │
│   ├── controllers/
│   │   ├── accountController.js
│   │   ├── authController.js
│   │   ├── cardController.js
│   │   ├── paymentController.js
│   │   ├── pinController.js
│   │   ├── transactionController.js
│   │   └── transferController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Account.js
│   │   ├── Card.js
│   │   ├── Transaction.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── accountRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cardRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── pinRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── transferRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
├── package.json
└── README.md
```

---

# 🔄 Application Workflows

## 1. Registration Flow

Registration is not open to arbitrary mobile numbers.

A mobile number must already exist in the `Account` collection.

```text
User enters mobile number
          │
          ▼
POST /api/auth/check-mobile
          │
          ▼
Search Account collection
          │
     ┌────┴────┐
     │         │
   Found     Not Found
     │         │
     ▼         ▼
Continue    Reject
     │
     ▼
POST /api/auth/register
     │
     ▼
Validate password
     │
     ▼
Check account again
     │
     ▼
Check existing User
     │
     ▼
Hash password using bcrypt
     │
     ▼
Create User
     │
     ▼
Automatically create Card
     │
     ▼
Registration successful
```

This creates a relationship between the pre-existing bank account and the newly registered application user.

---

# 🔑 Login Flow

```text
User
 │
 │ Mobile Number + Password
 ▼
React Frontend
 │
 ▼
POST /api/auth/login
 │
 ▼
Find User
 │
 ▼
Compare password using bcrypt
 │
 ▼
Generate JWT
 │
 ▼
JWT expires after 7 days
 │
 ▼
Return token + user information
```

The authenticated token is then used when accessing protected APIs.

---

# 🛡️ Protected Request Flow

```text
React Frontend
      │
      ▼
Authorization Header
      │
      ▼
Authentication Middleware
      │
      ▼
Extract JWT
      │
      ▼
Verify JWT
      │
      ▼
Identify User
      │
      ▼
req.user
      │
      ▼
Controller
```

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 💸 Fund Transfer Flow

The application supports account-to-account transfers.

```text
User selects receiver
        │
        ▼
Enter amount
        │
        ▼
Validate receiver account
        │
        ▼
Find sender account
        │
        ▼
Check sender balance
        │
        ▼
Deduct amount from sender
        │
        ▼
Add amount to receiver
        │
        ▼
Save both accounts
        │
        ▼
Create transaction record
        │
        ▼
Transfer successful
```

The backend also checks for:

* Sender account existence
* Receiver account existence
* Insufficient balance

---

# 💳 Card Payment Flow

Card payments follow a separate validation path.

```text
Card Number
     │
     ▼
Expiry Date + CVV
     │
     ▼
Validate Card
     │
     ▼
Find Linked Account
     │
     ▼
Verify Transaction PIN
     │
     ▼
Find Receiver Account
     │
     ▼
Prevent Self Payment
     │
     ▼
Check Balance
     │
     ▼
Deduct Sender Balance
     │
     ▼
Credit Receiver
     │
     ▼
Create CARD Transaction
```

The transaction is recorded with:

```text
paymentMethod = CARD
transactionType = Online Payment
pinVerified = true
status = Success
```

---

# 🗄️ Database Design

## User

The `User` model stores application authentication and account association information.

```text
User
├── mobileNumber
├── password
├── mobileVerified
├── transactionPin
├── pinSet
├── accountNumber
├── createdAt
└── updatedAt
```

---

## Account

The `Account` model represents the underlying bank account.

```text
Account
├── accountNumber
├── accountHolderName
├── registeredMobileNumber
├── accountType
├── balance
├── role
├── createdAt
└── updatedAt
```

The default account type is `Savings`.

---

## Card

A card is automatically generated when a user registers.

```text
Card
├── accountNumber
├── cardHolderName
├── cardNumber
├── cvv
├── expiryDate
├── cardType
├── isActive
├── createdAt
└── updatedAt
```

Supported card types:

```text
Visa
Mastercard
Rupay
```

The default card type is `Rupay`.

---

## Transaction

The transaction model records financial operations.

```text
Transaction
├── paymentMethod
├── senderAccountNumber
├── senderCardNumber
├── receiverType
├── receiverAccountNumber
├── receiverCardNumber
├── amount
├── transactionType
├── pinVerified
├── otpVerified
├── status
├── remarks
├── referenceNumber
├── createdAt
└── updatedAt
```

Supported transaction types:

```text
Transfer
Online Payment
Card Payment
```

Supported transaction statuses:

```text
Success
Failed
Pending
```

Every transaction receives a generated reference number beginning with `TXN`.

---

# 🌐 API Overview

## Authentication

| Method | Endpoint                 | Description                           |
| ------ | ------------------------ | ------------------------------------- |
| POST   | `/api/auth/check-mobile` | Validate pre-registered mobile number |
| POST   | `/api/auth/register`     | Register application user             |
| POST   | `/api/auth/login`        | Authenticate user                     |
| GET    | `/api/auth/me`           | Get authenticated user                |

## Accounts

```text
/api/account
```

Used for account-related operations.

## Cards

```text
/api/cards
```

Used for debit-card operations.

## Payments

| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| POST   | `/api/payment/make-payment` | Account-based payment |
| POST   | `/api/payment/card-payment` | Card-based payment    |

## Transfers

```text
/api/transfer
```

Used for account-to-account fund transfers.

## Transactions

```text
/api/transactions
```

Used to access transaction-related operations.

## PIN

```text
/api/pin
```

Used for transaction PIN operations.

## Users

```text
/api/users
```

Used for user-related operations.

---

# 🔐 Security

The project implements several security-related mechanisms.

### Password Hashing

Passwords are hashed using `bcryptjs` before being stored.

```text
Plain Password
      │
      ▼
   bcryptjs
      │
      ▼
Hashed Password
      │
      ▼
   MongoDB
```

### JWT Authentication

Authenticated users receive a JWT that is used to access protected endpoints.

### Protected APIs

Authentication middleware protects authenticated operations.

### Transaction PIN

Financial operations require transaction PIN verification.

### Input Validation

The backend performs validation for scenarios such as:

* Missing registration fields
* Password mismatch
* Short passwords
* Invalid payment amounts
* Invalid card details
* Invalid transaction PIN
* Missing accounts
* Insufficient balance
* Self-transfer attempts

---

# ⚙️ Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

If Twilio is configured in your environment, add the required Twilio credentials as well.

> **Never commit ****`.env`**** files containing real credentials to GitHub.**

Add the following to `.gitignore`:

```gitignore
.env
node_modules/
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB or a MongoDB connection
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/yashwanthtm25/Banking-System.git
cd Banking-System
```

---

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 3. Configure Environment Variables

Create:

```text
server/.env
```

Add your MongoDB connection string and JWT secret.

---

## 4. Start Backend

```bash
npm start
```

The backend uses port `5000` by default when `PORT` is not configured.

---

## 5. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

---

## 6. Start Frontend

```bash
npm run dev
```

Vite will provide the local development URL in the terminal.

---

# 🧪 Development

Frontend scripts:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Backend:

```bash
npm start
```

---

# 📸 Screenshots

Add application screenshots here to showcase the UI.

Recommended screenshots:

```text
screenshots/
├── login.png
├── registration.png
├── dashboard.png
├── account.png
├── transfer.png
├── card.png
├── card-payment.png
├── transactions.png
└── pin.png
```

Example:

```markdown
## Dashboard

![Dashboard](screenshots/dashboard.png)

## Fund Transfer

![Fund Transfer](screenshots/transfer.png)

## Transactions

![Transactions](screenshots/transactions.png)
```

---

# 🧠 Key Concepts Demonstrated

This project demonstrates practical implementation of:

* MERN full-stack architecture
* REST API design
* React frontend development
* TypeScript
* Express.js
* MongoDB
* Mongoose
* JWT authentication
* Authentication middleware
* Password hashing
* Protected routes
* MVC-style backend organization
* Database relationships through references
* Financial transaction workflows
* Input validation
* Error handling
* API communication using Axios
* Environment-based configuration

---

# 🔮 Future Improvements

The following improvements could make the system more production-ready:

### Security

* Hash transaction PINs instead of storing/comparing them as plaintext
* Protect and encrypt sensitive card information
* Never store raw CVV in production
* Use cryptographically secure card-number generation
* Add rate limiting
* Add stronger request validation
* Use HTTPS in production
* Implement secure token storage
* Add CSRF protection where applicable

### Transaction Reliability

* Use MongoDB transactions for atomic balance updates
* Prevent race conditions during concurrent transfers
* Implement idempotency for payment requests
* Add proper rollback handling when one part of a transaction fails

### Authentication

* Add refresh tokens
* Add account lockout/rate limiting
* Improve OTP integration
* Add password reset functionality
* Add multi-factor authentication

### Banking Features

* Beneficiary management
* Bank statements
* Downloadable transaction receipts
* Spending analytics
* Scheduled transfers
* Transaction notifications
* Admin dashboard
* Account status management

### Deployment

* Docker
* CI/CD
* Cloud deployment
* Production MongoDB configuration
* Centralized logging
* Monitoring and health checks

---

# ⚠️ Project Disclaimer

This project is an **educational banking-system simulation** and is not intended for handling real financial transactions or sensitive banking information.

It demonstrates software architecture, authentication, database operations, and financial transaction workflows in a development environment.

---

# 👨‍💻 Author

**Yashwanth T M**

GitHub: [@yashwanthtm25](https://github.com/yashwanthtm25)

---

# ⭐ Repository

If you found this project useful, consider giving it a ⭐.

Repository:

https://github.com/yashwanthtm25/Banking-System
