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
| id         | UUID    | Primary key          |
| name       | VARCHAR(100) | User's name          |
| email      | VARCHAR(255) | User's email         |
| password   | TEXT    | User's password hash |
| role       | VARCHAR(20) | User's role (user/admin)   |
| created_at | TIMESTAMP | Timestamp of creation |

### Refresh Tokens Table
| Column     | Type    | Description          |
|------------|---------|----------------------|
| id         | SERIAL  | Primary key          |
| user_id    | UUID    | Foreign key to Users |
| token      | TEXT    | Refresh token        |
| expires_at | TIMESTAMP | Expiration timestamp |

### Products Table
| Column     | Type    | Description          |
|------------|---------|----------------------|
| id         | UUID    | Primary key          |
| name       | VARCHAR(255) | Product name         |
| description| TEXT    | Product description  |
| price      | DECIMAL(10,2) | Product price        |
| stock      | INT     | Product stock number |
| category   | VARCHAR(50) | Product category       |
| created_at | TIMESTAMP | Timestamp of creation |

### Orders Table
| Column     | Type    | Description          |
|------------|---------|----------------------|
| id         | UUID    | Primary key          |
| user_id    | UUID    | Foreign key to Users |
| total_price| DECIMAL(10,2) | Total price of the order |
| status     | VARCHAR(20) | Order status (pending/shipped/delivered/cancelled) |
| created_at | TIMESTAMP | Timestamp of creation |

### Reviews Table
| Column     | Type    | Description          |
|------------|---------|----------------------|
| id         | UUID    | Primary key          |
| user_id    | UUID    | Foreign key to Users |
| product_id | UUID    | Foreign key to Products |
| rating     | INT     | Rating (1-5)         |
| comment    | TEXT    | Review comment       |
| created_at | TIMESTAMP | Timestamp of creation |

### Recommendations Table
| Column     | Type    | Description          |
|------------|---------|----------------------|
| id         | SERIAL  | Primary key          |
| user_id    | UUID    | Foreign key to Users |
| product_id | UUID    | Foreign key to Products |
| category   | VARCHAR(50) | Product category       |
| visit_count| INT     | Visit count          |
| created_at | TIMESTAMP | Timestamp of creation |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.