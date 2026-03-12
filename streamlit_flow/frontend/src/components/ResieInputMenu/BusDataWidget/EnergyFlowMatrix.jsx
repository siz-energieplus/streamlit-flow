import { Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export default function EnergyFlowMatrix({ initialEnergyFlow, input_order, output_order, onEnergyFlowChange }) {
  const [energyFlow, setEnergyFlow] = useState(initialEnergyFlow);
  useEffect(() => {
    setEnergyFlow(initialEnergyFlow);
  }, [initialEnergyFlow]);

  function onInputChange(row, col, value) {
    let newEnergyFlow = JSON.parse(JSON.stringify(energyFlow));
    newEnergyFlow[row][col] = parseInt(value);
    setEnergyFlow(newEnergyFlow);
    onEnergyFlowChange(newEnergyFlow);
  }
  // let energyFlow = initialEnergyFlow;

  return (
    <>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            {output_order.map((node_id) => (
              <th scope="col">{node_id}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {input_order.map((node_id, row) => (
            <tr>
              <th scope="row">{node_id}</th>
              {energyFlow[row].map((element, col) => (
                <td>
                  <Form.Control
                    type="number"
                    value={element}
                    onChange={(e) => onInputChange(row, col, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
