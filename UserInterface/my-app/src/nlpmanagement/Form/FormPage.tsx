import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import Forms from './Form'; // Importing the Forms model class
import Config from '../../assets/Config';
import ChatbotApiHelper from '../../Helper/ChatbotApiHelper'
const FormPage: React.FC = () => {
  const api = new ChatbotApiHelper();
  const conf = new Config()
  const [Formss, setFormss] = useState<Forms[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newForms, setNewForms] = useState<Forms>(new Forms(0, ''));

  useEffect(() => {
    fetchFormss();
    //handleAddwholeForms();
  }, []);

  const fetchFormss = async () => {
   
    try {
      const data = await api.getwithheader('forms');
      setFormss(data);
    } catch (error) {
      console.error('Error fetching intents:', error);
    }
  };

  const handleAddForms = async () => {

    try {
      const resAccount: Forms | null = await api.post<Forms>(
        'forms',
        newForms
      );
      if (resAccount !== null) {
        fetchFormss();
        setNewForms(new Forms(0, '')); // Reset the form
        setShowModal(false); // Close the modal
      }

    } catch (error) {
      console.error('Error adding intent:', error);
    }
  };

  const handleDeleteForms = async (FormsId: number) => {

    if (window.confirm('Are you sure that you want to delete this information?')) {
      try {
          const res = await api.delete(`forms/${FormsId}`);
          if (res) {
              // Use filter to create a new array without the deleted intent
              const updatedIntents = Formss.filter(item => item.FormID !== FormsId);
              fetchFormss();
              // Update the state with the new intents array
              setFormss(updatedIntents);
          }
      } catch (error) {
          console.error('Error deleting intent:', error);
      }
  }
  };
  const handleAddwholeForms = async () => {
    var arr = await api.getwithheader('wholetablename');
    var arr2 = ['create_', 'update_', 'delete_', 'select_', 'edit_']
    for (var i = 0; i < arr.length; i++) {
      console.log(arr[i].TABLE_NAME.toLowerCase())
      for (let index = 0; index < arr2.length; index++) {
        var element = arr2[index];
        var insmodel = new Forms(0, ''+element + arr[i].TABLE_NAME.toLowerCase()+'_form')
        try {
          const resAccount: Forms | null = await api.post<Forms>('forms', insmodel);
          if (resAccount !== null) {
            console.log("inserted")
          }
        } catch (error) {

        }
      }
    }
  };
  return (
    <div className='container'>
      <div className='card'>
        <div className='card-header'>
          <div className='row'>
            <div className='col-2'>
              <Button className='thema-button btn btn-sm' onClick={() => setShowModal(true)}>Add Forms</Button>
            </div>
            <div className='col-10'>
              <h3 className='text-center'>Forms</h3>
            </div>
          </div>
        </div>
        <div className='card-body'>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Form Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Formss.map(Forms => (
                <tr key={Forms.FormID}>
                  <td>{Forms.FormID}</td>
                  <td>{Forms.FName}</td>
                  <td>
                    <Button  className='btn btn-sm btn-danger ' onClick={() => handleDeleteForms(Forms.FormID)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className='card-footer'></div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col sm="12">
                <Form.Group>
                  <Form.Label>Form Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={newForms.FName} 
                    onChange={(e) => setNewForms({ ...newForms, FName: e.target.value })} 
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button  className='btn btn-sm btn-secondary '  onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button  className='btn btn-sm thema-button '  onClick={handleAddForms}>
            Add Forms
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FormPage;
