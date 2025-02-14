# E-Commerce Recommendation System

## Project Description

This project is an e-commerce platform built with Next.js for the frontend and Express.js for the backend. It features a recommendation system that suggests products to users based on their browsing history and category visits. The platform includes user authentication, product management, order management, and review functionality.

## Features

- **User Authentication**: Users can register, log in, and log out. Authentication is handled using JWT tokens.
- **Product Management**: Admin users can add, update, and delete products. All users can view product details.
- **Order Management**: Users can add products to their cart and place orders. Users can view their order history.
- **Review System**: Users can leave reviews for products they have purchased.
- **Recommendation System**: The platform recommends products to users based on their browsing history and category visits.

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Express.js, Sequelize, PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL
- **Other**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js
- Docker (optional, for running PostgreSQL)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/e-commerce-recommendation-system.git
cd e-commerce-recommendation-system
```

2. Install dependencies for both frontend and backend:

```bash
cd frontend
npm install
cd ../backend
npm install
```

3. Set up the PostgreSQL database:

- If using Docker:

```bash
docker-compose up -d
```

- If not using Docker, ensure you have PostgreSQL installed and running. Create a database and update the connection details in `backend/config/db.js`.

4. Run database migrations and seed data:

```bash
cd backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### Running the Application

1. Start the backend server:

```bash
cd backend
npm start
```

2. Start the frontend server:

```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`.

## API Endpoints

### Authentication

- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/login`: Log in a user
- `POST /api/v1/auth/logout`: Log out a user
- `POST /api/v1/auth/refresh`: Refresh JWT token

### Products

- `GET /api/v1/products`: Get all products
- `GET /api/v1/products/:id`: Get a product by ID
- `POST /api/v1/products`: Create a new product (admin only)
- `DELETE /api/v1/products/:id`: Delete a product (admin only)

### Orders

- `GET /api/v1/orders`: Get all orders for the logged-in user
- `POST /api/v1/orders`: Create a new order

### Reviews

- `POST /api/v1/reviews`: Create a new review

### Recommendations

- `GET /api/v1/recommendations`: Get recommendations for the logged-in user
- `POST /api/v1/recommendations/update`: Update recommendations based on category visits

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.