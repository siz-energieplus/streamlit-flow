import { useState } from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';

function CustomInputField({ inputName, startValue, js_type, onEdit }) {
  const [inputValue, setInputValue] = useState(startValue);

  const onInputChanged = (newInput) => {
    if (js_type === 'boolean') newInput = !inputValue;
    setInputValue(newInput);
    onEdit(inputName, newInput);
  };

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
          // value={inputValue}
          onChange={(e) => onInputChanged(e.target.value)}
        />
      );
    case 'object':
    default:
      // throw new Error('Type does not have a custom input field: ' + typeof startValue);
      console.log('Input ' + { inputName } + ' has type that is not defined yet.');
  }
}

export default CustomInputField;
