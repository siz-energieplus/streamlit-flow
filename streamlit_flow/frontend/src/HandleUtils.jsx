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
 * Check if two mediums are defined and the same
 * @param {Object} m1 a medium to check
 * @param {Object} m2 a medium to check
 * @returns {bool} whether the mediums are defined and the same
 */
function mediumsMatch(m1, m2) {
  return m1.key !== 'UNDEFINED' && m1.key === m2.key;
}

/**
 * Get the medium associated with a specific handle on a node
 * @param {string} handleName
 * @param {Object} node
 * @param {List[Object]} mediums
 * @returns {Object} the medium associated with this handle {key: x, name: y, color: z}
 */
function getHandleMedium(handleName, node, mediums) {
  let splitName = handleName.split('-');
  return getMediumFromHandle(splitName[0], parseInt(splitName[1]), node.data, mediums);
}

/**
 * Get the medium from the already handle info and node data
 * @param {string} key 'source' or 'target' depending on where the handle is
 * @param {int} handleIndex
 * @param {Object} nodeData
 * @param {List[Object]} mediums
 * @returns {Object} the medium associated with this handle {key: x, name: y, color: z}
 */
function getMediumFromHandle(key, handleIndex, nodeData, mediums) {
  // get the variable name for the medium that sets this handle's color
  let mediumPerHandle = nodeData.handle_medium_dict[key];
  let variableName = mediumPerHandle[handleIndex];
  // find the medium that is set in this variable
  let mediumNodeInput = nodeData.resie_data.find((x) => x.resie_name === variableName);
  //find the medium object (from global context) with this name
  let medium = mediums.find((x) => x.key === mediumNodeInput.value);
  return medium;
}

/**
 * find all edges, whose medium is controlled by the variable with name var_name on the given node
 * @param {List[Object]} edges a list of all existing edges
 * @param {Object} node the node, whose medium was changed
 * @param {string} var_name the name of the medium variable that was changed
 * @returns {List[string]} a list of all the edge IDs that need to be deleted as a result of the medium change
 */
function getEdgesWithMediumMismatch(edges, node, var_name) {
  // find all edges connected to this medium variables
  let handleMediumDict = node.data.handle_medium_dict;
  let sourceEdgesToDelete = getEdgesToDelete('source');
  let targetEdgesToDelete = getEdgesToDelete('target');
  // get just the edge IDs
  let edgeIDs = [];
  sourceEdgesToDelete.concat(targetEdgesToDelete).forEach((e) => {
    edgeIDs.push(e.id);
  });
  return edgeIDs;

  /**
   * For either the source or target handles, return all edges attached to handles, whose medium was changed
   * @param {string} sourceOrTarget 'source' or 'target'
   * @returns {List{Object}} a list of the edge objects connected to a handle whose medium was changed
   */
  function getEdgesToDelete(sourceOrTarget) {
    let listOfEdgesToDelete = [];
    //get the list of variable names
    let mediumVarNames = handleMediumDict[sourceOrTarget];
    // multiple edges are possible for the bus node
    for (let handleIndex = 0; handleIndex < mediumVarNames.length; handleIndex++) {
      if (mediumVarNames[handleIndex] !== var_name) continue;
      let handleID = sourceOrTarget + '-' + handleIndex;
      // find edges that connect to this handle on this node
      let edgesOnHandle = edges.filter(
        (e) => e[sourceOrTarget] === node.id && e[sourceOrTarget + 'Handle'] === handleID
      );
      listOfEdgesToDelete = listOfEdgesToDelete.concat(edgesOnHandle);
    }
    return listOfEdgesToDelete;
  }
}

export { isHandleTaken, getMediumFromHandle, getHandleMedium, mediumsMatch, getEdgesWithMediumMismatch };
