# Tienda Virtual Moderna - Angular

Este proyecto es una aplicación web moderna desarrollada con Angular, diseñada como una interfaz de tienda virtual de alto rendimiento. La aplicación combina una estética premium con una funcionalidad robusta de e-commerce y gestión.

## 🚀 Características Principales

*   **Sistema de Autenticación de Roles**: Pantalla de acceso personalizada con soporte para roles de `CLIENTE` y `ADMINISTRADOR`.
*   **Tienda Virtual Dinámica**: Catálogo interactivo de productos con tarjetas detalladas y efectos visuales modernos.
*   **Gestión de Carrito Persistente**: Sistema de carrito de compras que mantiene los productos seleccionados incluso después de recargar la página.
*   **Diseño Premium**: Interfaz moderna con fondos animados de partículas, degradados elegantes y una escala optimizada mediante unidades `vh`.
*   **Simulación de Pago**: Integración visual de procesos de pago (simulando PayPal) para una experiencia de usuario completa.
*   **Arquitectura Reactiva**: Uso de servicios avanzados de Angular y `Signals` para una gestión de estado eficiente y en tiempo real.

## 🛠️ Tecnologías Utilizadas

*   **Framework**: Angular 21+ (Standalone Components).
*   **Lenguaje**: TypeScript.
*   **Estilos**: CSS3 nativo con variables personalizadas y animaciones complejas.
*   **Estado**: Angular Signals & RxJS.
*   **Persistencia**: LocalStorage para sesiones y carrito.

## 💻 Desarrollo

### Servidor de Desarrollo

Para iniciar el servidor local, ejecuta:

```bash
npm start
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si realizas cambios en los archivos.

### Construcción (Build)

Para compilar el proyecto para producción:

```bash
npm run build
```

Los archivos resultantes se guardarán en el directorio `dist/`.

## 📁 Estructura del Proyecto

*   `src/app/components`: Componentes visuales (Navbar, Listas de productos, Modales).
*   `src/app/services`: Lógica de negocio (Autenticación, Carrito, Gestión de productos).
*   `src/app/models`: Interfaces y tipos de datos.
*   `src/app/app.css`: Sistema de diseño global y tokens visuales.


