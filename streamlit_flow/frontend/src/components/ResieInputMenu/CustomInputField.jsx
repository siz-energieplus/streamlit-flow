import { useState } from 'react';
import { Form, FloatingLabel, Dropdown } from 'react-bootstrap';
import CustomDropdown from './CustomDropdown';

function CustomInputField({ nodeInput, onEdit }) {
  var displayName = nodeInput.display_name;
  var startValue = nodeInput.value;
  var js_type = nodeInput.js_type;
  const [inputValue, setInputValue] = useState(startValue);

  const onInputChanged = (newInput) => {
    if (js_type === 'boolean') newInput = !inputValue;
    setInputValue(newInput);
    onEdit(nodeInput.resie_name, newInput);
  };

  const getInputFieldByType = () => {
    switch (js_type) {
      case 'string':
        return (
          <FloatingLabel controlId="floatingInput" label={displayName}>
            <Form.Control
              type="text"
              as="textarea"
              style={{ height: '60px' }}
              placeholder={displayName}
              value={inputValue}
              autoFocus
              onChange={(e) => onInputChanged(e.target.value)}
            />
          </FloatingLabel>
        );
      case 'number':
        return (
          <FloatingLabel controlId="floatingInput" label={displayName}>
            <Form.Control
              type="number"
              placeholder={displayName}
              value={inputValue}
              onChange={(e) => onInputChanged(e.target.value)}
            />
          </FloatingLabel>
        );
      case 'boolean':
        return (
          <Form.Check
            type="switch"
            id={displayName}
            label={displayName}
            defaultChecked={inputValue}
            onChange={(e) => onInputChanged(e.target.value)}
          />
        );
      case 'dropdown':
        return (
          <CustomDropdown
            displayName={displayName}
            startValue={startValue}
            dropdown_options={nodeInput.dropdown_options}
            onEdit={onInputChanged}
          />
        );
      default:
        // throw new Error('Type does not have a custom input field: ' + typeof startValue);
        console.log('Input ' + { inputName: displayName } + ' has type that is not defined yet.');
    }
  };

  console.log(nodeInput.tooltip);
  return (
    <div data-toggle="tooltip" data-placement="top" title={nodeInput.tooltip}>
      {getInputFieldByType()}
    </div>
  );
}

export default CustomInputField;
