import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Button, Table, Modal, Form } from "react-bootstrap";
import "../css/AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("doctors");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (activeTab === "doctors") loadDoctors();
    else if (activeTab === "patients") loadPatients();
    else if (activeTab === "appointments") loadAppointments();
  }, [activeTab]);

  const loadDoctors = async () => {
    const res = await api.get("/admin/doctors", config);
    setDoctors(res.data);
  };

  const loadPatients = async () => {
    const res = await api.get("/admin/patients", config);
    setPatients(res.data);
  };

  const loadAppointments = async () => {
    const res = await api.get("/admin/appointments", config);
    setAppointments(res.data);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure?")) return;
    let endpoint = "";
    if (type === "doctors") endpoint = "/admin/doctors";
    else if (type === "patients") endpoint = "/admin/patients";
    else if (type === "appointments") endpoint = "/admin/appointments";
    await api.delete(`${endpoint}/${id}`, config);
    if (type === "doctors") loadDoctors();
    else if (type === "patients") loadPatients();
    else loadAppointments();
  };

  const handleApprove = async (id) => {
    await api.put(`/admin/appointments/${id}/approve`, {}, config);
    loadAppointments();
  };

  const handleReject = async (id) => {
    await api.put(`/admin/appointments/${id}/reject`, {}, config);
    loadAppointments();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const endpoint =
      activeTab === "doctors" ? "/admin/doctors" : "/admin/patients";
    if (editMode) {
      await api.put(`${endpoint}/${formData.id}`, formData, config);
    } else {
      await api.post(endpoint, formData, config);
    }
    setShowModal(false);
    setFormData({});
    setEditMode(false);
    if (activeTab === "doctors") loadDoctors();
    else loadPatients();
  };

  const renderTable = () => {
    if (activeTab === "doctors") {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id}>
                <td>{d.user?.username}</td>
                <td>{d.user?.fullName}</td>
                <td>{d.specialization}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => {
                      setFormData(d);
                      setEditMode(true);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(d.id, "doctors")}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }

    if (activeTab === "patients") {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td>{p.user?.username}</td>
                <td>{p.user?.fullName}</td>
                <td>{p.phone}</td>
                <td>{p.address}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => {
                      setFormData(p);
                      setEditMode(true);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(p.id, "patients")}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }

    if (activeTab === "appointments") {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date/Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.patient?.user?.fullName}</td>
                <td>{a.doctor?.user?.fullName}</td>
                <td>{new Date(a.appointmentDateTime).toLocaleString()}</td>
                <td>{a.status}</td>
                <td>
                  {a.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleApprove(a.id)}
                      >
                        Approve
                      </Button>{" "}
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => handleReject(a.id)}
                      >
                        Reject
                      </Button>{" "}
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(a.id, "appointments")}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <div className="mb-3">
        <Button
          variant={activeTab === "doctors" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("doctors")}
        >
          Doctors
        </Button>{" "}
        <Button
          variant={activeTab === "patients" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("patients")}
        >
          Patients
        </Button>{" "}
        <Button
          variant={activeTab === "appointments" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
        </Button>{" "}
        {(activeTab === "doctors" || activeTab === "patients") && (
          <Button
            variant="success"
            onClick={() => {
              setEditMode(false);
              setFormData({});
              setShowModal(true);
            }}
          >
            Add {activeTab === "doctors" ? "Doctor" : "Patient"}
          </Button>
        )}
      </div>
      {renderTable()}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Edit" : "Add"}{" "}
            {activeTab === "doctors" ? "Doctor" : "Patient"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.user?.username || formData.username || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    user: {
                      ...(formData.user || {}),
                      username: e.target.value,
                    },
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.user?.fullName || formData.fullName || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    user: {
                      ...(formData.user || {}),
                      fullName: e.target.value,
                    },
                  })
                }
                required
              />
            </Form.Group>
            {activeTab === "doctors" ? (
              <Form.Group className="mb-3">
                <Form.Label>Specialization</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.specialization || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  required
                />
              </Form.Group>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.address || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
