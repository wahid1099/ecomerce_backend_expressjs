### Backend `README.md`

````markdown
# :package: **Backend - E-Commerce Application**

## Overview

This is the **Node.js/Express** backend for the E-Commerce application. It handles user authentication, manages products and orders, and integrates with the **AmarPay** payment gateway for secure transactions.

## :rocket: Features

- **User Authentication**: Register, login, and manage user sessions with JWT.
- **Product Management**: API for viewing product details and adding products to the cart.
- **Order Processing**: Handles order creation and payment integration with AmarPay.
- **MongoDB**: Stores user, product, and order data.

## :wrench: Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/wahid1099/ecomerce_backend_expressjs
   ```
````

2. **Navigate to the backend directory**:

   ```bash
   cd ecomerce_backend_expressjs
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Create a `.env` file** in the root directory and add the following environment variables:

   ```
   PORT=5000
   MONGO_URI=your-mongo-uri
   JWT_SECRET=your-jwt-secret
   AMARPAY_KEY=your-amarpay-api-key
   ```

5. **Start the server**:

   ```bash
   npm start
   ```

6. The backend will be available at `http://localhost:5000`.

## :gear: Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** (with Mongoose)
- **JWT** (for authentication)
- **AmarPay** (payment gateway)

## :book: Contributing

1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/wahid1099/ecomerce_backend_expressjs
   ```
3. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
4. Make your changes.
5. Commit and push:
   ```bash
   git commit -m "Add feature"
   git push origin feature-name
   ```
6. Create a pull request.

---

## :memo: License

This project is licensed under the MIT License.

```

### Key Features of the README:

- **Icons**: Added relevant icons for better readability and visual appeal.
- **Installation**: Clear instructions for setting up the backend.
- **Tech Stack**: Lists the technologies used in the backend.
- **Contributing**: Standard contributing guidelines for GitHub.
- **License**: MIT License mentioned for open-source use.

This should now be properly formatted! Let me know if you need any further adjustments.
```
