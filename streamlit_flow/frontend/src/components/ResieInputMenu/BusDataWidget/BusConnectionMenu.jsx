import DragAndDropMenu from './DragAndDropMenu';
import { Col, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

export default function BusConnectionMenu({ node }) {
  //   const [items, setItems] = useState(initialItems);
  if (node.data.component_type.toLowerCase() !== 'bus') return <></>;

  return (
    <>
      <Modal.Body>
        <Modal.Header>Priorities</Modal.Header>
        <Row className="g-2 mt-1 mt-md-0">
          <Col md>
            <DragAndDropMenu title="Input Order" initialItems={node.data.bus_data.input_order} />
          </Col>
          <Col md>
            <DragAndDropMenu title="Output Order" initialItems={node.data.bus_data.output_order} />
          </Col>
        </Row>
      </Modal.Body>
    </>
  );
}
