import Modal from 'react-bootstrap/Modal';
import CustomInputField from './CustomInputField';
import RequiredInputMenu from './RequiredInputMenu';
import OptionalInputMenu from './OptionalInputMenu';

function ResieInputMenu({ nodeInputObjects, onValueChange, onIncludedChange }) {
  let requiredInputs = nodeInputObjects.filter((obj) => obj.required);
  let optionalInputs = nodeInputObjects.filter((obj) => !obj.required);

  return (
    <>
      <Modal.Body>
        <Modal.Header>Required Inputs</Modal.Header>
        <RequiredInputMenu requiredInputObjects={requiredInputs} onEdit={onValueChange} />
      </Modal.Body>
      <Modal.Body>
        <Modal.Header>Optional Inputs</Modal.Header>
        <OptionalInputMenu
          optionalInputObjects={optionalInputs}
          onValueChange={onValueChange}
          onIncludedChange={onIncludedChange}
        />
      </Modal.Body>
    </>
  );
}

export default ResieInputMenu;
