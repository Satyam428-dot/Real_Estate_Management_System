import { useEffect, useState } from "react";
import axios from "axios";
import "./ViewAllUsers.css";

export default function ViewAllUsers() {
  const [owners, setOwners] = useState([]);
  const [customers, setCustomers] = useState([]);

  const fetchUsers = async () => {
    try {
      const ownerResponse = await axios.get(
        "http://localhost:8080/users/role/owners",
      );
      setOwners(ownerResponse.data);

      const customerResponse = await axios.get(
        "http://localhost:8080/users/role/customers",
      );
      setCustomers(customerResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderTable = (title, rows) => (
    <div className="card table-card border-0 shadow-sm">
      <div className="card-header bg-transparent border-0 py-2 px-4">
        <h3 className="table-title">{title}</h3>
      </div>

      <div className="card-body px-4 pt-0 pb-3">
        <div className="table-responsive custom-table-container">
          <table className="table custom-blue-table align-middle mb-0">
            <thead>
              <tr>
                <th className="ps-3">ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created On</th>
                <th className="text-center action-column">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td className="fw-bold text-secondary ps-3">{u.id}</td>

                  <td className="fw-semibold">{u.firstName}</td>

                  <td className="fw-semibold">{u.lastName}</td>

                  <td className="email-cell" title={u.email}>
                    {u.email}
                  </td>

                  <td className="text-muted">{u.phone}</td>

                  <td className="text-muted">{u.createdOn}</td>

                  <td className="action-column">
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                      <button className="btn btn-sm btn-action btn-view">
                        View
                      </button>

                      <button className="btn btn-sm btn-action btn-edit">
                        Edit
                      </button>

                      <button className="btn btn-sm btn-action btn-disable">
                        Disable
                      </button>

                      <button className="btn btn-sm btn-action btn-delete">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="users-page container-fluid px-0 pt-0">
      <h2 className="page-title">Users Management</h2>

      <div className="card filter-card border-0 shadow-sm">
        <div className="card-body p-3 d-flex gap-3 flex-wrap align-items-center">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by Name / Email..."
          />

          <select className="form-select filter-select">
            <option>All Roles</option>
            <option>Owner</option>
            <option>Customer</option>
          </select>

          <select className="form-select filter-select">
            <option>All Status</option>
            <option>Active</option>
            <option>Disabled</option>
          </select>

          <button className="btn btn-primary px-4 shadow-sm btn-search">
            Search
          </button>

          <button className="btn btn-light border px-4 btn-reset">Reset</button>
        </div>
      </div>

      {renderTable("Property Owners", owners)}
      {renderTable("Customers", customers)}
    </div>
  );
}
