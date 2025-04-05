import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

function OrdersPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/orders' || path === '/orders/') {
      return 'Order History'; 
    } else if (path.includes('/create')) {
      return 'Create New Order';
    } else if (path.match(/^\/orders\/\d+$/)) {
      return 'Order Details';
    }
    return 'Order Management';
  };

  const showCreateButton = location.pathname !== '/orders/create';
  const pageTitle = getPageTitle();

  return (
    <Container fluid className="py-3 py-md-4"> 
      <Row className="justify-content-center">
        <Col xs={12} lg={11} xl={10}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2">{pageTitle}</h1>
            {showCreateButton && (
              <Button variant="success" onClick={() => navigate('/orders/create')}>
                <i className="bi bi-plus-circle-fill me-1"></i> Create Order
              </Button>
            )}
          </div>

          <Card className="shadow-sm">
            <Card.Body>
              <Outlet />
            </Card.Body>
          </Card>

        </Col>
      </Row>
    </Container>
  );
}

export default OrdersPage;