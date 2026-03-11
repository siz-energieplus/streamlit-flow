import RequiredInputMenu from './RequiredInputMenu';
import OptionalInputMenu from './OptionalInputMenu';
import BusConnectionMenu from './BusDataWidget/BusConnectionMenu';

function ResieInputMenu({ node, onValueChange, onIncludedChange }) {
  let nodeInputObjects = node.data.resie_data;
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
      <BusConnectionMenu node={node} />
    </>
  );
}

export default ResieInputMenu;
