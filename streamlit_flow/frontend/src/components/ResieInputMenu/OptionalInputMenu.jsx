import { Row, Col, Form } from 'react-bootstrap';
import CustomInputField from './CustomInputField';
import { useState } from 'react';

function OptionalInputMenu({ optionalInputObjects, onValueChange, onIncludedChange }) {
  return (
    <>
      {optionalInputObjects.map((nodeInput) => (
        <OptionalInputField
          nodeInput={nodeInput}
          onValueChange={onValueChange}
          startIncluded={nodeInput.isIncluded}
          onIncludedChange={onIncludedChange}
        />
      ))}
    </>
  );
}

function OptionalInputField({ nodeInput, onValueChange, startIncluded, onIncludedChange }) {
  const inputName = nodeInput.display_name;
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
        <CustomInputField nodeInput={nodeInput} onEdit={onValueFieldEdit} />
      </Col>
    </Row>
  );
}

export default OptionalInputMenu;
