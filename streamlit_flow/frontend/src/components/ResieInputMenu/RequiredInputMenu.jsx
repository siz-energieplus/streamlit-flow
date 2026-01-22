import { Row, Col } from 'react-bootstrap';
import CustomInputField from './CustomInputField';

function RequiredInputMenu({ requiredInputObjects, onEdit }) {
  function chunk_into_rows(items_per_row) {
    var rows = [];
    var current_row = [];
    requiredInputObjects.forEach((node_input) => {
      if (!node_input.editable) return;
      current_row.push(node_input);
      if (current_row.length === items_per_row) {
        rows.push(current_row);
        current_row = [];
      }
    });
    if (current_row.length > 0) {
      rows.push(current_row);
    }
    return rows;
  }

  var rows = chunk_into_rows(2);
  return (
    <>
      {rows.map((pair) => (
        <Row className="g-2 mt-1 mt-md-0">
          {pair.map((nodeInput) => (
            <Col md>
              <CustomInputField nodeInput={nodeInput} onEdit={onEdit} />
            </Col>
          ))}
        </Row>
      ))}
    </>
  );
}

export default RequiredInputMenu;
