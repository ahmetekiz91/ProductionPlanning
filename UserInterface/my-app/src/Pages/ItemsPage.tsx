
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Items } from '../Models/Items';
import { getItems, createItems, updateItems, deleteItems } from '../services/ItemsService';
import DTable from '../components/DTable'

import { useLocation } from 'react-router-dom';


const initialdata: Items = {
  Id: 0,
  CDate: new Date(2020, 11, 12).toISOString(),
  CompanyItemCode: '',
  Name_: '',
  EAN: '',
  UnitPerBox: 0.0,
  StoreID: 0,
  Weight: 0.0,
  WidthLengthHeight: '',
  IGID: 0,
  UnitID: 0,
  CUsrId: 0,
  FPath: '',
  UnitCost: 0.0,
  Width: 0.0,
  Length: 0.0,
  Height: 0.0,
  ItemOfferGroup: 0,
  Isparent: false,
  IsTemplate: false,
  PCSAmount: 0.0,
  ISOk: 0,
  NameENG: '',
  NamePARENT: '',
  NamePARENTENG: '',
  FPathParent: '',
  BrandID: 0,
  GTIP: '',
  Variant: '',
  CurrencyID: 0,
  SalesPrice: 0.0,
  CoefficientofUnitPrice: 0.0,
  IsActive: false,
  UUsrId: 0,
};

