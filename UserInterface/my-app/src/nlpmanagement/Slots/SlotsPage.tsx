import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import Slots from './Slots'; // Importing the model class
import ChatbotApiHelper from '../../Helper/ChatbotApiHelper';
import Select2 from '../../components/Select2'; // Importing the Select2 component
import Forms from '../Form/Form';

const SlotsPage: React.FC = () => {
  const api = new ChatbotApiHelper();
  const [slots, setSlots] = useState<Slots[]>([]);
  const [filteredSlots, setFilteredSlots] = useState<Slots[]>([]);
  const [forms, setForms] = useState<Forms[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newSlot, setNewSlot] = useState<Slots>(
    new Slots(0, '', '', 0, '', 0, '')
  );
  const [filterText, setFilterText] = useState<string>(''); // State for search filter

  const fetchFormss = async () => {
    try {
      const data = await api.getwithheader('forms');
      setForms(data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const fetchSlots = async () => {
    try {
      const data = await api.getwithheader('slots');
      setSlots(data);
      setFilteredSlots(data); // Initialize filtered slots
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  useEffect(() => {
    fetchFormss();
    fetchSlots();
  }, []);

  // Handle slot filtering based on the search input
  const handleFilterChange = (text: string) => {
    setFilterText(text);
    setFilteredSlots(
      slots.filter(
        (slot) =>
          (slot.SlotName?.toLowerCase().includes(text.toLowerCase()) || '') ||
          (slot.Stype?.toLowerCase().includes(text.toLowerCase()) || '') ||
          (slot.InputMessage?.toLowerCase().includes(text.toLowerCase()) || '')||
          (slot.FormID?.toString().toLocaleLowerCase().includes(text.toLowerCase()) || '')
      )
    );
  };
  
  const ModalClose= async()=>{
  try {
    setNewSlot(new Slots(0, '', '', 0, '', 0, ''));
    setShowModal(false)
  } catch (error) {
    
  } 
  }
  const handleAddSlot = async () => {
    try {
      const resAccount: Slots | null = await api.post<Slots>('slots', newSlot);
      if (resAccount !== null) {
        fetchSlots();
        debugger;
        handleFilterChange(filterText)
        //setNewSlot(new Slots(0, '', '', 0, '', 0, '')); // Reset the form
        //setShowModal(false); // Close the modal
        alert("The slot saved")
      }
    } catch (error) {
      console.error('Error adding slot:', error);
    }
  };

  const handleDeleteSlot = async (slotId: number) => {
    if (window.confirm('Are you sure that you want to delete this information?')) {
      try {
        const res = await api.delete(`slots/${slotId}`);
        if (res) {
          const updated = slots.filter((item) => item.SlotID !== slotId);
          fetchFormss();
          setSlots(updated);
          setFilteredSlots(updated); // Update filtered slots
        }
      } catch (error) {
        console.error('Error deleting slot:', error);
      }
    }
  };

  return (
    <div className="container container-fluid">
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-6">
              <Form.Control
                type="text"
                placeholder="Search Slots..."
                className="form-control-sm"
                value={filterText}
                onChange={(e) => handleFilterChange(e.target.value)}
              />
            </div>
            <div className="col-6 text-end">
              <Button className="btn thema-button" size="sm" onClick={() => setShowModal(true)}>
                Add Slot
              </Button>
            </div>
          </div>
        </div>
        <div className="card-body mt-3">
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>SlotID</th>
                <th>SlotName</th>
                <th>Type</th>
                <th>IsRequired</th>
                <th>InputMessage</th>
                <th>FormID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSlots.map((slot) => (
                <tr key={slot.SlotID}>
                  <td>{slot.SlotID}</td>
                  <td>{slot.SlotName}</td>
                  <td>{slot.Stype}</td>
                  <td>{slot.IsRequired}</td>
                  <td>{slot.InputMessage}</td>
                  <td>{slot.FormID}</td>
                  <td>
                    <Button
                      className="btn btn-danger"
                      size="sm"
                      onClick={() => handleDeleteSlot(slot.SlotID)}
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

      {/* Modal for adding a new slot */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add New Slot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm="6">
              <Form.Group>
                <Form.Label>Slot Name</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control-sm"
                  value={newSlot.SlotName || ''}
                  onChange={(e) => setNewSlot({ ...newSlot, SlotName: e.target.value })}
                />
              </Form.Group>
            </Col>

            <Col sm="6">
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  className="form-control-sm"
                  value={newSlot.Stype || ''}
                  onChange={(e) => setNewSlot({ ...newSlot, Stype: e.target.value })}
                >
                  <option value="">Select type</option>
                  <option value="text">Text</option>
                  <option value="date">Date</option>
                  <option value="Float">Float</option>
                  <option value="yesno">Yes No</option>
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="special">Special</option>
                  
                </Form.Control>
              </Form.Group>
            </Col>

            <Col sm="6">
              <Form.Group>
                <Form.Label>Is Required</Form.Label>
                <Form.Check
                  type="checkbox"
                  className="form-control-sm"
                  checked={newSlot.IsRequired === 1}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, IsRequired: e.target.checked ? 1 : 0 })
                  }
                />
              </Form.Group>
            </Col>

            <Col sm="6">
              <Form.Group>
                <Form.Label>Form</Form.Label>
                <Select2
                  value={newSlot.FormID || 0}
                  options={forms.map((form) => ({ id: form.FormID, name: form.FName }))}
                  onSelect={(selected) =>
                    setNewSlot({ ...newSlot, FormID: selected.length ? selected[0].id : 0 })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Form.Group>
                <Form.Label>InputMessage</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className="form-control-sm"
                  value={newSlot.InputMessage || ''}
                  onChange={(e) => setNewSlot({ ...newSlot, InputMessage: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-sm btn-danger" size="sm" onClick={ModalClose}>
            Cancel
          </Button>
          <Button className="btn btn-sm thema-button" size="sm" onClick={handleAddSlot}>
            Add Slot
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SlotsPage;
