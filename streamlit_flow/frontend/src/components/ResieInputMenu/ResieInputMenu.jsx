import { Row, Col } from 'react-bootstrap';
import CustomInputField from './CustomInputField';

function ResieInputMenu({ nodeInputObjects, onEdit }) {
  function chunk_into_rows(items_per_row) {
    var rows = [];
    var current_row = [];
    nodeInputObjects.forEach((node_input) => {
      if (!node_input.editable) return;
      current_row.push(node_input);
      if (current_row.length === items_per_row) {
        rows.push(current_row);
        current_row = [];
      }
    });
    return rows;
  }

  var rows = chunk_into_rows(2);
  return (
    <>
      {rows.map((pair, i) => (
        <Row className="g-2 mt-1 mt-md-0">
          {pair.map((node_input, i) => (
            <Col md>
              <CustomInputField
                inputName={node_input.display_name}
                startValue={node_input.value}
                onEdit={onEdit}
                js_type={node_input.js_type}
              />
            </Col>
          ))}
        </Row>
      ))}
    </>
  );
}

export default ResieInputMenu;
