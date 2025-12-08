import React, { useState } from 'react';
import { Form, Row, Col, FloatingLabel } from 'react-bootstrap';

function CustomInputField({ inputName, startValue, onEdit }) {
  const [inputValue, setInputValue] = useState(startValue);

  const onInputChanged = (newInput) => {
    setInputValue(newInput);
    onEdit(inputName, newInput);
  };

  switch (typeof startValue) {
    case 'string':
      return (
        <FloatingLabel controlId="floatingInput" label="Node Content">
          <Form.Control
            type="text"
            as="textarea"
            style={{ height: '100px' }}
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
    case 'object':
    default:
      throw new Error('Type does not have a custom input field: ' + typeof startValue);
  }
  // return (
  // 	<FloatingLabel controlId="floatingInput" label={inputName}>
  // 		<Form.Control
  // 			type="number"
  // 			placeholder={inputName}
  // 			value={inputValue}
  // 			onChange={(e) => onInputChanged(e.target.value)}
  // 		/>
  // 	</FloatingLabel>
  // );
}

export default CustomInputField;
