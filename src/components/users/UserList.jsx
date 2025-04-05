import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { getUsers, deleteUser } from "../../api/userApi";
import { Button, Table, Alert, Spinner, Modal } from "react-bootstrap"; 

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState("");
  const navigate = useNavigate(); 
  const location = useLocation(); 

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); 
  const [isDeleting, setIsDeleting] = useState(false);

  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || "");

   useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      navigate(location.pathname, { replace: true, state: {} });
      return () => clearTimeout(timer);
    }
  }, [successMessage, location.pathname, navigate]);


  useEffect(() => {
    fetchUsers();
  }, []); 

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch users.");
      setUsers([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleShowDeleteModal = (user) => {
      setUserToDelete(user);
      setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
      setShowDeleteModal(false);
      setUserToDelete(null); 
      setIsDeleting(false);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    setError(""); 

    try {
      await deleteUser(userToDelete.user_id); 
      handleCloseDeleteModal(); 
      setSuccessMessage(`User ${userToDelete.first_name} deleted successfully.`); 
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || `Failed to delete user ${userToDelete.first_name}.`);
      setIsDeleting(false); 
      handleCloseDeleteModal();
    }
  };


  return (
    <div className="user-list p-3"> 
      <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Users</h2>
          <Button variant="success" onClick={() => navigate("/users/create")}>
            <i className="bi bi-plus-circle me-1"></i> Create New User 
          </Button>
      </div>

      {successMessage && <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>{successMessage}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

      {loading ? (
         <div className="text-center"><Spinner animation="border" /> <p>Loading Users...</p></div>
      ) : (
        users.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th className="text-center">Actions</th> 
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  <td className="text-center"> 
                    <Button
                        variant="info"
                        size="sm"
                        className="me-1 mb-1 mb-md-0"
                        onClick={() => navigate(`/users/${user.user_id}`)}
                        title="View Details"
                    >
                         <i className="bi bi-eye"></i>
                         <span className="d-none d-md-inline ms-1">View</span>
                    </Button>
                    <Button
                        variant="warning"
                        size="sm"
                        className="me-1 mb-1 mb-md-0"
                        onClick={() => navigate(`/users/update/${user.user_id}`)}
                        title="Edit User"
                    >
                         <i className="bi bi-pencil-square"></i>
                         <span className="d-none d-md-inline ms-1">Edit</span>
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleShowDeleteModal(user)} 
                        disabled={isDeleting && userToDelete?.user_id === user.user_id}
                        title="Delete User"
                    >
                         <i className="bi bi-trash"></i>
                         <span className="d-none d-md-inline ms-1">Delete</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !error && <Alert variant="info">No users found. Create one!</Alert>
        )
      )}

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user "{userToDelete?.first_name} {userToDelete?.last_name}" (ID: {userToDelete?.user_id})? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
            {isDeleting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Delete User'}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default UserList;