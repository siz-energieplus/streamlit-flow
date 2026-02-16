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

function getEdgeWithMediumMismatch(edges, node, var_name) {
  // find edge connected to the medium
  let handleMediumDict = node.data.handle_medium_dict;
  let edgeIndex = getHandleForVarName('source');
  if (edgeIndex === -1) edgeIndex = getHandleForVarName('target');
  if (edgeIndex === -1) return null;
  return edges[edgeIndex].id;

  function getHandleForVarName(sourceOrTarget) {
    //get the list of variable names
    let handleIndex = handleMediumDict[sourceOrTarget].indexOf(var_name);
    if (handleIndex === -1) return -1;
    let handleID = sourceOrTarget + '-' + handleIndex;
    let edgeIndexToDelete = edges.findIndex(
      (e) => e[sourceOrTarget] === node.id && e[sourceOrTarget + 'Handle'] === handleID
    );
    return edgeIndexToDelete;
  }
}

export { isHandleTaken, getMediumFromHandle, getHandleMedium, mediumsMatch, getEdgeWithMediumMismatch };
