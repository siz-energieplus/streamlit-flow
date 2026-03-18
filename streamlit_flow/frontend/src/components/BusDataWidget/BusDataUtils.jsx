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

/**
 * Removes a node from a bus's input/output_order and energy_flow
 * @param {Object} node the node whose bus_data we're updating
 * @param {string} disconnectedNodeID the id of the node we're disconnecting from the bus
 * @param {boolean} incoming Is this an incoming connection i.e. is the bus the target
 */
function removeBusConnection(node, disconnectedNodeID, incoming) {
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

/**
 * Find all the edges that are deleted when this node is deleted.
 * Then update the bus_data to remove those connections.
 * @param {string} deletedNodeID The id of the node that was deleted
 * @param {List[Object]} nodes All the nodes in the scene
 * @param {List[Object]} edges All the edges in the scene
 */
function updateBusDataOnNodeDelete(deletedNodeID, nodes, edges) {
  const deletedEdges = edges.filter((edge) => edge.source === deletedNodeID || edge.target === deletedNodeID);
  deletedEdges.forEach((edge) => {
    let source = nodes.find((node) => node.id === edge.source);
    let target = nodes.find((node) => node.id === edge.target);
    removeBusConnection(source, edge.target, false);
    removeBusConnection(target, edge.source, true);
  });
}

/**
 * Create the bus_data for a bus with no connections. Used for overwriting the bus_data of a duplicated bus
 * @returns {Object[string, List]} an Object with keys energy_flow, input_order, and output_order all set to be an empty array
 */
function getEmptyBusdata() {
  return {
    energy_flow: [],
    input_order: [],
    output_order: [],
  };
}

/**
 * Calculates how the energy flow matrix should change when the input order list changes
 * @param {*} oldInputOrder The previous input_order list (string node id)
 * @param {*} newInputOrder The new input_order list (string node id)
 * @param {*} energyFlow The energy flow integer matrix
 * @returns the new energy flow integer matrix
 */
function getEnergyFlowOnInputOrderChange(oldInputOrder, newInputOrder, energyFlow) {
  // inputs are rows
  let newEnergyFlow = [];
  newInputOrder.forEach((nodeID) => {
    let oldIndex = oldInputOrder.findIndex((id) => nodeID === id);
    newEnergyFlow.push(energyFlow[oldIndex]);
  });
  return newEnergyFlow;
}

/**
 * Calculates how the energy flow matrix should change when the output order changes
 * @param {*} oldOutputOrder The previous output_order list (string node id)
 * @param {*} newOutputOrder The new output_order list (string node id)
 * @param {*} energyFlow the energy flow integer matrix
 * @returns The new energy flow integer matrix
 */
function getEnergyFlowOnOutputOrderChange(oldOutputOrder, newOutputOrder, energyFlow) {
  // outputs are columns
  let newEnergyFlow = [];
  energyFlow.forEach((row) => {
    // reorder each row of the energy flow matrix according to the new output order
    let newRow = [];
    newOutputOrder.forEach((nodeID) => {
      let oldIndex = oldOutputOrder.findIndex((id) => nodeID === id);
      let energyFlowElement = row[oldIndex];
      newRow.push(energyFlowElement);
    });
    newEnergyFlow.push(newRow);
  });
  return newEnergyFlow;
}

function updateBusDataOnEdgeDelete(nodes, edge) {
  nodes.forEach((node) => {
    if (edge.source === node.id) {
      removeBusConnection(node, edge.target, false);
    } else if (edge.target === node.id) {
      removeBusConnection(node, edge.source, true);
    }
  });
}

export {
  updateBusDataOnEdgeConnect,
  // removeBusConnection,
  getEmptyBusdata,
  updateBusDataOnNodeDelete,
  getEnergyFlowOnInputOrderChange,
  getEnergyFlowOnOutputOrderChange,
  updateBusDataOnEdgeDelete,
};
