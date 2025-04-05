import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

function UsersPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/users' || path === '/users/') {
      return 'User List';
    } else if (path.includes('/create')) {
      return 'Create New User';
    } else if (path.match(/^\/users\/update\/\d+$/)) {
      return 'Update User Information';
    } else if (path.match(/^\/users\/\d+$/)) {
      return 'User Details';
    }
    return 'User Management'; 
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
              <Button variant="primary" onClick={() => navigate('/users/create')}>
                <i className="bi bi-plus-lg me-1"></i> Create User
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

export default UsersPage;