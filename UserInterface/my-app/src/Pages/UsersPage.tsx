import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Users } from '../Models/Users';
import { getUsers, createUsers, updateUsers, deleteUsers } from '../services/UsersService';
import { useLocation } from 'react-router-dom';

const initialData: Users = {
  Id: 0,
  CDate: new Date(2020, 11, 12).toISOString(),
  CUSRID: 0,
  Name: '',
  Surname: '',
  Phone: '',
  Username: '',
  Email: '',
  Password: '',
};

const UsersComponent: React.FC = () => {
  const location = useLocation();
  const [entities, setEntities] = useState<Users[]>([]);
  const [formData, setFormData] = useState<Users>(initialData);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUsersId, setCurrentUsersId] = useState<number | null>(null);
  const [showList, setShowList] = useState(true); // Liste panelini gösterme durumu

  useEffect(() => {
    fetchUsers();
 
    if (location.state) {
        debugger

      handleChatbotIntents(location.state.intent, location.state.user)
      window.history.replaceState({}, document.title); // Replace the current state with an empty one
    }
    
  }, [location.state]);

  const handleChatbotIntents = async (intent: string, propdata : Users | null) => {
    // intent null değilse devam et
    if (intent) {
      const intentString = intent.toString().toLowerCase();  // intent'i küçük harfe çevirip karşılaştırmak daha güvenli
  
      if (intentString.includes("create")) {
       
        if (propdata) {
          setFormData(propdata); 
        }
        setShowList(false); 
      }
      else if (intentString.includes("update")||intentString.includes("edit")) {
      
        if (propdata) {
          handleShowForm(propdata); 
          setCurrentUsersId(propdata.Id);
        }
      }
      else if (intentString.includes("select")) {
        // 'select' intent'i varsa kullanıcıları getir
        fetchUsers();
      }
      else if (intentString.includes("delete")) {
       
        if (propdata && propdata.Id) {
          handleDeleteUser(propdata.Id); // propdata'dan ID'yi alıp silme işlemi yap
        }
      }
    }
  };
  const fetchUsers = async () => {
    const response = await getUsers();
    setEntities(response.data);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowForm = (user?: Users) => {
    if (user) {
      if (window.confirm('Are you sure you want to edit this user?')) {
        setFormData(user);
        setIsEdit(true);
        setCurrentUsersId(user.Id!);
      }
    } else {
      setFormData(initialData);
      setIsEdit(false);
      setCurrentUsersId(null);
    }
    setShowList(false); // Listeyi kapat ve formu göster
  };

  const handleSubmit = async () => {
    if (isEdit && currentUsersId !== null) {
  
      await updateUsers(currentUsersId, formData);
    } else {
      await createUsers(formData);
    }
    fetchUsers();
    setShowList(true); // Formu kapat ve listeyi göster
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUsers(id);
      fetchUsers();
    }
  };

  return (
    <div className='container-fluid'>
      {showList ? (
        <div className='card'>
          <div className='card-header'>
            <h6>Users</h6>
            <Button className='thema-button' size='sm' onClick={() => handleShowForm()}>Add User</Button>
          </div>
          <div className='card-body'>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Phone</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {entities.map(item => (
                  <tr key={item.Id}>
                    <td>{item.Id}</td>
                    <td>{item.Name}</td>
                    <td>{item.Surname}</td>
                    <td>{item.Phone}</td>
                    <td>{item.Username}</td>
                    <td>{item.Email}</td>
                    <td>{item.Password}</td>
                    <td>
                      <Button variant='secondary' size='sm' onClick={() => handleShowForm(item)}>Edit</Button>
                      <Button variant='danger' size='sm' onClick={() => handleDeleteUser(item.Id!)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className='card'>
          <div className='card-header'>
            <h6>{isEdit ? 'Edit User' : 'Add User'}</h6>
          </div>
          <div className='card-body'>

  <Row>
    <Col sm={6}>
      <Form.Group controlId='formName'>
        <Form.Label>Name</Form.Label>
        <Form.Control type='text' name='Name' size='sm' value={formData.Name} onChange={handleChange} />
      </Form.Group>
    </Col>
    <Col sm={6}>
      <Form.Group controlId='formSurname'>
        <Form.Label>Surname</Form.Label>
        <Form.Control type='text' name='Surname' size='sm' value={formData.Surname} onChange={handleChange} />
      </Form.Group>
    </Col>
  </Row>
  <Row>
    <Col sm={6}>
      <Form.Group controlId='formPhone'>
        <Form.Label>Phone</Form.Label>
        <Form.Control type='text' name='Phone' size='sm' value={formData.Phone} onChange={handleChange} />
      </Form.Group>
    </Col>
    <Col sm={6}>
      <Form.Group controlId='formUsername'>
        <Form.Label>Username</Form.Label>
        <Form.Control type='text' name='Username' size='sm' value={formData.Username} onChange={handleChange} />
      </Form.Group>
    </Col>
  </Row>
  <Row>
    <Col sm={6}>
      <Form.Group controlId='formEmail'>
        <Form.Label>Email</Form.Label>
        <Form.Control type='text' name='Email' size='sm' value={formData.Email} onChange={handleChange} />
      </Form.Group>
    </Col>
    <Col sm={6}>
      <Form.Group controlId='formPassword'>
        <Form.Label>Password</Form.Label>
        <Form.Control type='text' name='Password' size='sm' value={formData.Password} onChange={handleChange} />
      </Form.Group>
    </Col>
  </Row>
          </div>
          <div className='card-footer'>
            <Button className='thema-button' size='sm' onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'}</Button>
            <Button variant='secondary' size='sm' onClick={() => setShowList(true)}>Back to List</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersComponent;
