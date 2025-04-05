import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

function GroceriesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/groceries' || path === '/groceries/') {
      return 'Grocery Inventory'; 
    } else if (path.includes('/create')) {
      return 'Add New Grocery Item';
    } else if (path.match(/^\/groceries\/update\/\d+$/)) {
      return 'Update Grocery Item';
    } else if (path.match(/^\/groceries\/\d+$/)) {
      return 'Grocery Item Details';
    }
    return 'Grocery Management';
  };

  const showCreateButton = !location.pathname.includes('/create');
  const pageTitle = getPageTitle();

  return (
    <Container fluid className="py-3 py-md-4"> 
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}> 

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2">{pageTitle}</h1>
            {showCreateButton && (
              <Button variant="info" onClick={() => navigate('/groceries/create')}>
                <i className="bi bi-plus-square-fill me-1"></i> Add Item
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

export default GroceriesPage;