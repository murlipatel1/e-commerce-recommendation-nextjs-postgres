INSERT INTO users (id, name, email, password, role) VALUES
(gen_random_uuid(), 'Alice Johnson', 'alice@example.com', 'hashed_password1', 'user'),
(gen_random_uuid(), 'Bob Smith', 'bob@example.com', 'hashed_password2', 'admin'),
(gen_random_uuid(), 'Charlie Brown', 'charlie@example.com', 'hashed_password3', 'user'),
(gen_random_uuid(), 'Diana Prince', 'diana@example.com', 'hashed_password4', 'user'),
(gen_random_uuid(), 'Ethan Hunt', 'ethan@example.com', 'hashed_password5', 'user');


INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES
((SELECT id FROM users WHERE email = 'alice@example.com'), 'refresh_token_1', NOW() + INTERVAL '7 days'),
((SELECT id FROM users WHERE email = 'bob@example.com'), 'refresh_token_2', NOW() + INTERVAL '7 days'),
((SELECT id FROM users WHERE email = 'charlie@example.com'), 'refresh_token_3', NOW() + INTERVAL '7 days'),
((SELECT id FROM users WHERE email = 'diana@example.com'), 'refresh_token_4', NOW() + INTERVAL '7 days'),
((SELECT id FROM users WHERE email = 'ethan@example.com'), 'refresh_token_5', NOW() + INTERVAL '7 days');


INSERT INTO products (id, name, description, price, stock, category) VALUES
(gen_random_uuid(), 'Smartphone X', 'Latest smartphone with AI features', 699.99, 50, 'Electronics'),
(gen_random_uuid(), 'Wireless Earbuds', 'Noise-cancelling earbuds with high-quality sound', 149.99, 100, 'Accessories'),
(gen_random_uuid(), 'Gaming Laptop', 'Powerful laptop for gaming and work', 1299.99, 20, 'Computers'),
(gen_random_uuid(), 'Smartwatch Pro', 'Advanced smartwatch with health tracking', 299.99, 75, 'Wearables'),
(gen_random_uuid(), 'Mechanical Keyboard', 'RGB backlit keyboard for gaming and work', 89.99, 200, 'Accessories');


INSERT INTO orders (id, user_id, total_price, status) VALUES
(gen_random_uuid(), (SELECT id FROM users WHERE email = 'alice@example.com'), 849.98, 'pending'),
(gen_random_uuid(), (SELECT id FROM users WHERE email = 'bob@example.com'), 1299.99, 'shipped'),
(gen_random_uuid(), (SELECT id FROM users WHERE email = 'charlie@example.com'), 299.99, 'delivered'),
(gen_random_uuid(), (SELECT id FROM users WHERE email = 'diana@example.com'), 89.99, 'cancelled'),
(gen_random_uuid(), (SELECT id FROM users WHERE email = 'ethan@example.com'), 699.99, 'pending');

INSERT INTO reviews (id, user_id, product_id, rating, comment) VALUES
(gen_random_uuid(), (SELECT id FROM users WHERE email = 'alice@example.com'), (SELECT id FROM products WHERE name = 'Smartphone X'), 5, 'Amazing smartphone! Worth every penny.'),
(gen_random_uuid(), (SELECT id FROM users WHERE email = 'bob@example.com'), (SELECT id FROM products WHERE name = 'Gaming Laptop'), 4, 'Great performance but a bit pricey.'),
(gen_random_uuid(), (SELECT id FROM users WHERE email = 'charlie@example.com'), (SELECT id FROM products WHERE name = 'Wireless Earbuds'), 3, 'Sound is good but battery life is short.'),
(gen_random_uuid(), (SELECT id FROM users WHERE email = 'diana@example.com'), (SELECT id FROM products WHERE name = 'Smartwatch Pro'), 5, 'Perfect for tracking workouts!'),
(gen_random_uuid(), (SELECT id FROM users WHERE email = 'ethan@example.com'), (SELECT id FROM products WHERE name = 'Mechanical Keyboard'), 4, 'Very satisfying keys and great build quality.');


INSERT INTO recommendations (user_id, product_id, category, visit_count) VALUES
((SELECT id FROM users WHERE email = 'alice@example.com'), (SELECT id FROM products WHERE name = 'Smartwatch Pro'), 'Wearables', 1),
((SELECT id FROM users WHERE email = 'bob@example.com'), (SELECT id FROM products WHERE name = 'Gaming Laptop'), 'Computers', 1),
((SELECT id FROM users WHERE email = 'charlie@example.com'), (SELECT id FROM products WHERE name = 'Wireless Earbuds'), 'Accessories', 1),
((SELECT id FROM users WHERE email = 'diana@example.com'), (SELECT id FROM products WHERE name = 'Mechanical Keyboard'), 'Accessories', 1),
((SELECT id FROM users WHERE email = 'ethan@example.com'), (SELECT id FROM products WHERE name = 'Smartphone X'), 'Electronics', 1);