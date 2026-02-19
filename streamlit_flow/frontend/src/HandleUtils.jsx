function isHandleTaken(params, sourceNode, targetNode, edges) {
  // edge is valid if its target and source handle are not already taken unless the node is a bus
  var sourceIsBus = sourceNode.data.component_type === 'Bus';
  var targetIsBus = targetNode.data.component_type === 'Bus';
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    var sourceHandleTaken = edge.source === params.source && edge.sourceHandle === params.sourceHandle;
    var targetHandleTaken = edge.target === params.target && edge.targetHandle === params.targetHandle;
    if ((!sourceIsBus && sourceHandleTaken) || (!targetIsBus && targetHandleTaken)) {
      return true;
    }
  }
  return false;
}

function getHandleMedium(handleName, node, mediums) {
  let medium = getMediumFromHandleName(handleName, node.data, mediums);
  return medium;
}

function mediumsMatch(m1, m2) {
  return m1.key !== 'UNDEFINED' && m1.key === m2.key;
}

function getMediumFromHandleName(handleName, nodeData, mediums) {
  let splitName = handleName.split('-');
  return getMediumFromHandle(splitName[0], parseInt(splitName[1]), nodeData, mediums);
}

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

  // go through the handles and if they're mapped to our medium variable, return all the edges connected to it
  // sourceOrTarget is just "source" or "target" since the same process must be done for both sides of the node
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
