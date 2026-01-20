import { useState } from 'react';
import { Form, FloatingLabel, Dropdown } from 'react-bootstrap';
import CustomDropdown from './CustomDropdown';

function CustomInputField({ nodeInput, onEdit }) {
  var inputName = nodeInput.display_name;
  var startValue = nodeInput.value;
  var js_type = nodeInput.js_type;
  const [inputValue, setInputValue] = useState(startValue);

  const onInputChanged = (newInput) => {
    if (js_type === 'boolean') newInput = !inputValue;
    setInputValue(newInput);
    onEdit(inputName, newInput);
  };

  const getInputFieldByType = () => {
    switch (js_type) {
      case 'string':
        return (
          <FloatingLabel controlId="floatingInput" label={inputName}>
            <Form.Control
              type="text"
              as="textarea"
              style={{ height: '60px' }}
              placeholder={inputName}
              value={inputValue}
              autoFocus
              onChange={(e) => onInputChanged(e.target.value)}
            />
          </FloatingLabel>
        );
      case 'number':
        return (
          <FloatingLabel controlId="floatingInput" label={inputName}>
            <Form.Control
              type="number"
              placeholder={inputName}
              value={inputValue}
              onChange={(e) => onInputChanged(e.target.value)}
            />
          </FloatingLabel>
        );
      case 'boolean':
        return (
          <Form.Check
            type="switch"
            id={inputName}
            label={inputName}
            defaultChecked={inputValue}
            onChange={(e) => onInputChanged(e.target.value)}
          />
        );
      case 'dropdown':
        return (
          <CustomDropdown
            inputName={inputName}
            startValue={startValue}
            dropdown_options={nodeInput.dropdown_options}
            onEdit={onEdit}
          />
        );
      default:
        // throw new Error('Type does not have a custom input field: ' + typeof startValue);
        console.log('Input ' + { inputName } + ' has type that is not defined yet.');
    }
  };

  return (
    <div data-toggle="tooltip" data-placement="top" title={nodeInput.tooltip}>
      {getInputFieldByType()}
    </div>
  );
}

export default CustomInputField;
