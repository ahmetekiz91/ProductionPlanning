import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { getProductionLines, createProductionLine, updateProductionLine, deleteProductionLine } from '../services/ProductionLineService';
import { ProductionLine } from '../Models/ProductionLine';

const initialData: ProductionLine = {
  Id: 0,
  CUSRID: 0,
  IsActive: 1,
  UUSRID: 0,
  Code: '',
  Name: '',
  Notes: '',
};

const ProductionLineComponent: React.FC = () => {
  const [ProductionLines, setProductionLines] = useState<typeof initialData[]>([]);
  const [formData, setFormData] = useState(initialData);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProductionLineId, setCurrentProductionLineId] = useState<number | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    fetchProductionLines();
  }, []);

  const fetchProductionLines = async () => {
    const response = await getProductionLines();
    setProductionLines(response.data);
  };

  const handleAddProductionLine = () => {
    setFormData(initialData);
    setIsEdit(false);
    setShowPanel(true);
  };

  const handleEditProductionLine = (ProductionLine: typeof initialData) => {
    setFormData(ProductionLine);
    setIsEdit(true);
    setCurrentProductionLineId(ProductionLine.Id);
    setShowPanel(true);
  };

  const handleDeleteProductionLine = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this Production line?')) {
      await deleteProductionLine(id);
      fetchProductionLines();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    });
  };

  const handleSave = async () => {
    if (isEdit && currentProductionLineId !== null) {
      await updateProductionLine(currentProductionLineId, formData);
    } else {
      await createProductionLine(formData);
    }
    fetchProductionLines();
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
            <h6>Productionline Management</h6>
            <Button className="thema-button btn btn-sm" onClick={handleAddProductionLine}>
              Add Productionline
            </Button>
          </div>
          <div className="card-body">
            <Table bordered striped>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Code</th>
                  <th>Name</th>               
                  <th>Notes</th>
                  <th>Is Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ProductionLines.map((ProductionLine) => (
                  <tr key={ProductionLine.Id}>
                    <td>{ProductionLine.Id}</td>
                    <td>{ProductionLine.Code}</td>
                    <td>{ProductionLine.Name}</td>
                    <td>{ProductionLine.Notes}</td>
                    <td>{ProductionLine.IsActive ? 'Yes' : 'No'}</td>
                    <td>
                      <Button variant="secondary" className="btn btn-sm" onClick={() => handleEditProductionLine(ProductionLine)}>
                        Edit
                      </Button>
                      <Button variant="danger" className="btn btn-sm"  onClick={() => handleDeleteProductionLine(ProductionLine.Id)}>
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
            <h6>{isEdit ? 'Edit ProductionLine' : 'Add ProductionLine'}</h6>
          </div>
          <div className="card-body">
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" size="sm" name="Name" value={formData.Name} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Code</Form.Label>
                <Form.Control type="text" size="sm" name="Code" value={formData.Code} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control type="text" size="sm" name="Notes" value={formData.Notes} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Is Active</Form.Label>
                <Form.Check  type="checkbox"  name="IsActive"  checked={!!formData.IsActive}  onChange={handleChange}  label="Active"  />
              </Form.Group>
              <div className="d-flex justify-content-between mt-4">
                <Button className="thema-button" size="sm" onClick={handleSave}>
                  {isEdit ? 'Update' : 'Create'}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleCancel}>
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

export default ProductionLineComponent;
