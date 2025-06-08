import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Config from '../assets/Config';


// Options interface
interface CSOption {
  id?: number | undefined;
  name: string | undefined;
}

// Component props interface
interface ChatbotSelect2Props {
  slotType: string; // Determines which dropdown to render
  value?: any | undefined; // Currently selected value
  placeholder?: string; // Placeholder text
  onSelect: (selected: CSOption[]) => void; // Callback for when an option is selected
}

const ChatbotSelect2: React.FC<ChatbotSelect2Props> = ({
  slotType,
  value,
  placeholder = 'Select an option...',
  onSelect,
}) => {
  const [options, setOptions] = useState<CSOption[]>([]); // Dropdown options
  const [selectedOption, setSelectedOption] = useState<CSOption[]>([]); // Selected value(s)
  const url = new Config();
  const API_URL = url.APIURL;

  // Fetch options dynamically based on slotType
  const fetchOptions = async () => {
    setOptions([]); // Clear options on slotType change
    try {
      let fetchedOptions: CSOption[] = []; // Temporary array to store fetched data

      switch (slotType) {
        case 'CurrencyId':

          break;

        case 'IGID':
    
          break;

        case 'UnitID':

          break;

        case 'StoreID':

          break;

        case 'BrandID':

          break;
        case 'CAID':      

            break;
            case 'CAID':      


            
        default:
          console.warn(`Invalid slotType: ${slotType}`);
          break;
      }

      setOptions(fetchedOptions); // Set the fetched options
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  // Clear options and re-fetch whenever slotType changes
  useEffect(() => {
    setOptions([]); // Clear current options
    setSelectedOption([]); // Clear the selected option
    fetchOptions(); // Fetch new options based on slotType
  }, [slotType]); // Trigger this effect whenever slotType changes

  // Update selected option whenever value prop changes
  useEffect(() => {
    if (value) {
      const selected = options.find((option) => option.id === value);
      setSelectedOption(selected ? [selected] : []);
    }
  }, [value, options]); // Trigger this effect when value or options change

  return (
    
    <div style={{ width: '100%', marginBottom: '100px' }}>
      <Typeahead
        id={`chatbot-dropdown-${slotType}`}
        labelKey="name" // Key for displaying options
        size="sm"
        options={options} // Options to display in the dropdown
        placeholder={placeholder} // Placeholder text
        selected={selectedOption} // Currently selected option
        onChange={(selected1) => {
          setSelectedOption(selected1 as CSOption[]); // Update selected state
          onSelect(selected1 as CSOption[]); // Notify parent component
        }}
        multiple={false} // Single select dropdown
      />

    </div>
  );
};

export default ChatbotSelect2;
