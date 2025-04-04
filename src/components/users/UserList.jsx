import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../api/userApi";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import "../../styles/users/UserList.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load users.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchUsers(); 
        alert("User deleted successfully!");
      } catch (err) {
        setError("Failed to delete user.");
      }
    }
  };

  if (loading) return <Spinner animation="border" className="m-3" />;
  if (error) return <Alert variant="danger" className="m-3">{error}</Alert>;

  return (
    <div className="user-list">
      <h2>Users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default UserList;
