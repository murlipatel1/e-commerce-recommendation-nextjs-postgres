# E-commerce Recommendation System Backend

This document provides an overview of the backend for the E-commerce Recommendation System, built using Node.js, Express, and PostgreSQL.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://url.com/
    cd e-commerce-recommendation-system/backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up the PostgreSQL database and update the configuration in `config.js`.

4. Run the development server:
    ```sh
    npm start
    ```

## Configuration

Update the `config.js` file with your PostgreSQL database credentials:
```js
module.exports = {
    database: {
        host: 'localhost',
        port: 5432,
        user: 'yourusername',
        password: 'yourpassword',
        database: 'yourdatabase'
    },
    server: {
        port: 3000
    }
};
```

## API Endpoints

### User Endpoints
- `GET /users`: Retrieve all users
- `POST /users`: Create a new user
- `GET /users/:id`: Retrieve a user by ID
- `PUT /users/:id`: Update a user by ID
- `DELETE /users/:id`: Delete a user by ID

### Product Endpoints
- `GET /products`: Retrieve all products
- `POST /products`: Create a new product
- `GET /products/:id`: Retrieve a product by ID
- `PUT /products/:id`: Update a product by ID
- `DELETE /products/:id`: Delete a product by ID

### Recommendation Endpoints
- `GET /recommendations/:userId`: Retrieve product recommendations for a user

## Database Schema

### Users Table
| Column     | Type    | Description          |
|------------|---------|----------------------|
| id         | SERIAL  | Primary key          |
| name       | TEXT    | User's name          |
| email      | TEXT    | User's email         |
| password   | TEXT    | User's password hash |

### Products Table
| Column     | Type    | Description          |
|------------|---------|----------------------|
| id         | SERIAL  | Primary key          |
| name       | TEXT    | Product name         |
| description| TEXT    | Product description  |
| price      | NUMERIC | Product price        |

### Recommendations Table
| Column     | Type    | Description          |
|------------|---------|----------------------|
| id         | SERIAL  | Primary key          |
| userId     | INTEGER | Foreign key to Users |
| productId  | INTEGER | Foreign key to Products |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.