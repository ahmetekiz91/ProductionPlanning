// import React from 'react';
// import { Typeahead } from 'react-bootstrap-typeahead';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'react-bootstrap-typeahead/css/Typeahead.css';

// // Define the type for the options
// interface Option {
//   id: number;
//   name: string| undefined;
// }

// interface Select2Props {
//   size?:any,
//   value?: any;
//   options: Option[]; // Accepts an array of objects with `id` and `name`
//   placeholder?: string; // Optional placeholder
//   onSelect: (selected: Option[]) => void; // Callback to return the selected value
// }

// const Select2: React.FC<Select2Props> = ({size, options, value, placeholder = 'Select an option...', onSelect }) => {
//   return (
//     <div style={{ width: "100%"}}>
//       <Typeahead
//         size={size}
//         value={value|| null}
//         id="custom-select"
//         labelKey="name" // Indicates the key to display in the dropdown
//         options={options} // Dynamically binds the options
//         placeholder={placeholder}
//         onChange={(selected) => onSelect(selected as Option[])} // Cast `selected` to `Option[]`
//         multiple={false} // Allow only single selection
//       />
//     </div>
//   );
// };

// export default Select2;
import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

// Define the type for the options
interface Option {
  id: number;
  name: string | undefined;
}

interface Select2Props {
  size?: any;
  value?: number; // Assuming `value` is the `id` of the selected option
  options: Option[]; // Accepts an array of objects with `id` and `name`
  placeholder?: string; // Optional placeholder
  onSelect: (selected: Option[]) => void; // Callback to return the selected value
}

const Select2: React.FC<Select2Props> = ({ size, options, value, placeholder = 'Select an option...', onSelect }) => {
  // Find the currently selected option based on the `value` prop
  const selectedOption = options.filter((option) => option.id === value);

  return (
    <div style={{ width: "100%" }}>
      <Typeahead
        size={size}
        id="custom-select"
        labelKey="name" // Indicates the key to display in the dropdown
        options={options} // Dynamically binds the options
        placeholder={placeholder}
        selected={selectedOption} // Use `selected` to bind the current value
        onChange={(selected) => onSelect(selected as Option[])} // Cast `selected` to `Option[]`
        multiple={false} // Allow only single selection
      />
    </div>
  );
};

export default Select2;

