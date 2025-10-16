-- ============================================
-- Script de Configuración de Base de Datos
-- Proyecto: Conexión Rural
-- ============================================

-- Crear la base de datos (ejecutar como superusuario postgres)
CREATE DATABASE conexion_rural;

-- Conectar a la base de datos
\c conexion_rural;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Mostrar tablas creadas
\dt

-- Instrucciones para el usuario
SELECT 'Base de datos configurada correctamente' AS status;

