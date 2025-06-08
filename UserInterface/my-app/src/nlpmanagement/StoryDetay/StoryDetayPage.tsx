import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import StoryDetay from './StoryDetay'; // Importing the StoryDetay model
import ChatbotApiHelper from '../../Helper/ChatbotApiHelper';
import Intent from '../Intent/Intent';
import Slots from '../Slots/Slots';
import Responses from '../Response/Responses';
import Forms from '../Form/Form';
import Story from '../Story/Story';
import Select2 from '../../components/Select2';
import DTable from '../../components/DTable'
const StoryDetayPage: React.FC = () => {
  const headers = [
    { prop: 'ID', title: 'ID', isFilterable: true },
    { prop: 'StoryName', title: 'Story', isFilterable: true },
    { prop: 'IName', title: 'Intents', isFilterable: true },
    { prop: 'RName', title: 'Responses', isFilterable: true },
    { prop: 'SName', title: 'Slots', isFilterable: true },
    { prop: 'FName', title: 'Form', isFilterable: true },
    { prop: 'VariableType', title: 'Variable Type', isFilterable: true },
    { prop: 'LineNumber', title: 'Line Number', isFilterable: true },
    {
      prop: "action", // Using "action" for button column
      title: "Actions",
      cell: (row: any) => (
        <div>
          {/* <Button variant='secondary' size='sm' onClick={() => handleShowModal(row)}>Edit</Button> */}
          <Button variant='danger' size='sm' onClick={() => handleDeleteStoryDetay(row.ID!)}>Delete</Button>
        </div>
      )
    }
  ];
  const [stories, setStories] = useState<Story[]>([]);
  const api = new ChatbotApiHelper();
  const [filter, setFilter] = useState<any>();
  const [StoryID, setStoryID] = useState<any>();
  const [forms, setForms] = useState<Forms[]>([]);
  const [slots, setSlots] = useState<Slots[]>([]);
  const [responses, setResponses] = useState<Responses[]>([]);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [storyDetays, setStoryDetays] = useState<StoryDetay[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  
  const [newStoryDetay, setNewStoryDetay] = useState<StoryDetay>(new StoryDetay(0,0,'',0,'',0,'',0,'',0,'','',0));

  const fetchStories = async () => {
    try {
      const data = await api.getwithheader('stories');
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  useEffect(() => {

    fetchStories();
    fetchIntents();
    fetchForms();
    fetchResponses();
    fetchSlots();
  }, []);  // Add StoryID and filter as dependencies for dynamic data fetching
  useEffect(() => {
    fetchStoryDetays();

  }, [StoryID, filter]);

  const fetchForms = async () => {
    try {
      const data = await api.getwithheader('forms');
      setForms(data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const fetchResponses = async () => {
    try {
      const data = await api.getwithheader('responses');
      setResponses(data);
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  const fetchIntents = async () => {
    try {
      const data = await api.getwithheader('intents');
      setIntents(data);
    } catch (error) {
      console.error('Error fetching intents:', error);
    }
  };

  const fetchStoryDetays = async () => {
    try {
      // Fetching with the optional `storyid` and `where` filters from API
      const data = await api.getwithparams('storydetails', StoryID || null,  filter || null );
      setStoryDetays(data);
    } catch (error) {
      console.error('Error fetching story details:', error);
    }
  };

  const fetchSlots = async () => {
    try {
      const data = await api.getwithheader('slots');
      console.log(data)
      setSlots(data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleModal= async () =>{
    setNewStoryDetay(new StoryDetay(0, 0, '', 0, '', 0, '', 0, '', 0, '', '', 0)); // Reset the form
    setShowModal(false); // Close the modal
  }

  const handleAddStoryDetay = async () => {
    if (newStoryDetay.StoryID == null || newStoryDetay.StoryID === 0) {
      window.alert("Please select conversation story");
      return;
    }

    try {
      const resAccount: StoryDetay | null = await api.post<StoryDetay>('storydetails', newStoryDetay);
      fetchStoryDetays();
      console.log(newStoryDetay)
      if (resAccount !== null) {
        alert("added")

      }
    } catch (error) {
      console.error('Error adding story detay:', error);
    }
  };

  const handleDeleteStoryDetay = async (id: number) => {
    if (window.confirm('Are you sure that you want to delete this information?')) {
      try {
        const res = await api.delete(`storydetails/${id}`);
        if (res) {
          const updatedarray = storyDetays.filter(item => item.ID !== id);
          setStoryDetays(updatedarray);
        }
      } catch (error) {
        console.error('Error deleting patterns:', error);
      }
    }
  };

  return (
    <div className="container container-fluid">
      <h3 className="text-center">Story Detay</h3>
      <div className="card">
        <div className="card-header">
          <div className="row">
            <div className="col-2">
              <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                Add StoryDetay
              </Button>
            </div>
            <div className='col-4'>
              <Select2 
              size="sm"
                value={StoryID|| null}
                options={stories.map((story) => ({ id: story.StoryID, name: story.StoryName }))}
                onSelect={(selected: any) => setStoryID(selected.length ? selected[0].id :undefined)} 
              />
            </div>
            <div className='col-4'>
              <Form.Control
                type="text"
                size='sm'
                value={filter || null}
                onChange={(e) => setFilter(e.target.value) }
                placeholder='Intent, Response or Slot'
              />
            </div>


          </div>
        </div>
        <div className="card-body mt-3">

        <DTable
                data={storyDetays}
                headers={headers}
                onDelete={handleDeleteStoryDetay}
              
              />

          {/* <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Story</th>
                <th>Intent</th>
                <th>Response</th>
                <th>Slot</th>
                <th>Form</th>
                <th>Variable Type</th>
                <th>Line Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {storyDetays.map((storyDetay) => (
                <tr key={storyDetay.ID}>
                  <td>{storyDetay.ID}</td>
                  <td>{storyDetay.StoryName}</td>
                  <td>{storyDetay.IName || '-'}</td>
                  <td>{storyDetay.RName || '-'}</td>
                  <td>{storyDetay.SName || '-'}</td>
                  <td>{storyDetay.FName || '-'}</td>
                  <td>{storyDetay.VariableType || '-'}</td>
                  <td>{storyDetay.LineNumber}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteStoryDetay(storyDetay.ID!)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table> */}
        </div>
      </div>

      {/* Modal for adding a new Story Detay */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Add New Story Detay</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <Col className="col-6">
              <Form.Group>
                <Form.Label>Story</Form.Label>
                <Select2
                  value={newStoryDetay.StoryID}
                  options={stories.map((story) => ({ id: story.StoryID, name: story.StoryName }))}
                  onSelect={(selected: any) => setNewStoryDetay({ ...newStoryDetay, StoryID: selected.length ? selected[0].id : null })}
                />
              </Form.Group>
            </Col>
            <Col className="col-6">
              <Form.Group>
                <Form.Label>Intent</Form.Label>
                <Select2
                  value={newStoryDetay.IntentID || 0}
                  options={intents.map((item) => ({ id: item.ID, name: item.IntentName }))}
                  onSelect={(selected?: any) => setNewStoryDetay({ ...newStoryDetay, IntentID: selected.length ? selected[0].id :null})}
                />

                 
              </Form.Group>
            </Col>
          </div>

          <div className="row mt-3">
            <Col className="col-6">
              <Form.Group>
                <Form.Label>Response</Form.Label>
                <Select2
                  value={newStoryDetay.ResponseID || undefined}
                  options={responses.map((item) => ({ id: item.ResponseID, name: item.Text }))}
                  onSelect={(selected: any) => setNewStoryDetay({ ...newStoryDetay, ResponseID: selected.length ? selected[0].id : null })}
                />
              </Form.Group>
            </Col>
            <Col className="col-6">
              <Form.Group>
                <Form.Label>Slot</Form.Label>
                <Select2
                  value={newStoryDetay.SlotID || undefined}
                  options={slots.map((item) => ({ id: item.SlotID, name: item.FName +'_'+item.SlotName}))}
                  onSelect={(selected: any) => setNewStoryDetay({ ...newStoryDetay, SlotID: selected.length ? selected[0].id : null })}
                />
              </Form.Group>
            </Col>
          </div>

          <div className="row mt-3">
            <Col className="col-6">
              <Form.Group>
                <Form.Label>Form</Form.Label>
                <Select2
                  value={newStoryDetay.FormID || undefined}
                  options={forms.map((item) => ({ id: item.FormID, name: item.FName }))}
                  onSelect={(selected: any) => setNewStoryDetay({ ...newStoryDetay, FormID: selected.length ? selected[0].id : 0 })}
                />
              </Form.Group>
            </Col>
            <Col className="col-6">
              <Form.Group>
                <Form.Label>Variable Type</Form.Label>
                <Form.Control
                  value={newStoryDetay.VariableType}
                  onChange={(e) => setNewStoryDetay({ ...newStoryDetay, VariableType: e.target.value })}
                />
              </Form.Group>
            </Col>
          </div>

          <div className="row mt-3">
            <Col className="col-6">
              <Form.Group>
                <Form.Label>Line Number</Form.Label>
                <Form.Control
                  type="number"
                  value={newStoryDetay.LineNumber || 0}
                  onChange={(e) => setNewStoryDetay({ ...newStoryDetay, LineNumber: Number(e.target.value) })}
                />
              </Form.Group>
            </Col>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddStoryDetay}>
            Save Story Detay
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StoryDetayPage;
