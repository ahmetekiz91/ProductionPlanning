import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import Story from './Story'; // Importing the Story model
import ChatbotApiHelper from '../../Helper/ChatbotApiHelper'

const StoriesPage: React.FC = () => {
  const api = new ChatbotApiHelper();
  const [stories, setStories] = useState<Story[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newStory, setNewStory] = useState<Story>(
    new Story(0, '')
  );

  useEffect(() => {
    fetchStories();
    //handleAddwholeResponses();
  }, []);

  const fetchStories = async () => {
    try {

      const data = await api.getwithheader('stories');
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleAddStory = async () => 
  {
    try {
      const resAccount: Story | null = await api.post<Story>(
        'stories',
        newStory
      );
      if (resAccount !== null) {
        fetchStories();
        setNewStory(new Story(0, '')); // Reset the form
        setShowModal(false); // Close the modal
      }

    } catch (error) {
      console.error('Error adding story:', error);
    }
  };

  const handleDeleteStory = async (storyId: number) =>
  {
     if (window.confirm('Are you sure that you want to delete this information?')) {
      try {
          const res = await api.delete(`stories/${storyId}`);
          if (res) {
              // Use filter to create a new array without the deleted intent
              const updated = stories.filter(item => item.StoryID !== storyId);
              fetchStories();
              // Update the state with the new intents array
              setStories(updated);
          }
      } catch (error) {
          console.error('Error deleting story:', error);
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
        var insmodel = new Story(0, 'story_'+element + arr[i].TABLE_NAME.toLowerCase()+'')
        try {
          const resAccount: Story | null = await api.post<Story>('stories', insmodel);
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
              <Button variant="primary" className='btn thema-button' size="sm" onClick={() => setShowModal(true)}>
                Add Story
              </Button>
            </div>
            <div className="col-10">
              <h3 className="text-center">Stories</h3>
            </div>
          </div>
        </div>
        <div className="card-body mt-3">
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>StoryID</th>
                <th>StoryName</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((story) => (
                <tr key={story.StoryID}>
                  <td>{story.StoryID}</td>
                  <td>{story.StoryName}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteStory(story.StoryID)}
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

      {/* Modal for adding a new story */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Story</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col sm="6">
                <Form.Group>
                  <Form.Label>StoryID</Form.Label>
                  <Form.Control
                    type="number"
                    className="form-control-sm"
                    value={newStory.StoryID}
                    onChange={(e) =>
                      setNewStory({ ...newStory, StoryID: parseInt(e.target.value) })
                    }
                  />
                </Form.Group>
              </Col>
              <Col sm="6">
                <Form.Group>
                  <Form.Label>StoryName</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-sm"
                    value={newStory.StoryName || ''}
                    onChange={(e) =>
                      setNewStory({ ...newStory, StoryName: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size='sm' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button   className='btn btn-sm thema-button' onClick={handleAddStory}>
            Add Story
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StoriesPage;
