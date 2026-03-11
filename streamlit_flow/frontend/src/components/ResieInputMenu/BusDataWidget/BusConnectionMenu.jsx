import DragAndDropMenu from './DragAndDropMenu';
import { Col, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { getEnergyFlowOnOutputOrderChange, getEnergyFlowOnInputOrderChange } from '../../../BusDataUtils';
import EnergyFlowMatrix from './EnergyFlowMatrix';

export default function BusConnectionMenu({ node, nodes, onBusDataChange }) {
  if (node.data.component_type.toLowerCase() !== 'bus') return <></>;
  let busData = node.data.bus_data;
  if (busData.input_order == 0 || busData.output_order == 0) return <></>;

  function onInputOrderChange(order) {
    let newBusData = {
      input_order: order,
      output_order: busData.output_order,
      energy_flow: getEnergyFlowOnInputOrderChange(busData.input_order, order, busData.energy_flow),
    };
    onBusDataChange(newBusData);
  }
  function onOutputOrderChange(order) {
    let newBusData = {
      input_order: busData.input_order,
      output_order: order,
      energy_flow: getEnergyFlowOnOutputOrderChange(busData.output_order, order, busData.energy_flow),
    };
    onBusDataChange(newBusData);
  }
  function onEnergyFlowChange(energyFlow) {}

  return (
    <>
      <Modal.Body>
        <Modal.Header>Priorities</Modal.Header>
        <Row className="g-2 mt-1 mt-md-0">
          <Col md>
            <DragAndDropMenu
              title="Input Order"
              menuNodeIDs={node.data.bus_data.input_order}
              allNodes={nodes}
              onOrderChange={onInputOrderChange}
            />
          </Col>
          <Col md>
            <DragAndDropMenu
              title="Output Order"
              menuNodeIDs={node.data.bus_data.output_order}
              allNodes={nodes}
              onOrderChange={onOutputOrderChange}
            />
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Body>
        <Modal.Header>Energy Flow Matrix</Modal.Header>
        <EnergyFlowMatrix
          input_order={busData.input_order}
          output_order={busData.output_order}
          energyFlow={busData.energy_flow}
          onEnergyFlowChange={onEnergyFlowChange}
        />
      </Modal.Body>
    </>
  );
}
