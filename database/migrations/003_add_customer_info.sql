-- Add customer information fields to users table
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
ALTER TABLE users ADD COLUMN phone VARCHAR(50);
ALTER TABLE users ADD COLUMN address_line1 VARCHAR(255);
ALTER TABLE users ADD COLUMN address_line2 VARCHAR(255);
ALTER TABLE users ADD COLUMN city VARCHAR(100);
ALTER TABLE users ADD COLUMN postal_code VARCHAR(20);
ALTER TABLE users ADD COLUMN country VARCHAR(100) DEFAULT 'Sverige';

-- Add shipping information to orders table
ALTER TABLE orders ADD COLUMN shipping_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN shipping_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN shipping_phone VARCHAR(50);
ALTER TABLE orders ADD COLUMN shipping_address_line1 VARCHAR(255);
ALTER TABLE orders ADD COLUMN shipping_address_line2 VARCHAR(255);
ALTER TABLE orders ADD COLUMN shipping_city VARCHAR(100);
ALTER TABLE orders ADD COLUMN shipping_postal_code VARCHAR(20);
ALTER TABLE orders ADD COLUMN shipping_country VARCHAR(100);
ALTER TABLE orders ADD COLUMN shipping_carrier VARCHAR(50);
ALTER TABLE orders ADD COLUMN shipping_cost DECIMAL(10, 2) DEFAULT 0;

-- Create index for faster lookups
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
CREATE INDEX idx_orders_shipping_email ON orders(shipping_email);
