-- Insert Categories
INSERT INTO product_category (name, image) VALUES 
('Mobile', ''),
('Laptop', '');

INSERT INTO product_brand (name, categoryID_id) VALUES 
('Apple', 1),  -- 1 is Mobile
('Samsung', 1), 
('Xiaomi', 1), 
('OnePlus', 1), 
('Lenovo', 2),  -- 2 is Laptop
('Dell', 2), 
('HP', 2), 
('Asus', 2), 
('Acer', 2);

-- Insert Products
INSERT INTO product_product (name, description, model, price, stock_items, BID_id, CategoryID_id, base_view) VALUES
('iPhone 14', 'The latest Apple smartphone with A15 chip and enhanced features', 'A2643', 999.99, 50, 1, 1, NULL),
('iPhone 13', 'A smartphone with A14 chip, great camera, and new features', 'A2403', 799.99, 100, 1, 1, NULL),
('Samsung Galaxy S22', 'Flagship Samsung phone with top features', 'S901B', 899.99, 80, 2, 1, NULL),
('Samsung Galaxy A53', 'Affordable Samsung phone with good performance', 'SM-A536B', 349.99, 200, 2, 1, NULL),
('Xiaomi Mi 12', 'Xiaomi flagship with Snapdragon 8 Gen 1', '2201123G', 749.99, 150, 3, 1, NULL),
('Xiaomi Redmi Note 11', 'Mid-range Xiaomi phone with Snapdragon 680', '2201117TY', 249.99, 300, 3, 1, NULL),
('OnePlus 10 Pro', 'Flagship OnePlus phone with Snapdragon 8 Gen 1', 'NE2213', 899.99, 70, 4, 1, NULL),
('OnePlus Nord 2', 'Mid-range OnePlus phone with MediaTek Dimensity 1200', 'DN2101', 399.99, 120, 4, 1, NULL),
('Lenovo IdeaPad 5', 'Slim and powerful laptop with Intel i7', '82FE00TGUS', 899.99, 40, 5, 2, NULL),
('Lenovo Legion 5', 'Gaming laptop with AMD Ryzen 7 and GTX 1660Ti', '82JW00B5US', 1199.99, 20, 5, 2, NULL),
('Dell XPS 13', 'Ultrabook with Intel i7 and great design', '9305', 1099.99, 30, 6, 2, NULL),
('Dell Inspiron 15', 'Affordable laptop with Intel i5', '5502', 699.99, 60, 6, 2, NULL),
('HP Spectre x360', 'Convertible laptop with Intel i7 and 4K display', '14-ea0037nr', 1299.99, 25, 7, 2, NULL),
('HP Pavilion 15', 'Mid-range laptop with Intel i5 and Full HD display', '15-eg0073cl', 799.99, 50, 7, 2, NULL),
('Asus ROG Zephyrus G14', 'Gaming laptop with AMD Ryzen 9 and RTX 3060', 'GA402RJ', 1499.99, 15, 8, 2, NULL),
('Asus VivoBook 15', 'Budget laptop with Intel i3', 'F512JA-AS34', 449.99, 70, 8, 2, NULL),
('Acer Nitro 5', 'Affordable gaming laptop with Intel i5 and GTX 1650', 'AN515-55-53E5', 899.99, 30, 9, 2, NULL),
('Acer Aspire 5', 'All-rounder laptop with Intel i5', 'A515-56-50RS', 649.99, 100, 9, 2, NULL);

-- Inserting more products for larger data volume
INSERT INTO product_product (name, description, model, price, stock_items, BID_id, CategoryID_id, base_view) VALUES
('iPhone 14 Pro', 'Pro model with better camera and more storage', 'A2644', 1099.99, 40, 1, 1, NULL),
('iPhone 12', 'A smartphone with A13 chip and OLED display', 'A2172', 699.99, 90, 1, 1, NULL),
('Samsung Galaxy Z Fold3', 'Foldable smartphone with premium design', 'SM-F926B', 1799.99, 20, 2, 1, NULL),
('Samsung Galaxy S21 FE', 'Affordable version of the flagship S21', 'SM-G990B', 649.99, 120, 2, 1, NULL),
('Xiaomi Mi 11', 'Xiaomi flagship with Snapdragon 888', 'M2011K2C', 699.99, 110, 3, 1, NULL),
('Xiaomi Poco X3', 'Budget phone with excellent specs', 'M2007J20CI', 199.99, 250, 3, 1, NULL),
('OnePlus 9', 'Flagship OnePlus phone with Snapdragon 888', 'LE2111', 729.99, 60, 4, 1, NULL),
('OnePlus Nord CE', 'Affordable OnePlus phone with good performance', 'EB2101', 299.99, 150, 4, 1, NULL),
('Lenovo ThinkPad X1 Carbon', 'Business laptop with Intel i7', '20U9005MUS', 1499.99, 20, 5, 2, NULL),
('Lenovo Yoga 9i', 'Convertible laptop with Intel i7 and premium design', '82BG0060US', 1399.99, 15, 5, 2, NULL),
('Dell XPS 15', 'Powerful ultrabook with Intel i9 and GTX 1650 Ti', '9500', 1799.99, 10, 6, 2, NULL),
('Dell G5 15', 'Gaming laptop with Intel i7 and GTX 1660 Ti', '5590', 1199.99, 25, 6, 2, NULL),
('HP Envy 13', 'Lightweight laptop with Intel i7 and great battery life', '13-ba1010nr', 999.99, 40, 7, 2, NULL),
('HP Omen 15', 'Gaming laptop with AMD Ryzen 5 and GTX 1660 Ti', '15-en0029nr', 1099.99, 20, 7, 2, NULL),
('Asus TUF Gaming A15', 'Durable gaming laptop with AMD Ryzen 7', 'FA506IH', 999.99, 30, 8, 2, NULL),
('Asus ZenBook 14', 'Compact ultrabook with Intel i5', 'UX425EA', 849.99, 50, 8, 2, NULL),
('Acer Predator Helios 300', 'Gaming laptop with Intel i7 and RTX 2060', 'PH315-53-72XD', 1299.99, 15, 9, 2, NULL),
('Acer Swift 3', 'Thin and light laptop with AMD Ryzen 7', 'SF314-42-R9YN', 699.99, 80, 9, 2, NULL);
