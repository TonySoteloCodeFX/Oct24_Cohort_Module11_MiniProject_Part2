# Grocery App - CRUD Management System

---

## Mockups

<img src="/public/UsersPage.png" width="300">
<img src="/public/GroceryPage.png" width="300">
<img src="/public/OrdersPage.png" width="300">

---

## Project Features

### User Management
-   View a list of all registered users.
-   View detailed information for a single user.
-   Register new users with first name, last name, and email.
-   Update existing user details.
-   Delete users from the system (with confirmation).

### Grocery Inventory Management
-   View a list of all grocery items in inventory.
-   View details for a specific grocery item (name, price, stock).
-   Add new grocery items to the inventory.
-   Update existing grocery item details (name, price, inventory level).
-   Delete grocery items from the inventory (with confirmation).

### Order Processing
-   View a history of all placed orders.
-   View details for a specific order (linked user, grocery item, quantity, total price, date).
-   Create new orders by selecting a registered user and an available grocery item.
-   Quantity validation against available inventory during order creation.

### General Frontend Features
-   Clean, responsive UI built with React Bootstrap.
-   Client-side routing for seamless navigation between sections.
-   User feedback through loading indicators, success/error messages, and confirmation modals.
-   Consistent page layouts for Users, Groceries, and Orders sections.

---

## Technologies Used

-   **React** - Frontend JavaScript library for building user interfaces.
-   **Vite** - Next-generation frontend tooling (dev server, build tool).
-   **React Router DOM** - Client-side routing library.
-   **Axios** - Promise-based HTTP client for making API requests.
-   **React Bootstrap** - React components implementing Bootstrap 5 styles.
-   **Bootstrap** - CSS framework for styling and layout.
-   **Bootstrap Icons** - Icon library.
-   **Node.js** - JavaScript runtime and package manager for development.

---

## Folder Structure

```plaintext
my-react-app/
├── public/
├── src/
│   ├── api/                
│   │   ├── userApi.js
│   │   ├── groceryApi.js
│   │   └── orderApi.js
│   │
│   ├── components/         
│   │   ├── users/
│   │   │   ├── CreateUser.jsx
│   │   │   ├── UpdateUser.jsx
│   │   │   ├── UserDetail.jsx
│   │   │   └── UserList.jsx
│   │   │
│   │   ├── groceries/
│   │   │   ├── CreateGrocery.jsx
│   │   │   ├── UpdateGrocery.jsx
│   │   │   ├── GroceryDetail.jsx
│   │   │   └── GroceryList.jsx
│   │   │
│   │   ├── orders/
│   │   │   ├── CreateOrder.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   └── OrderList.jsx
│   │
│   ├── pages/              
│   │   ├── UsersPage.jsx
│   │   ├── GroceriesPage.jsx
│   │   └── OrdersPage.jsx
│   │
│   ├── stylesheets/        # I did not have time to add their own stylesheet
│   │   ├── users/
│   │   ├── groceries/
│   │   └── orders/
│   │
│   ├── App.jsx             
│   └── main.jsx            
│
├── index.html
├── package.json
├── vite.config.js
└── README.md           