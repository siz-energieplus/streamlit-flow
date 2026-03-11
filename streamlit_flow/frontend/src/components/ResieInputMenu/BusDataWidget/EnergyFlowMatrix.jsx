import { Form, FloatingLabel } from 'react-bootstrap';

export default function EnergyFlowMatrix({ energyFlow, input_order, output_order, onEnergyFlowChange }) {
  //
  function onInputChange(row, col, value) {}

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
          {[...Array(input_order)].map((node_id, i) => (
            <tr>
              <th scope="row">{node_id}</th>
              {energyFlow[i].map((element) => (
                <td>{element}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <Form.Control
              type="number"
              placeholder={displayName}
              value={inputValue}
              onChange={(e) => onInputChanged(e.target.value)}
              /> */}
    </>
  );
}
