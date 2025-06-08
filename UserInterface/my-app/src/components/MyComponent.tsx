import React from 'react';
import  Select  from 'react-select';
type SelectedValue = Option | null;
interface Props {
  options: Option[];
  selectedValue: SelectedValue;
  onSelect: (value: SelectedValue) => void;
}
interface Option {
  value: string;
  label: string;
}
const MyComponent: React.FC<Props> = ({ options, selectedValue, onSelect }) => {
  return (
    <div className='col-sm-3'>
  <Select
      options={options}
      value={selectedValue}
      onChange={onSelect}
    />
    </div>
  
  );
};
export default MyComponent;