# NestJS POS Learning Project

Backend API untuk aplikasi Point of Sale (POS) yang dibangun menggunakan NestJS.

Project ini dibuat sebagai media pembelajaran backend development dengan fokus pada penerapan arsitektur aplikasi modern, REST API, dan integrasi database menggunakan Prisma ORM.

---

## Objectives

Project ini digunakan untuk mempelajari:

* NestJS Framework
* Dependency Injection
* Module Architecture
* RESTful API Development
* Data Validation
* Authentication & Authorization
* Prisma ORM
* PostgreSQL Database
* Clean Code & Scalable Structure
* Fullstack Integration dengan Angular

---

## Tech Stack

### Backend

* NestJS
* TypeScript
* Node.js

### Database (Planned)

* PostgreSQL
* Prisma ORM

### Authentication (Planned)

* JWT Authentication
* Role-Based Authorization

---

## Current Status

🚧 Project masih dalam tahap pengembangan.

Saat ini project masih menggunakan struktur default NestJS dan akan dikembangkan secara bertahap untuk mendukung fitur Point of Sale.

---

## Planned Modules

### Authentication

* Login
* Register User
* JWT Authentication
* Refresh Token
* Role Management

### Users

* Create User
* Update User
* Delete User
* User Management

### Products

* Create Product
* Update Product
* Delete Product
* Product Stock Management

### Transactions

* Create Transaction
* Transaction Detail
* Sales History
* Sales Reporting

### Dashboard

* Sales Summary
* Product Statistics
* Transaction Statistics

---

## Project Structure

```bash
src/
├── auth/
├── users/
├── products/
├── transactions/
├── common/
├── prisma/
├── app.module.ts
└── main.ts
```
---

## Database Design (Planned)

### User

| Field    | Type            |
| -------- | --------------- |
| id       | UUID            |
| name     | String          |
| email    | String          |
| password | String          |
| role     | ADMIN / CASHIER |

### Product

| Field | Type    |
| ----- | ------- |
| id    | UUID    |
| name  | String  |
| price | Integer |
| stock | Integer |

### TransactionHeader

| Field           | Type     |
| --------------- | -------- |
| id              | UUID     |
| userId          | UUID     |
| total           | Integer  |
| transactionDate | DateTime |

### TransactionDetail

| Field         | Type    |
| ------------- | ------- |
| id            | UUID    |
| transactionId | UUID    |
| productId     | UUID    |
| qty           | Integer |
| price         | Integer |

---

## Author

Muhammad Febrian Hasibuan
