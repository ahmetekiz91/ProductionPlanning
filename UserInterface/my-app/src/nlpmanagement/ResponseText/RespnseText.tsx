import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import ResponseTexts from './ResponseTexts'; // Importing the model class
import ChatbotApiHelper from '../../Helper/ChatbotApiHelper'
import Responses from '../Response/Responses';

const ResponseTextsPage: React.FC = () => 
{
  const api = new ChatbotApiHelper();
  const [responses, setResponses] = useState<Responses[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newResponseText, setNewResponseText] = useState<ResponseTexts>(new ResponseTexts(0, 0, '', ''));
  const [responseTexts, setResponseTexts] = useState<ResponseTexts[]>([]);
 
  useEffect(() => {
    fetchResponseTexts();
    fetchResponses();
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
  const fetchResponseTexts = async () => 
  {
     try {
      const data= await api.getwithheader('response_texts')
      setResponseTexts(data);
    } catch (error) {
      
    }
  };

  const handleAddResponseText = async () => {
    
    try {
      const resAccount: ResponseTexts | null = await api.post<ResponseTexts>(
        'response_texts',
        newResponseText
      );
      if (resAccount !== null) {
        fetchResponseTexts();
        setNewResponseText(new ResponseTexts(0, 0, '', '')); // Reset the form
        setShowModal(false); // Close the modal
      }
    } catch (error) {
      console.error('Error adding response text:', error);
    }

  };

  const handleDeleteResponseText = async (resId: number) => {
     if (window.confirm('Are you sure that you want to delete this information?')) 
    {
      try {
          const res = await api.delete(`response_texts/${resId}`);
          if (res) {
              // Use filter to create a new array without the deleted patterns
              const updatedarray = responseTexts.filter(item => item.ResID !== resId);
              
              // Update the state with the new patterns array
              setResponseTexts(updatedarray);
          }
      } catch (error) {
          console.error('Error deleting patterns:', error);
      }
  }
  };

  return (
    <div className="container container-fluid">
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-2">
              <Button className='thema-button' size="sm" onClick={() => setShowModal(true)}>
                Add Response Text
              </Button>
            </div>
            <div className="col-10">
              <h3 className="text-center">Response Texts</h3>
            </div>
          </div>
        </div>
        <div className="card-body mt-3">
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>ResID</th>
                <th>Response</th>
                <th>Text</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {responseTexts.map((responseText) => (
                <tr key={responseText.ResID}>
                  <td>{responseText.ResID}</td>
                  <td>{responseText.RName}</td>
                  <td>{responseText.ResponseText}</td>
                  <td>
                    <Button variant="danger" size="sm"  onClick={() => handleDeleteResponseText(responseText.ResID)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Modal for adding a new response text */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Response Text</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>

              <Col sm="6">
                <Form.Group>
                  <Form.Label>Response ID</Form.Label>
                  <Form.Control
                    as="select"
                    className="form-control-sm"
                    value={newResponseText.ResponseID}
                    onChange={(e) => setNewResponseText({ ...newResponseText, ResponseID: parseInt(e.target.value) })}
                  >
                    <option value="">Select Response</option>
                    {responses.map((response) => (
                      <option key={response.ResponseID} value={response.ResponseID}>
                        {response.Text}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col sm="12">
                <Form.Group>
                  <Form.Label>Text</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3} // You can adjust the number of rows to control the height of the textarea
                    className="form-control-sm"
                    value={newResponseText.ResponseText || ''}
                    onChange={(e) =>
                      setNewResponseText({ ...newResponseText, ResponseText: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className='btn btn-sm btn-secondary'  onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button  className='btn btn-sm thema-button' onClick={handleAddResponseText}>
            Add Response Text
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResponseTextsPage;
