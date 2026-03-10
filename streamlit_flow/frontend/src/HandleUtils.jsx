/**
 * Check if the source and target handle of the edge we are trying to connect are already taken
 * i.e. if there exists an edge that is already attached to it.
 * An exception is made for Buses, which are the only node allowed to have multiple edges connect to its handles
 * @param {string} sourceHandle
 * @param {string} targetHandle
 * @param {Object} sourceNode
 * @param {Object} targetNode
 * @param {List[Object]} edges
 * @returns {bool} is this Handle already taken
 */
function isHandleTaken(sourceHandle, targetHandle, sourceNode, targetNode, edges) {
  // edge is valid if its target and source handle are not already taken unless the node is a bus
  var sourceIsBus = sourceNode.data.component_type === 'Bus';
  var targetIsBus = targetNode.data.component_type === 'Bus';
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    var sourceHandleTaken = edge.source === sourceNode.id && edge.sourceHandle === sourceHandle;
    var targetHandleTaken = edge.target === targetNode.id && edge.targetHandle === targetHandle;
    if ((!sourceIsBus && sourceHandleTaken) || (!targetIsBus && targetHandleTaken)) {
      return true;
    }
  }
  return false;
}

/**
 * Update input_order, output_order and energy_flow in node.data.bus_data with this new connection
 * This code is a duplicate of a python function in create_elements.py
 * @param {Object} node The bus, whose data we're updating
 * @param {string} connectedNodeID the id of the node being connected to this bus
 * @param {boolean} incoming is this an incoming (or outgoing) connection
 * @returns
 */
function updateBusData(node, connectedNodeID, incoming) {
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
 * Check if two mediums are defined and the same
 * @param {string} m1 the key of the medium to check
 * @param {string} m2 the key of the medium to check
 * @returns {bool} whether the mediums are defined and the same
 */
function mediumsMatch(m1, m2) {
  return m1 !== 'UNDEFINED' && m1 === m2;
}

/**
 * Get the key of the medium associated with a specific handle on a node
 * @param {string} handleName the name of the handle
 * @param {Object} nodeData node.data for our node
 * @returns {Object} the key of the medium associated with this handle
 */
function getMediumKey(handleName, nodeData) {
  let splitName = handleName.split('-');
  let sourceOrTarget = splitName[0];
  let handleIndex = splitName[1];
  // get the variable name for the medium that sets this handle's color
  let mediumPerHandle = nodeData.handle_medium_dict[sourceOrTarget];
  let variableName = mediumPerHandle[handleIndex];
  // find the medium that is set in this variable
  let mediumNodeInput = nodeData.resie_data.find((x) => x.resie_name === variableName);
  return mediumNodeInput.value;
}

/**
 * Get the medium for the handle on a node
 * @param {string} handleName the name of the handle e.g. target-1 or source-2
 * @param {Object} nodeData node.data of some node, so we can get its resie_data
 * @param {List[Object]} mediums A list of the mediums
 * @returns {Object} the medium Objects with {key, name, color}
 */
function getMedium(handleName, nodeData, mediums) {
  let key = getMediumKey(handleName, nodeData);
  let medium = mediums.find((x) => x.key === key);
  return medium;
}

/**
 * find all edges, whose medium is controlled by the variable with name var_name on the given node
 * @param {List[Object]} edges a list of all existing edges
 * @param {Object} node the node, whose medium was changed
 * @param {string} mediumVarName the name of the medium variable that was changed
 * @returns {List[string]} a list of all the edge IDs that need to be deleted as a result of the medium change
 */
function getEdgesWithMediumMismatch(edges, node, mediumVarName) {
  // find all edges connected to this medium variables
  let handleMediumDict = node.data.handle_medium_dict;
  let sourceEdgesToDelete = getEdgesToDelete(edges, node.id, mediumVarName, 'source');
  let targetEdgesToDelete = getEdgesToDelete(edges, node.id, mediumVarName, 'target');
  // get just the edge IDs
  let edgeIDs = [];
  sourceEdgesToDelete.concat(targetEdgesToDelete).forEach((e) => {
    edgeIDs.push(e.id);
  });
  return edgeIDs;

  /**
   * Get a List of all edge objects that are on the handle controlled by this medium variable
   * @param {List[Object]} _edges a list of all the edges in the scene
   * @param {string} _nodeID the id of the node that's being edited
   * @param {string} _mediumVarName the name of the medium variable, whose value was just changed
   * @param {string} _sourceOrTarget 'source' or 'target'
   * @returns {List[Object]} List of all edge objects that are on the handle controlled by this medium variable
   */
  function getEdgesToDelete(_edges, _nodeID, _mediumVarName, _sourceOrTarget) {
    let listOfEdgesToDelete = [];
    //get the list of variable names
    let mediumVarNames = handleMediumDict[_sourceOrTarget];
    // multiple edges are possible for the bus node
    for (let handleIndex = 0; handleIndex < mediumVarNames.length; handleIndex++) {
      if (mediumVarNames[handleIndex] !== _mediumVarName) continue;
      let handleID = _sourceOrTarget + '-' + handleIndex;
      // find edges that connect to this handle on this node
      let edgesOnHandle = _edges.filter(
        (e) => e[_sourceOrTarget] === _nodeID && e[_sourceOrTarget + 'Handle'] === handleID
      );
      listOfEdgesToDelete = listOfEdgesToDelete.concat(edgesOnHandle);
    }
    return listOfEdgesToDelete;
  }
}

export { isHandleTaken, getMedium, getMediumKey, mediumsMatch, getEdgesWithMediumMismatch, updateBusData };
