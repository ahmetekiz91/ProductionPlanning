import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import Responses from './Responses'; // Importing the model class
import ChatbotApiHelper from '../../Helper/ChatbotApiHelper'
const ResponsesPage: React.FC = () => {
  const api = new ChatbotApiHelper();
  const [responses, setResponses] = useState<Responses[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newResponse, setNewResponse] = useState<Responses>(new Responses(0, ''));

  useEffect(() => {
    fetchResponses();
    //handleAddwholeResponses();
  }, []);

  const fetchResponses = async () => {

    try {
      const data = await api.getwithheader('responses');
      console.log("response:"+data)
      setResponses(data);
    } catch (error) {
      console.error('Error fetching responses:', error);
    }

  };

  const handleAddResponse = async () => {
    try {
      const resAccount: Responses | null = await api.post<Responses>(
        'responses',
        newResponse
      );
      if (resAccount !== null) {
        fetchResponses();
        setNewResponse(new Responses(0,'')); 
        setShowModal(false); // Close the modal
      }

    } catch (error) {
      console.error('Error adding responses:', error);
    }

  };

  const handleDeleteResponse = async (responseId: number) => {

    if (window.confirm('Are you sure that you want to delete this information?')) {
      try {
          const res = await api.delete(`responses/${responseId}`);
          if (res) {
              // Use filter to create a new array without the deleted patterns
              const updatedarray = responses.filter(item => item.ResponseID !== responseId);
              
              // Update the state with the new patterns array
              setResponses(updatedarray);
          }
      } catch (error) {
          console.error('Error deleting patterns:', error);
      }
  }


  };
  const handleAddwholeResponses = async () => {
    var arr = await api.getwithheader('wholetablename');
    var arr2 = ['create_', 'update_', 'delete_', 'select_', 'edit_']
    for (var i = 0; i < arr.length; i++) {
      console.log(arr[i].TABLE_NAME.toLowerCase())
      for (let index = 0; index < arr2.length; index++) {
        var element = arr2[index];
        var insmodel = new Responses(0, 'utter_'+element + arr[i].TABLE_NAME.toLowerCase()+'')
        try {
          const resAccount: Responses | null = await api.post<Responses>('responses', insmodel);
          if (resAccount !== null) {
            console.log("inserted")
          }
        } catch (error) {

        }
      }


    }
  };
  return (
    <div className="container container-fluid">
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-2">
              <Button className='btn thema-button' size="sm" onClick={() => setShowModal(true)}>
                Add Response
              </Button>
            </div>
            <div className="col-10">
              <h3 className="text-center">Responses</h3>
            </div>
          </div>
        </div>
        <div className="card-body mt-3">
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Response ID</th>
                <th>Text</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <tr key={response.ResponseID}>
                  <td>{response.ResponseID}</td>
                  <td>{response.Text}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteResponse(response.ResponseID)}
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


      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Response</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col sm="12">
                <Form.Group>
                  <Form.Label>Text</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-sm"
                    value={newResponse.Text || ''}
                    onChange={(e) => setNewResponse({ ...newResponse, Text: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className=' btn btn-sm btn-secondary' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button  className='btn btn-sm btn-success' onClick={handleAddResponse}>
            Add Response
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResponsesPage;
