import { Row, Col, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import CustomInputField from './CustomInputField';
import { useState } from 'react';

function OptionalInputMenu({ optionalInputObjects, onValueChange, onIncludedChange }) {
  if (optionalInputObjects.length === 0) return <></>;

  return (
    <>
      <Modal.Body>
        <Modal.Header>Optional Inputs</Modal.Header>
        {optionalInputObjects.map((nodeInput) => (
          <OptionalInputField
            nodeInput={nodeInput}
            onValueChange={onValueChange}
            startIncluded={nodeInput.isIncluded}
            onIncludedChange={onIncludedChange}
          />
        ))}
      </Modal.Body>
    </>
  );
}

function OptionalInputField({ nodeInput, onValueChange, startIncluded, onIncludedChange }) {
  const resieName = nodeInput.resie_name;
  const [isIncluded, setIncluded] = useState(startIncluded);

  const onSwitchClicked = (newInput) => {
    setIncluded(!isIncluded);
    onIncludedChange(resieName, !isIncluded);
  };
  const onValueFieldEdit = (key, newValue) => {
    setIncluded(true);
    onIncludedChange(resieName, true);
    onValueChange(resieName, newValue);
  };

  return (
    <Row className="g-2 mt-1 mt-md-0">
      <Col md>
        <Form.Check
          type="switch"
          checked={isIncluded}
          id={resieName}
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
