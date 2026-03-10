/**
 * Update input_order, output_order and energy_flow in node.data.bus_data with this new connection
 * This code is a duplicate of a python function in create_elements.py
 * @param {Object} node The bus, whose data we're updating
 * @param {string} connectedNodeID the id of the node being connected to this bus
 * @param {boolean} incoming is this an incoming (or outgoing) connection i.e. is node the target node
 * @returns
 */
function updateBusDataOnEdgeConnect(node, connectedNodeID, incoming) {
  if (node.data.component_type.toLowerCase() !== 'bus') return;
  let busData = node.data.bus_data;
  busData[incoming ? 'input_order' : 'output_order'].push(connectedNodeID);
  // update energy flow and fill with 1s by default
  // inputs are rows, outputs are columns
  let energyFlow = busData.energy_flow;
  if (incoming) {
    let newRow = busData.output_order.map(() => 1);
    energyFlow.push(newRow);
  } else {
    energyFlow.forEach((row) => {
      row.push(1);
    });
  }
  busData.energy_flow = energyFlow;
}

function updateBusDataOnEdgeDelete(node, disconnectedNodeID, incoming) {
  if (node.data.component_type.toLowerCase() !== 'bus') return;
  let busData = node.data.bus_data;
  if (incoming) {
    // remove row at index as the disconnected node id is in the incoming order array
    let index = busData.input_order.findIndex((id) => id === disconnectedNodeID);
    busData.input_order.splice(index, 1);
    busData.energy_flow.splice(index, 1);
  } else {
    // find index of node id in outgoin order
    let index = busData.output_order.findIndex((id) => id === disconnectedNodeID);
    busData.output_order.splice(index, 1);
    // in every row, remove the item at index
    busData.energy_flow.forEach((row) => {
      row.splice(index, 1);
    });
  }
}

export { updateBusDataOnEdgeConnect, updateBusDataOnEdgeDelete };
