import React, { useState, useEffect, ChangeEvent } from "react";
import { Button, Form, Table } from "react-bootstrap";
import {getSubMachiness,createSubMachines,updateSubMachines,  deleteSubMachines,
} from "../services/SubMachinesService";
import { SubMachines } from "../Models/SubMachines";

const initialData: SubMachines = {
  Id: 0,
  Name_: "",
  Code: "",
  GroupName: "",
  PoductionLineID: 0,
  ProcessTime: 0,
  WaitingTime: 0,
  QueueNumber: 0,
  CUSRID: 0,
  UUSRID: 0,

};

const SubMachinesComponent: React.FC = () => {
  const [subMachines, setSubMachines] = useState<SubMachines[]>([]);
  const [formData, setFormData] = useState<SubMachines>(initialData);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSubMachineId, setCurrentSubMachineId] = useState<number | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    fetchSubMachines();
  }, []);

  const fetchSubMachines = async () => {
    const response = await getSubMachiness();
    setSubMachines(response.data);
  };

  const handleAddSubMachine = () => {
    setFormData(initialData);
    setIsEdit(false);
    setShowPanel(true);
  };

  const handleEditSubMachine = (subMachine: SubMachines) => {
    setFormData(subMachine);
    setIsEdit(true);
    setCurrentSubMachineId(subMachine.Id);
    setShowPanel(true);
  };

  const handleDeleteSubMachine = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this SubMachine?")) {
      await deleteSubMachines(id);
      fetchSubMachines();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "ProcessTime" || name === "WaitingTime" ? parseFloat(value) : value,
    });
  };

  const handleSave = async () => {
    if (isEdit && currentSubMachineId !== null) {
      await updateSubMachines(currentSubMachineId, formData);
    } else {
      await createSubMachines(formData);
    }
    fetchSubMachines();
    setShowPanel(false);
  };

  const handleCancel = () => {
    setShowPanel(false);
    setFormData(initialData);
  };

  return (
    <div className="container-fluid">
      {!showPanel && (
        <div className="card">
          <div className="card-header">
            <h6>SubMachines Management</h6>
            <Button className="btn btn-sm thema-button" onClick={handleAddSubMachine}>
              Add SubMachine
            </Button>
          </div>
          <div className="card-body">
            <Table bordered striped>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Group Name</th>
                  <th>Process Time</th>
                  <th>Waiting Time</th>
                  <th>Queue Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subMachines.map((subMachine) => (
                  <tr key={subMachine.Id}>
                    <td>{subMachine.Id}</td>
                    <td>{subMachine.Name_}</td>
                    <td>{subMachine.Code}</td>
                    <td>{subMachine.GroupName}</td>
                    <td>{subMachine.ProcessTime}</td>
                    <td>{subMachine.WaitingTime}</td>
                    <td>{subMachine.QueueNumber}</td>
                    <td>
                      <Button
                        variant="secondary"
                        className="btn btn-sm"
                        onClick={() => handleEditSubMachine(subMachine)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="btn btn-sm"
                        onClick={() => handleDeleteSubMachine(subMachine.Id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
      {showPanel && (
        <div className="card mt-3">
          <div className="card-header">
            <h6>{isEdit ? "Edit SubMachine" : "Add SubMachine"}</h6>
          </div>
          <div className="card-body">
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="Name_" size="sm"
                  value={formData.Name_}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text" size="sm"
                  name="Code"
                  value={formData.Code}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Group Name</Form.Label>
                <Form.Control
                  type="text" size="sm"
                  name="GroupName"
                  value={formData.GroupName}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Process Time</Form.Label>
                <Form.Control
                  type="number" size="sm"
                  name="ProcessTime"
                  value={formData.ProcessTime}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Waiting Time</Form.Label>
                <Form.Control
                  type="number" size="sm"
                  name="WaitingTime"
                  value={formData.WaitingTime}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Queue Number</Form.Label>
                <Form.Control
                  type="number" size="sm"
                  name="QueueNumber"
                  value={formData.QueueNumber}
                  onChange={handleChange}
                />
              </Form.Group>
              <div className="d-flex justify-content-between mt-4">
                <Button className="btn thema-button btn-sm"  size="sm" onClick={handleSave}>
                  {isEdit ? "Update" : "Create"}
                </Button>
                <Button className="btn btn-secondary"  size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubMachinesComponent;
