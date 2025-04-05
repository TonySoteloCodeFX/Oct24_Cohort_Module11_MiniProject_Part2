import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getUser, deleteUser } from "../../api/userApi";
import { Card, Button, Alert, Spinner, Modal } from "react-bootstrap";

function UserDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation(); 

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || ""); 

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);


  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const userId = id; 
        const data = await getUser(userId);
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user.");
         if (err.response && err.response.status === 404) {
             setError("User not found.");
             setTimeout(() => navigate("/users"), 2000); 
         }
      } finally {
         setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const confirmDelete = async () => {
    setIsDeleting(true);
    setError(""); 
    try {
      const userId = id; 
      await deleteUser(userId);
      navigate("/users", { state: { successMessage: `User ${user?.first_name || id} deleted successfully.` } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete user.");
      setIsDeleting(false); 
      handleCloseDeleteModal(); 
    }
  };

  if (loading) return <div className="text-center p-3"><Spinner animation="border" /> <p>Loading User Details...</p></div>;

  return (
    <div className="user-detail p-3">
      <h2>User Details</h2>
      {successMessage && <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>{successMessage}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

      {user ? (
        <Card>
          <Card.Header>
            <h4>{user.first_name} {user.last_name}</h4>
          </Card.Header>
          <Card.Body>
            <p><strong>ID:</strong> {user.user_id || id}</p> 
            <p><strong>Email:</strong> {user.email}</p>
            {user.created_at && ( 
                 <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
            )}
             {user.updated_at && user.updated_at !== user.created_at && ( 
                 <p><strong>Last Updated:</strong> {new Date(user.updated_at).toLocaleString()}</p>
            )}

            <div className="d-flex flex-wrap gap-2 mt-3"> 
              <Button variant="primary" onClick={() => navigate(`/users/update/${id}`)}>
                 <i className="bi bi-pencil-square me-1"></i> Edit 
              </Button>
              <Button variant="danger" onClick={handleShowDeleteModal} disabled={isDeleting}>
                <i className="bi bi-trash me-1"></i> Delete 
              </Button>
              <Button variant="secondary" onClick={() => navigate("/users")}>
                <i className="bi bi-arrow-left me-1"></i> Back to List 
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
          !error && <p>User data could not be loaded.</p>
      )}

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user "{user?.first_name} {user?.last_name}" (ID: {id})? This action cannot be undone.
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

export default UserDetail;