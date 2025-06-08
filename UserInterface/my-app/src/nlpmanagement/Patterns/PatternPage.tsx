import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import Pattern from './Pattern'; // Importing the model class
import ChatbotApiHelper from '../../Helper/ChatbotApiHelper'
import Intent from '../Intent/Intent';
const PatternPage: React.FC = () => {
  const api = new ChatbotApiHelper();
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newPattern, setNewPattern] = useState<Pattern>(new Pattern(0, 0, '',''));
  const [intents, setIntents] = useState<Intent[]>([]);
  
  useEffect(() => {
    fetchPatterns();
    fetchIntents();
  }, []);

  const fetchIntents = async() => {
    try {
      const data= await api.getwithheader('intents')
      setIntents(data)
    } catch (error) {
      
    }
  }

  const fetchPatterns = async () => {
 
    try {
      const data = await api.getwithheader('patterns');
      console.log("patterns:"+data)
      setPatterns(data);
    } catch (error) {
      console.error('Error fetching patterns:', error);
    }

  };

  const handleAddPattern = async () => {
     try {
      const resAccount: Pattern | null = await api.post<Pattern>(
        'patterns',
        newPattern
      );
      if (resAccount !== null) {
        fetchPatterns();
        setNewPattern(new Pattern(0,0, '','')); // Reset the form
        setShowModal(false); // Close the modal
      }
    } catch (error) {
      console.error('Error adding patterns:', error);
    }
  };

  const handleDeletePattern = async (patternId: number) => {


    if (window.confirm('Are you sure that you want to delete this information?')) {
      try {
          const res = await api.delete(`patterns/${patternId}`);
          if (res) {
              // Use filter to create a new array without the deleted patterns
              const updatedarray = patterns.filter(item => item.ID !== patternId);
              
              // Update the state with the new patterns array
              setPatterns(updatedarray);
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
              <Button  className='btn btn-sm thema-button ' style={{color:"white"}} size="sm" onClick={() => setShowModal(true)}>
                Add Pattern
              </Button>
            </div>
            <div className="col-10">
              <h3 className="text-center">Patterns</h3>
            </div>
          </div>
        </div>
        <div className="card-body mt-3">
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Intent</th>
                <th>Text</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patterns.map((pattern) => (
                <tr key={pattern.ID}>
                  <td>{pattern.ID}</td>
                  <td>{pattern.IName}</td>
                  <td>{pattern.Text}</td>
                  <td>
                    <Button variant="danger"  size="sm" onClick={() => handleDeletePattern(pattern.ID)} >
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
          <Modal.Title>Add New Pattern</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
         
              <Col sm="6">
                <Form.Group>
                  <Form.Label>Intent</Form.Label>
                  <Form.Control
                    as="select"
                    className="form-control-sm"
                    value={newPattern.IntentID}
                    onChange={(e) => setNewPattern({ ...newPattern, IntentID: parseInt(e.target.value) })}
                  >
                    <option value="">Select Intent</option>
                    {intents.map((intent) => (
                      <option key={intent.ID} value={intent.ID}>
                        {intent.IntentName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col sm="6" style={{display:'none'}}>
                <Form.Group>
                  <Form.Label>Intent ID</Form.Label>
                  <Form.Control
                    type="number"
                    className="form-control-sm"
                    value={newPattern.IntentID}
                    onChange={(e) =>
                      setNewPattern({ ...newPattern, IntentID: parseInt(e.target.value) })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <Form.Group>
                  <Form.Label>Text</Form.Label>
                  <Form.Control
                     as="textarea"
                     rows={3} // You can adjust the number of rows to control the height of the textarea
                     className="form-control-sm"
                     value={newPattern.Text}
                    onChange={(e) => setNewPattern({ ...newPattern, Text: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button  className='btn btn-sm btn-secondary' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button  className='btn btn-sm btn-primary' onClick={handleAddPattern}>
            Add Pattern
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PatternPage;
