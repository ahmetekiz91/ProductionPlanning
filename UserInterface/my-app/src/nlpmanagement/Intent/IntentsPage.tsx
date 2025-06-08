// IntentsPage.tsx
import "bootstrap/dist/css/bootstrap.css";
import { Button, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import ChatbotApiHelper from "../../Helper/ChatbotApiHelper";
import IntentsTable from "./IntentsTable";
import Intent from './Intent'; // Importing the Intent model class
import React from "react";

const IntentsPage: React.FC = () => {

  const api = new ChatbotApiHelper();
  const [intents, setIntents] = useState<Array<{ ID: number; IntentName: string }>>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newIntent, setNewIntent] = useState<Intent>(new Intent(0, ''));

  // Fetching intents from the API
  const fetchIntents = async () => {
    try {
      const data = await api.getwithheader('intents'); // Ensure this fetches the correct data
      setIntents(data); // Set the fetched data into the intents state
    } catch (error) {
      console.error('Error fetching intents:', error);
    }
  };

  useEffect(() => {
    fetchIntents();
  }, []);

  // Handle deleting an intent
  const handleDeleteIntent = async (intentId: number) => {
    if (window.confirm('Are you sure that you want to delete this information?')) {
      try {
        const res = await api.delete(`intents/${intentId}`);
        if (res) {
          // Filter out the deleted intent from the state
          setIntents(intents.filter(item => item.ID !== intentId));
        }
      } catch (error) {
        console.error('Error deleting intent:', error);
      }
    }
  };
  const handleAddIntent = async () => {
    try {
      const resAccount: Intent | null = await api.post<Intent>('intents', newIntent);
      if (resAccount !== null) {
        fetchIntents();
        setNewIntent(new Intent(0, ''));
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error adding intent:', error);
    }
  };
  
  const handleAddwholeIntent = async () => {
    var arr = await api.getwithheader('wholetablename');
    var arr2 = ['create_', 'update_', 'delete_', 'select_', 'edit_']
    for (var i = 0; i < arr.length; i++) {
      console.log(arr[i].TABLE_NAME.toLowerCase())
      for (let index = 0; index < arr2.length; index++) {
        var element = arr2[index];
        var insmodel = new Intent(0, element + arr[i].TABLE_NAME.toLowerCase())
        const resAccount: Intent | null = await api.post<Intent>('intents', insmodel);
        try {
          const resAccount: Intent | null = await api.post<Intent>('intents', newIntent);
          if (resAccount !== null) {
            console.log("eklendi")
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
          <Button onClick={() => setShowModal(true)} size='sm'>Add Intent</Button>
          <h3 className='text-center'>Intents</h3>
        </div>
        <div className='card-body'>
          <IntentsTable intents={intents} onDeleteIntent={handleDeleteIntent} />
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Intent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Intent Name</Form.Label>
              <Form.Control
                type="text"
                value={newIntent.IntentName}
                onChange={(e) => setNewIntent({ ...newIntent, IntentName: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size='sm' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" size='sm' onClick={handleAddIntent}>
            Add Intent
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default IntentsPage;
