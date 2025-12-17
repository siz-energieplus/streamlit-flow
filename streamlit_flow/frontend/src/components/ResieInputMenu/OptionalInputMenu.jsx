import { Row, Col, Form } from 'react-bootstrap';
import CustomInputField from './CustomInputField';
import { useState } from 'react';

function OptionalInputMenu({ optionalInputObjects, onValueChange, onIncludedChange }) {
  return (
    <>
      {optionalInputObjects.map((node_input) => (
        <OptionalInputField
          inputName={node_input.display_name}
          js_type={node_input.js_type}
          startValue={node_input.value}
          onValueChange={onValueChange}
          startIncluded={node_input.isIncluded}
          onIncludedChange={onIncludedChange}
        />
      ))}
    </>
  );
}

function OptionalInputField({ inputName, js_type, startValue, onValueChange, startIncluded, onIncludedChange }) {
  const [isIncluded, setIncluded] = useState(startIncluded);

  const onSwitchClicked = (newInput) => {
    setIncluded(!isIncluded);
    onIncludedChange(inputName, !isIncluded);
  };
  const onValueFieldEdit = (key, newValue) => {
    setIncluded(true);
    onIncludedChange(inputName, true);
    onValueChange(inputName, newValue);
  };

  return (
    <Row className="g-2 mt-1 mt-md-0">
      <Col md>
        <Form.Check
          type="switch"
          checked={isIncluded}
          id={inputName}
          label={'include?'}
          defaultChecked={isIncluded}
          onChange={onSwitchClicked}
        />
      </Col>
      <Col md>
        <CustomInputField inputName={inputName} startValue={startValue} onEdit={onValueFieldEdit} js_type={js_type} />
      </Col>
    </Row>
  );
}

export default OptionalInputMenu;
