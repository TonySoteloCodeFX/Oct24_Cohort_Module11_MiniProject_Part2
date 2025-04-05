import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from 'react-bootstrap';
// Pages
import UsersPage from "./pages/UsersPage";
import GroceriesPage from "./pages/GroceriesPage";
import OrdersPage from "./pages/OrdersPage";

// Users
import UserList from './components/users/UserList';
import CreateUser from './components/users/CreateUser';
import UserDetail from './components/users/UserDetail';
import UpdateUser from './components/users/UpdateUser';
// Groceries
import GroceryList from './components/groceries/GroceryList'; 
import CreateGrocery from './components/groceries/CreateGrocery';
import GroceryDetail from './components/groceries/GroceryDetail';
import UpdateGrocery from './components/groceries/UpdateGrocery';
// Orders
import OrderList from './components/orders/OrderList';
import CreateOrder from './components/orders/CreateOrder';
import OrderDetail from './components/orders/OrderDetail';

function NotFound() {
    return (
        <Container className="text-center py-5">
            <h1>404 - Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Link to="/">Go to Homepage</Link>
        </Container>
    );
}


function App() {
  const location = useLocation(); 

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">Grocery App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/users" active={location.pathname.startsWith('/users')}>
                <i className="bi bi-people-fill me-1"></i> Users
              </Nav.Link>
              <Nav.Link as={Link} to="/groceries" active={location.pathname.startsWith('/groceries')}>
                <i className="bi bi-basket-fill me-1"></i> Groceries
              </Nav.Link>
              <Nav.Link as={Link} to="/orders" active={location.pathname.startsWith('/orders')}>
                <i className="bi bi-receipt me-1"></i> Orders
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main>
         <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />

            <Route path="/users" element={<UsersPage />}>
                <Route index element={<UserList />} /> 
                <Route path="create" element={<CreateUser />} /> 
                <Route path=":id" element={<UserDetail />} /> 
                <Route path="update/:id" element={<UpdateUser />} /> 
            </Route>

            <Route path="/groceries" element={<GroceriesPage />}>
                <Route index element={<GroceryList />} /> 
                <Route path="create" element={<CreateGrocery />} />
                <Route path=":id" element={<GroceryDetail />} />
                <Route path="update/:id" element={<UpdateGrocery />} />
            </Route>

            <Route path="/orders" element={<OrdersPage />}>
                <Route index element={<OrderList />} />
                <Route path="create" element={<CreateOrder />} />
                <Route path=":id" element={<OrderDetail />} />
            </Route>

            <Route path="*" element={<NotFound />} />
         </Routes>
      </main>
    </>
  );
}

export default App;