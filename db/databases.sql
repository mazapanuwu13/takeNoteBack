CREATE DATABASE IF NOT EXISTS notesdb;

USE notesdb;

-- Crear la tabla de usuarios
CREATE TABLE users (
    user_id INT (11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);

-- Crear la tabla de notesdb
CREATE TABLE notes (
    nota_id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(60) DEFAULT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    is_processed BOOLEAN,
    PRIMARY KEY (nota_id),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Insert user
INSERT INTO users (username, email, password) VALUES 
     ('arturo', 'arturo@gmai.com', '12345');

-- Insert note
INSERT INTO notes (title, description, is_processed, user_id) 
    VALUES 
        ('Nota de prueba2', 'esta es una nota de prueba2', true, 1),
        ('Nota de prueba3', 'esta es una nota de prueba3', true, 1),
        ('Nota de prueba4', 'esta es una nota de prueba4', true, 1);
