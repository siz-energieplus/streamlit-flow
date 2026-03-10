import RequiredInputMenu from './RequiredInputMenu';
import OptionalInputMenu from './OptionalInputMenu';

function ResieInputMenu({ nodeInputObjects, onValueChange, onIncludedChange }) {
  let requiredInputs = nodeInputObjects.filter((obj) => obj.required);
  let optionalInputs = nodeInputObjects.filter((obj) => !obj.required);

  return (
    <>
      <RequiredInputMenu requiredInputObjects={requiredInputs} onEdit={onValueChange} />
      <OptionalInputMenu
        optionalInputObjects={optionalInputs}
        onValueChange={onValueChange}
        onIncludedChange={onIncludedChange}
      />
    </>
  );
}

export default ResieInputMenu;
