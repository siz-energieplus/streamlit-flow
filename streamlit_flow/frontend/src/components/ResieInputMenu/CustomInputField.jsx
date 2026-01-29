import { useState, useContext } from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import CustomDropdown from './CustomDropdown';
import { AppContext } from './../AppContext';

function CustomInputField({ nodeInput, onEdit }) {
  var displayName = nodeInput.display_name;
  var startValue = nodeInput.value;
  var js_type = nodeInput.js_type;
  const [inputValue, setInputValue] = useState(startValue);
  const mediums = useContext(AppContext).mediums;

  // if this is a medium, make the options the mediums
  if (nodeInput.is_medium) {
    js_type = 'dropdown';
    nodeInput.dropdown_options = mediums.map((m) => m.key);
    nodeInput.dropdown_options_display_names = mediums.map((m) => m.name);
  }

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
            dropdown_options_display_names={nodeInput.dropdown_options_display_names}
            onEdit={onInputChanged}
          />
        );
      default:
        console.log('Input ' + { inputName: displayName } + ' has type that is not defined yet.');
    }
  };

  // console.log(nodeInput.tooltip);
  return (
    <div data-toggle="tooltip" data-placement="top" title={nodeInput.tooltip}>
      {getInputFieldByType()}
    </div>
  );
}

export default CustomInputField;
