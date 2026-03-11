import DragAndDropMenu from './DragAndDropMenu';
import { Col, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

export default function BusConnectionMenu({ node }) {
  //   const [items, setItems] = useState(initialItems);
  if (node.data.component_type.toLowerCase() !== 'bus') return <></>;

  return (
    <>
      <Row className="g-2 mt-1 mt-md-0">
        <Col md>
          <h5>Input Order</h5>
          <DragAndDropMenu initialItems={node.data.bus_data.input_order} />
        </Col>
        <Col md>
          <h5>Output Order</h5>
          <DragAndDropMenu initialItems={node.data.bus_data.output_order} />
        </Col>
      </Row>
    </>
  );
}
