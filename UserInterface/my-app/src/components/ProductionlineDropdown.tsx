import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Config from '../assets/Config';
import { ProductionLine } from '../Models/ProductionLine';

// Define the type for the options
interface Option {
  Id?: number | undefined;
  name: string | undefined;
}

interface DropdownProps {
  value?: number | undefined; 
  placeholder?: string; 
  onSelect: (selected: Option[]) => void; 
}

const ProdcutionlineDropdown: React.FC<DropdownProps> = ({
  value,
  placeholder = 'Select an option...',
  onSelect,


}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const url = new Config();
  const API_URL = url.APIURL + 'ProductionLine';
  // Find the currently selected option based on the value passed
  const selectedOption = options.filter((option) => option.Id === value);

  const fetchOptions = async () => {
    try {
      const response = await axios.get<ProductionLine[]>(API_URL);
      const transformedData = response.data.map((unit) => ({
        Id: unit.Id,
        name: (unit.Code || ''), // Ensure `name` is a string
      }));

      setOptions(transformedData);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [API_URL]);

  return (
    <div style={{ width: '100%' }}>

   <Typeahead
        id="unit-dropdown"
        labelKey="name" size={"sm"}
        options={options}
        placeholder={placeholder}
        selected={selectedOption}
        onChange={(selected) => onSelect(selected as Option[])}
        multiple={false}
      />

      {/* <select
        id="generic-dropdown"
        className="form-control form-control-sm"
        value={selectedOption?.[0]?.Id || ""}
        onChange={(e) => {
          const selected = options.find(option => option.Id === parseInt(e.target.value) || 0);
          if (selected) {
            onSelect([selected]);
          }
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.Id} value={option.Id}>
            {option.name}
          </option>
        ))}
      </select> */}
    </div>
  );
};

export default ProdcutionlineDropdown;
