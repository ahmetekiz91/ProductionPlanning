import React, { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { ProductionOrder } from "../Models/ProductionOrder";
import {
  createProductionOrder,
  deleteProductionOrder,
  getProductionOrders,
  updateProductionOrder,
} from "../services/ProductionOrderService";


const initialdata: ProductionOrder = {
  Id: 0,
  ORDID: 0,
  CUSRID: 0,
  ItemId: 0,
  FicheID: 0,
  IsConfirmed: 0,
  MachineID: 0,
  Amount: 0.0,
  IsCompleted: 0,
  UUSRID: 0,
  UnitID: 0,
  Date: new Date().toISOString(),
  IName: "",
  UName: "",
};

const ProductionOrderComponent: React.FC = () => {
  const [CAID, setCAID] = useState<number>();
  const [CAFID, setCAFID] = useState<number>();
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [entities, setEntities] = useState<ProductionOrder[]>([]);
  const [selectedItems, setSelectedItems] = useState<ProductionOrder[]>([]);

  const fetchProductionOrders = async () => {
    try 
    {
      const response = await getProductionOrders(CAFID,0);
      setEntities(response.data);
    } catch (error) {
      console.error("Error fetching production orders:", error);
    }
  };

  useEffect(() => {
    fetchProductionOrders();
  }, []);





  const handleBulkInsert = async () => {
    try {
      for (const item of selectedItems) {
        if (item.Id) {
          //await updateProductionOrder(item.Id, item);
        } else {
          console.log(item)
          var res = await createProductionOrder(item);
          if (res) {
            alert("Bulk insert successful!");
          }
          else {
            alert("Error during the insert!");
          }

        }
      }
      setSelectedItems([]);
      fetchProductionOrders();

    } catch (error) {
      console.error("Error during bulk insert:", error);
    }
  };

  const handleDeleteProductionOrder = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this ProductionOrder?')) {
      await deleteProductionOrder(id);
      fetchProductionOrders();
    }
  };
  const handleUpdateProductionOrder = async (item: any) => {
    if (window.confirm('Are you sure you want to update this ProductionOrder?')) {
      var res = await updateProductionOrder(item.Id, item);
      if (res) {
        alert("Update operation is successful!");
      }
      else {
        alert("Error during the insert!");
      }
      fetchProductionOrders();
    }
  };

  return (
    <div className="container-fluid">
      <div className="card">
        {!showPanel ? (
          <>
            <div className="card-header">
              <h6>Production Order</h6>
              <Button
                variant="primary"
                size="sm"
                className="thema-button"
                onClick={() => setShowPanel(true)}
              >
                Add ProductionOrder
              </Button>
            </div>
            <div className="card-body">
             <div className="row">
                <div className="col-4">
                  <Form.Label>&nbsp;</Form.Label>
                  <Button className="btn btn-primary w-100" size="sm"  onClick={fetchProductionOrders}>
                    List
                  </Button>
                </div>


             </div>
              

              <div className="table-responsive">
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Current Account</th>
                      <th>Order</th>
                      <th>Item</th>
                      <th>Is Confirmed?</th>
                      <th>Machine</th>
                      <th>Amount</th>
                      <th>Unit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entities.map((it) => (
                      <tr key={it.Id}>
                        <td>{it.CAName}</td>
                        <td>{it.OCode}</td>
                        <td>{it.IName}</td>
                        <td>{it.IsConfirmed == 1 ? "Yes" : "No"}</td>
                        <td>

                          <select
                            className="form-control form-control-sm"
                            value={it.MachineID || ""}
                            onChange={(e) => {
                              const updatedItems = [...entities];
                              const index = updatedItems.findIndex(
                                (o) => o.Id === it.Id
                              );
                              if (index > -1) {
                                updatedItems[index].MachineID = parseInt(e.target.value);
                                setEntities(updatedItems);
                              }
                            }}
                          >
                            <option value="0">Choose</option>
                            <option value="1">Solid-Line 1</option>
                            <option value="2">Solid-Line 2</option>
                            <option value="3">Solid-Line 3</option>
                            <option value="4">Solid-Line 4</option>
                            <option value="5">Liquid-Line 1</option>
                            <option value="6">Liquid-Line 2</option>
                            <option value="7">Liquid-Line 3</option>
                            <option value="8">Wet-Wipe-Line 1</option>
                            <option value="9">Wet-Wipe-Line 2</option>
                            <option value="10">Wet-Wipe-Line 3</option>
                          </select>
                     


                        </td>
                        <td>
                          <input type="text" className="form-control form-control-sm" value={it.Amount || undefined}

                            onChange={(e) => {
                              const updatedItems = [...entities];
                              const index = updatedItems.findIndex(
                                (o) => o.Id === it.Id
                              );
                              if (index > -1) {
                                updatedItems[index].Amount = parseFloat(e.target.value);
                                setEntities(updatedItems);
                              }
                            }}

                          ></input>

                        </td>
                        <td>{it.UName}</td>
                        <td>
                          <Button variant="secondary" size="sm" onClick={() => handleUpdateProductionOrder(it)}>
                            Update
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteProductionOrder(it.Id!)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="card-header">
           
            </div>
            <div className="card-body">



              <div className="mt-4">
                <h6>Selected Items</h6>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Amount</th>
                      <th>Unit</th>
                      <th>Production Line</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItems.map((item) => (
                      <tr key={item.ItemId}>
                        <td>
                          {item.IName}
                        </td>
                        <td>
                          <input type="text" className="form-control form-control-sm" value={item.Amount || ""} onChange={(e) => {
                            const updatedItems = [...selectedItems]; const index = updatedItems.findIndex((s) => s.ItemId === item.ItemId);
                            if (index > -1) { updatedItems[index].Amount = parseFloat(e.target.value); setSelectedItems(updatedItems); }
                          }}
                          />
                        </td>
                        <td>
                          {item.UName}
                        </td>
                        <td>
                          <select
                            className="form-control form-control-sm"
                            value={item.MachineID || ""}
                            onChange={(e) => {
                              const updatedItems = [...selectedItems];
                              const index = updatedItems.findIndex((s) => s.ItemId === item.ItemId);
                              if (index > -1) {
                                updatedItems[index].MachineID = parseInt(e.target.value);
                                setSelectedItems(updatedItems);
                              }
                            }}
                          >
                            <option value="0">Choose</option>
                            <option value="1">Solid-Line 1</option>
                            <option value="2">Solid-Line 2</option>
                            <option value="3">Solid-Line 3</option>
                            <option value="4">Solid-Line 4</option>
                            <option value="5">Liquid-Line 1</option>
                            <option value="6">Liquid-Line 2</option>
                            <option value="7">Liquid-Line 3 </option>
                            <option value="8">Wet-Wipe-Line 1</option>
                            <option value="9">Wet-Wipe-Line 2</option>
                            <option value="10">Wet-Wipe-Line 3</option>
                          </select>
                         
                        </td>
                        <td>
                        
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
             
              </div>
            <div className="row">
              <div className="col-1">
              <div className="text-right mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleBulkInsert}
                    >
                      Save
                    </Button>
                    
                  </div>
              </div>
              <div className="col-10"></div>
              <div className="col-1"><Button variant="danger" size="sm" onClick={() => setShowPanel(false)}>
                Cancel
              </Button></div>
            </div>
            
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductionOrderComponent;