const ItemComponent: React.FC = () => {
  const handleChatbotIntents = async (intent: string, propdata : Items | null) => {
    if (intent) {
      const intentString = intent.toString().toLowerCase();  
 
      if (intentString.includes("create"))
      {
    
        if (propdata) {
          console.log(propdata)
          setFormData(propdata); 
        }
        setShowPanel(true)
      }
      else if (intentString.includes("update")||intentString.includes("edit"))
      {
        if (propdata)
        {
      
          setFormData(propdata);
          setIsEdit(true);
          setCurrentItemId(propdata.Id);
          setShowPanel(true);
        }
      }
      else if (intentString.includes("select"))
      {
          fetchItems();
      }
      else if (intentString.includes("delete")) 
      {
        if (propdata && propdata.Id) {
          handleDeleteItem(propdata.Id); // propdata'dan ID'yi alıp silme işlemi yap
        }
      }
    }
  };




  const [loading, setLoading] = useState<boolean>(true);
    const headers = [
    { prop: 'CompanyItemCode', title: 'Company Item Code', isFilterable: true },
    { prop: 'Name_', title: 'Item Name', isFilterable: true },
    { prop: 'EAN', title: 'EAN', isFilterable: true },
    { prop: 'UnitPerBox', title: 'Unit Per Box', isFilterable: true },
    { prop: 'StoreID', title: 'StoreID', isFilterable: true },
    { prop: 'Weight', title: 'Weight', isFilterable: true },
    { prop: 'WidthLengthHeight', title: 'WidthLengthHeight', isFilterable: true },
    { prop: 'GTIP', title: 'GTIP', isFilterable: true },
    {
      prop: "action", // Using "action" for button column
      title: "Actions",
      cell: (row: any) => (
        <div>
          <Button variant='secondary' size='sm' onClick={() => handleEditItem(row)}>Edit</Button>
          <Button variant='danger' size='sm' onClick={() => handleDeleteItem(row.Id!)}>Delete</Button>
        </div>
       
      )
    }
  ];
  const location = useLocation();
  const [items, setItems] = useState<Items[]>([]);
  const [formData, setFormData] = useState<Items>(initialdata);
  const [isEdit, setIsEdit] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [entities, setEntities] = useState<Items[]>([]);

  useEffect(() => {
    fetchItems();
    if (location.state) {
      handleChatbotIntents(location.state.intent, location.state.item);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchItems();
  }, []);

  
  const fetchItems = async () => {
    try
    {
      const response = await getItems();
      setEntities(response.data);
      setLoading(false)
    } 
    catch (error) {
    }
  };

  const handleAddItem = () => {
    setFormData(initialdata);
    setIsEdit(false);
    setShowPanel(true);
  };

  const handleEditItem = (item: Items) => {
    setFormData(item);
    setIsEdit(true);
    setCurrentItemId(item.Id);
    setShowPanel(true);
  };

  const StoreIDChange = (selected: any,) => {
    if (selected !== null && selected !== undefined) {
      const selectedValue = selected.toString(); 
      setFormData({ ...formData, StoreID: parseInt( selectedValue)||0 });
     }
  };
  const UnitIDChange = (selected: any,) => 
  {
    
 
    if (selected !== null && selected !== undefined)
    {
      if(selected.length>0)
        {
        const selectedValue = selected[0].Id; 
        setFormData({ ...formData, UnitID: parseInt( selectedValue)||0 });
        }

     }
  };
  const IGIDChange = (selected: any,) => 
  {
    if (selected !== null && selected !== undefined) {
      const selectedValue = selected.toString(); 
      setFormData({ ...formData, IGID: parseInt( selectedValue)||0 });
     }
  };
  const CurrencyIDChange = (selected: any,) => {
    
    if (selected !== null && selected !== undefined) {
      const selectedValue = selected.toString(); 
      setFormData({ ...formData, CurrencyID: parseInt( selectedValue)||0 });
     }

  };

  const BrandIDChange = (selected: any) => {
  
    if (selected !== null && selected !== undefined) {
     const selectedValue = selected.toString(); 
     setFormData({ ...formData, BrandID: parseInt( selectedValue)||0 });
    }
   };


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleDeleteItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItems(id);
      fetchItems();
    }
  };

  const handleSave = async () => {
    if (isEdit && currentItemId !== null) {
      await updateItems(currentItemId, formData);
    } else {
      await createItems(formData);
      console.log(JSON.stringify(formData))
    }
    fetchItems();
    setShowPanel(false);
  };

  const handleCancel = () => {
    setShowPanel(false);
    setFormData(initialdata);
  };

  return (
    <div className="container-fluid">
      {!showPanel && (
        <div className="card">
          <div className="card-header">
            <h6>Items</h6>
            <Button variant="primary" className="btn btn-sm thema-button fl" onClick={handleAddItem}>
              Add Item
            </Button>
          </div>
           {loading ? (
             <div className='row mb-4'>
               <div className='col-5'></div>
               <div className='col-5'>
                 <div className="spinner-border" role="status" style={{ display: 'flex', justifyContent: 'center !important', alignItems: 'center', }}>
                   <span className="visually-hidden">Loading...</span>
                 </div>
               </div>
             </div>
           ) : (
             <div>
               <DTable data={entities} headers={headers} onDelete={handleDeleteItem} onEdit={handleEditItem}/>
             </div>
           )}
        </div>
      )}
      {showPanel && (
        <div className="card mt-3">
          <div className="card-header">
            <h6>{isEdit ? 'Edit Item' : 'Add Item'}</h6>
          </div>
          <div className="card-body">
           
      <div className='card border-left-primary border-bottom-primary' style={{border: "1px solid black"}}>
             <div className='card-header'>
               General Information
             </div>
             <div className='card-body'>
               <div className='row'>
                 <div className='col-sm-4'>
                   <Form.Label>Company Item Code</Form.Label>
                   <Form.Control type='text' name='CompanyItemCode' value={formData.CompanyItemCode} onChange={handleChange} className='form-control form-control-sm' />
                 </div>
                 <div className='col-sm-8'>
                   <Form.Label>Name</Form.Label>
                   <Form.Control type='text' name='Name_' value={formData.Name_} onChange={handleChange} className='form-control form-control-sm' />
                 </div>
               </div>


             </div>
           </div>
           <div className='card mt-2' style={{border: "1px solid black"}}>
             <div className='card-header'>Sizes</div>
             <div className='card-body'>
               <div className='row'>
                 <div className='col-sm-6'><Form.Label title='Width X Length X Height'>W X L X H</Form.Label>
                   <Form.Control type='text' name='WidthLengthHeight' value={formData.WidthLengthHeight} onChange={handleChange} className='form-control form-control-sm' />
                 </div>
                 <div className='col-sm-6'>
                   <Form.Label>Width</Form.Label>
                   <Form.Control type='text' name='Width' value={formData.Width} onChange={handleChange} className='form-control form-control-sm' />
                 </div>
               </div>
               <div className='row mt-2'>
                 <div className='col-sm-6'><Form.Label>Weight</Form.Label>
                   <Form.Control type='text' name='Weight' value={formData.Weight} onChange={handleChange} className='form-control form-control-sm' />
                 </div>
                 <div className='col-sm-6'><Form.Label>Length</Form.Label>
                   <Form.Control type='text' name='Length' value={formData.Length} onChange={handleChange} className='form-control form-control-sm' /></div>
               </div>
               <div className='row mt-2'>
                 <div className='col-sm-6'><Form.Label>Height</Form.Label>
                   <Form.Control type='text' name='Height' value={formData.Height} onChange={handleChange} className='form-control form-control-sm' /></div>
               </div>
             </div>
           </div>
          <div className='card mt-2' style={{border: "1px solid black"}}>
             <div className='card-header'>Additional Informations</div>
             <div className='card-body pb-0'>
               <div className='row mt-2'>
                 <div className='col-sm-6'>
                   <Form.Label>Unit Per Box</Form.Label>
                   <Form.Control type='text' name='UnitPerBox' value={formData.UnitPerBox} onChange={handleChange} className='form-control form-control-sm' />
                 </div>
                 <div className='col-sm-6'><Form.Label>PCS Amount</Form.Label>
                   <Form.Control type='text' name='PCSAmount' value={formData.PCSAmount} onChange={handleChange} className='form-control form-control-sm' />
                 </div>
               </div>
               <div className='row mt-2'>
                 <div className='col-sm-6'>
                   <Form.Label>GTIP</Form.Label>
                   <Form.Control type='text' name='GTIP' value={formData.GTIP} onChange={handleChange} className='form-control form-control-sm' />
                 </div>
                 <div className='col-sm-6'>
                   <Form.Label>EAN</Form.Label>
                   <Form.Control type='text' name='EAN' value={formData.EAN} onChange={handleChange} className='form-control form-control-sm' />
                 </div>
               </div>
               <div className='row mt-2'>
                 <div className='col-sm-6'>
                   <Form.Label>Variant</Form.Label>
                   <Form.Control type='text' name='Variant' value={formData.Variant} onChange={handleChange} className='form-control form-control-sm' /></div>
                 <div className='col-sm-6'><Form.Label>Offer Group</Form.Label>
                   <Form.Control type='text' name='ItemOfferGroup' value={formData.ItemOfferGroup} onChange={handleChange} className='form-control form-control-sm' />
                 </div>
               </div>
               <div className='row mt-2'>
                 <div className='col-sm-6'>
                   <table className='table table-striped'>
                     <tbody>
                       <tr><td><Form.Label>Isparent</Form.Label></td><td>  <Form.Check type="checkbox" name="Isparent" checked={formData.Isparent}
                         onChange={handleChange}
                       /></td>
                       </tr>
                       <tr><td><Form.Label>IsTemplate</Form.Label></td><td>  <Form.Check type="checkbox" name="IsTemplate" checked={formData.IsTemplate}
                         onChange={handleChange}
                       /></td></tr>
                       <tr><td><Form.Label>Is Active?</Form.Label></td><td>   <Form.Check type="checkbox"  name="IsActive"   checked={formData.IsActive}   onChange={handleChange} />
                       </td></tr>
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
           </div>
           <div className='card mt-2' style={{border: "1px solid black"}}>
             <div className='card-header'>
               <h6>Sales Informations</h6>
             </div>
             <div className='card-body'>
               <div className='row'>
               <div className='col-sm-6'>
                   <Form.Label>Sales Price</Form.Label>
                   <Form.Control type='text' name='SalesPrice' value={formData.SalesPrice} onChange={handleChange} className='form-control form-control-sm' />
                 </div>
                 <div className='col-sm-6'>
                   <Form.Label>Currency</Form.Label>
                  
                 </div>
               </div>
             </div>
           </div> 
              <div className="d-flex justify-content-between mt-3">
                <Button  className='btn thema-button btn-sm' onClick={handleSave}>
                  {isEdit ? 'Update' : 'Create'}
                </Button>
                <Button variant="secondary" size='sm' onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemComponent;



function handleChatbotIntents(intent: any, item: any) {
  throw new Error('Function not implemented.');
}
// import React, { useState, useEffect, ChangeEvent } from 'react';
// import { Button, Modal, Form } from 'react-bootstrap';
// import { Items } from '../Models/Items';
// import { getItems, createItems, updateItems, deleteItems } from '../services/ItemsService';
// import DTable from '../components/DTable'
// import StoreDropdown from '../components/StoreDropdown';
// import UnitDropdown from '../components/UnitDropdown';
// import ItemGroupDropdown from '../components/ItemGroupDropdown';
// import BrandDropdown from '../components/BrandDropdown';
// import CurrenyTypeDropdown from '../components/CurrenyTypeDropdown';


// var initialdata: Items = {
//   Id: 0,
//   CDate: new Date(2020, 11, 12).toISOString(),
//   CompanyItemCode: '',
//   Name_: '',
//   EAN: '',
//   UnitPerBox: 0.0,
//   StoreID: 0,
//   Weight: 0.0,
//   WidthLengthHeight: '',
//   IGID: 0,
//   UnitID: 0,
//   CUsrId: 0,
//   FPath: '',
//   UnitCost: 0.0,
//   Width: 0.0,
//   Length: 0.0,
//   Height: 0.0,
//   ItemOfferGroup: 0,
//   Isparent: false,
//   IsTemplate: false,
//   PCSAmount: 0.0,
//   ISOk: 0,
//   NameENG: '',
//   NamePARENT: '',
//   NamePARENTENG: '',
//   FPathParent: '',
//   BrandID: 0,
//   GTIP: '',
//   Variant: '',
//   CurrencyID: 0,
//   SalesPrice: 0.0,
//   CoefficientofUnitPrice: 0.0,
//   IsActive: false,
//   UUsrId: 0,
// };

// const ItemsComponent: React.FC = () => {

//   const [loading, setLoading] = useState<boolean>(true);
//   const [entities, setEntities] = useState<Items[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState<Items>(initialdata);
//   const [isEdit, setIsEdit] = useState(false);
//   const [currentItemsId, setCurrentItemsId] = useState<number | null>(null);

//   const headers = [
//     { prop: 'CompanyItemCode', title: 'Company Item Code', isFilterable: true },
//     { prop: 'Name_', title: 'Item Name', isFilterable: true },
//     { prop: 'EAN', title: 'EAN', isFilterable: true },
//     { prop: 'UnitPerBox', title: 'Unit Per Box', isFilterable: true },
//     { prop: 'StoreID', title: 'StoreID', isFilterable: true },
//     { prop: 'Weight', title: 'Weight', isFilterable: true },
//     { prop: 'WidthLengthHeight', title: 'WidthLengthHeight', isFilterable: true },
//     { prop: 'GTIP', title: 'GTIP', isFilterable: true },
//     {
//       prop: "action", // Using "action" for button column
//       title: "Actions",
//       cell: (row: any) => (
//         <div>
//           <Button variant='secondary' size='sm' onClick={() => handleShowModal(row)}>Edit</Button>
//           <Button variant='danger' size='sm' onClick={() => handleDelete(row.Id!)}>Delete</Button>
//         </div>
//       )
//     }
//   ];
//   useEffect(() => {
//     fetchItems();

//   }, []);

//   const fetchItems = async () => {
//     try {
//       const response = await getItems();
//       setEntities(response.data);
//       setLoading(false)
//     } catch (error) {
//     }
//   };


//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, type, checked, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value,
//     });
//   };

//   const StoreIDChange = (event: any,) => {
//     setFormData({ ...formData, StoreID: event.target.value });
//   };
//   const UnitIDChange = (event: any,) => {
//     setFormData({ ...formData, UnitID: event.target.value });
//   };
//   const IGIDChange = (event: any,) => {
//     setFormData({ ...formData, IGID: event.target.value });
//   };
//   const BrandIDChange = (event: any,) => {
//     setFormData({ ...formData, BrandID: event.target.value });
//   };
//   const CurrencyIDChange = (event: any,) => {
//     setFormData({ ...formData, CurrencyID: event.target.value });
//   };


//   const handleShowModal = (Items?: Items) => {
//     if (Items) {
//       if (window.confirm('Are you sure you want to edit this Items?')) {
//         setFormData(Items);
//         setIsEdit(true);
//         setCurrentItemsId(Items.Id!);
//       }
//     } else {
//       setFormData(initialdata);
//       setIsEdit(false);
//       setCurrentItemsId(null);
//     }
//     setShowModal(true);
//   };

//   const handleHideModal = () => setShowModal(false);

//   const handleSubmit = async () => {
//     if (isEdit && currentItemsId !== null) {
//       await updateItems(currentItemsId, formData);
//     } else {
//       await createItems(formData);
//     }
//     fetchItems();
//     handleHideModal();
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Are you sure you want to delete this Items?')) {
//       await deleteItems(id);
//       fetchItems();
//     }
//   };

//   return (
//     <div className='container-fluid'>
//       <div className='card'>
//         <div className='card-header'>
//           <h6>Items</h6>
//           <Button className='btn btn-sm thema-button' size='sm' onClick={() => handleShowModal()}>Add Items</Button>
//         </div>
//         <div className='card-body'>
//           {loading ? (
//             <div className='row mb-4'>
//               <div className='col-5'></div>
//               <div className='col-5'>
//                 <div className="spinner-border" role="status" style={{ display: 'flex', justifyContent: 'center !important', alignItems: 'center', }}>
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div>
//               {/* Render your entities or data here */}
//               <DTable
//                 data={entities}
//                 headers={headers}
//                 onDelete={handleDelete}
//                 onEdit={handleShowModal}
//               />
//             </div>
//           )}

//         </div>
//       </div>
//       <Modal show={showModal} onHide={handleHideModal} size='xl'>
//         <Modal.Header closeButton>
//           <Modal.Title>{isEdit ? 'Edit Items' : 'Add Items'}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>

//           <div className='card border-left-primary border-bottom-primary' style={{border: "1px solid black"}}>
//             <div className='card-header'>
//               General Information
//             </div>
//             <div className='card-body'>
//               <div className='row'>

//                 <div className='col-sm-4'>
//                   <Form.Label>Company Item Code</Form.Label>
//                   <Form.Control type='text' name='CompanyItemCode' value={formData.CompanyItemCode} onChange={handleChange} className='form-control form-control-sm' />
//                 </div>

//                 <div className='col-sm-8'>
//                   <Form.Label>Name</Form.Label>
//                   <Form.Control type='text' name='Name_' value={formData.Name_} onChange={handleChange} className='form-control form-control-sm' />
//                 </div>
//               </div>
//               <div className='row mt-2'>
//                 <div className='col-sm-6'>
//                   <Form.Label>Item Group</Form.Label>

//                   <ItemGroupDropdown value={formData.IGID} onChange={IGIDChange} />

//                 </div>

//                 <div className='col-sm-6'>
//                   <Form.Label>Unit ID</Form.Label>
//                   <UnitDropdown value={formData.UnitID} onChange={UnitIDChange} />

//                 </div>
//               </div>
//               <div className='row mt-2'>
//                 <div className='col-sm-6'><Form.Label>Store</Form.Label>
//                   <StoreDropdown value={formData.StoreID} onChange={StoreIDChange} />
//                 </div>
//                 <div className='col-sm-6'><Form.Label>BrandID</Form.Label>

//                   <BrandDropdown value={formData.BrandID} onChange={BrandIDChange} />
//                 </div>
//                 <div className='row mt-2'>
//                   <div className='col-sm-6'><Form.Label>Parent Name</Form.Label>
//                     <Form.Control type='text' name='NamePARENT' value={formData.NamePARENT} onChange={handleChange} className='form-control form-control-sm' />
//                   </div>
//                 </div>

//               </div>

//             </div>
//           </div>

//           <div className='card mt-2' style={{border: "1px solid black"}}>
//             <div className='card-header'>Sizes</div>
//             <div className='card-body'>
//               <div className='row'>
//                 <div className='col-sm-6'><Form.Label title='Width X Length X Height'>W X L X H</Form.Label>
//                   <Form.Control type='text' name='WidthLengthHeight' value={formData.WidthLengthHeight} onChange={handleChange} className='form-control form-control-sm' />
//                 </div>

//                 <div className='col-sm-6'>
//                   <Form.Label>Width</Form.Label>
//                   <Form.Control type='text' name='Width' value={formData.Width} onChange={handleChange} className='form-control form-control-sm' />
//                 </div>
//               </div>
//               <div className='row mt-2'>
//                 <div className='col-sm-6'><Form.Label>Weight</Form.Label>
//                   <Form.Control type='text' name='Weight' value={formData.Weight} onChange={handleChange} className='form-control form-control-sm' />
//                 </div>

//                 <div className='col-sm-6'><Form.Label>Length</Form.Label>
//                   <Form.Control type='text' name='Length' value={formData.Length} onChange={handleChange} className='form-control form-control-sm' /></div>
//               </div>

//               <div className='row mt-2'>
//                 <div className='col-sm-6'><Form.Label>Height</Form.Label>
//                   <Form.Control type='text' name='Height' value={formData.Height} onChange={handleChange} className='form-control form-control-sm' /></div>
//               </div>
//             </div>
//           </div>
//          <div className='card mt-2' style={{border: "1px solid black"}}>
//             <div className='card-header'>Additional Informations</div>
//             <div className='card-body pb-0'>
//               <div className='row mt-2'>
//                 <div className='col-sm-6'>
//                   <Form.Label>Unit Per Box</Form.Label>
//                   <Form.Control type='text' name='UnitPerBox' value={formData.UnitPerBox} onChange={handleChange} className='form-control form-control-sm' />

//                 </div>
//                 <div className='col-sm-6'><Form.Label>PCS Amount</Form.Label>
//                   <Form.Control type='text' name='PCSAmount' value={formData.PCSAmount} onChange={handleChange} className='form-control form-control-sm' />
//                 </div>

//               </div>
//               <div className='row mt-2'>
//                 <div className='col-sm-6'>
//                   <Form.Label>GTIP</Form.Label>
//                   <Form.Control type='text' name='GTIP' value={formData.GTIP} onChange={handleChange} className='form-control form-control-sm' />
//                 </div>
//                 <div className='col-sm-6'>
//                   <Form.Label>EAN</Form.Label>
//                   <Form.Control type='text' name='EAN' value={formData.EAN} onChange={handleChange} className='form-control form-control-sm' />
//                 </div>
//               </div>
//               <div className='row mt-2'>
//                 <div className='col-sm-6'>
//                   <Form.Label>Variant</Form.Label>
//                   <Form.Control type='text' name='Variant' value={formData.Variant} onChange={handleChange} className='form-control form-control-sm' /></div>
//                 <div className='col-sm-6'><Form.Label>Offer Group</Form.Label>
//                   <Form.Control type='text' name='ItemOfferGroup' value={formData.ItemOfferGroup} onChange={handleChange} className='form-control form-control-sm' />
//                 </div>

//               </div>
//               <div className='row mt-2'>
//                 <div className='col-sm-6'>
//                   <table className='table table-striped'>
//                     <tbody>
//                       <tr><td><Form.Label>Isparent</Form.Label></td><td>  <Form.Check
//                         type="checkbox"
//                         name="Isparent"
//                         checked={formData.Isparent}
//                         onChange={handleChange}

//                       /></td>
//                       </tr>
//                       <tr><td><Form.Label>IsTemplate</Form.Label></td><td>  <Form.Check
//                         type="checkbox"
//                         name="IsTemplate"
//                         checked={formData.IsTemplate}
//                         onChange={handleChange}

//                       /></td></tr>
//                       <tr><td><Form.Label>Is Active?</Form.Label></td><td>   <Form.Check
//                         type="checkbox"
//                         name="IsActive"
//                         checked={formData.IsActive}
//                         onChange={handleChange}
//                       />
//                       </td></tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className='card mt-2' style={{border: "1px solid black"}}>
//             <div className='card-header'>
//               <h6>Sales Informations</h6>
//             </div>
//             <div className='card-body'>
//               <div className='row'>

//               <div className='col-sm-6'>
//                   <Form.Label>Sales Price</Form.Label>
//                   <Form.Control type='text' name='SalesPrice' value={formData.SalesPrice} onChange={handleChange} className='form-control form-control-sm' />
//                 </div>
//                 <div className='col-sm-6'>
//                   <Form.Label>Currency</Form.Label>
//                   <CurrenyTypeDropdown value={formData.CurrencyID} onChange={CurrencyIDChange} />
//                 </div>
//               </div>
//             </div>
//           </div>


//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant='primary' size='sm' onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'}</Button>
//           <Button variant='secondary' size='sm' onClick={handleHideModal}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default ItemsComponent;
