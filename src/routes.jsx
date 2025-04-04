import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import GroceriesPage from "./pages/GroceriesPage";
import OrdersPage from "./pages/OrdersPage";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/groceries" element={<GroceriesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
