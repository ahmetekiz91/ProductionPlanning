import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { getItems } from '../services/ItemsService';
import { Items } from '../Models/Items';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { Alignment } from 'react-data-table-component';
import Select2 from './Select2';
interface DataTableProps 
{
    value:any

    onChange: (row: any) => void;
}
const ConsumedItemDropdown: React.FC<DataTableProps> = ({ value, onChange}) => {

const [stores, setStores] = useState<Items[]>([]);
const handleSelectChange = (selected: any[]) => {
  if (selected.length > 0) {
    onChange(selected[0].id);
  } else {
    onChange(null);
  }
};
const fetchStores = async () => {
  try {
    const response = await getItems();
    const filtered = response.data.filter(store => (store.IGID !== 1)&&(store.IGID !== 13));
    setStores(filtered);
  } catch (error) {
    console.error("Error fetching stores:", error);
  }
};
  useEffect(() => {
   
    
    fetchStores();
  }, []);

  return (
    <Select2 placeholder="Select Item..."  value={value} size={"sm"}  options={stores.map((model) => ({ id: model.Id, name: model.Id+"--"+model.CompanyItemCode+"--"+model.Name_ }))} onSelect={handleSelectChange} /> 

  );
};

export default ConsumedItemDropdown;
