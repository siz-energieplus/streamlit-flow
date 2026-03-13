const nodeTypeColors_dark = {
  heat: '#bc1b1b',
  special: '#6541ca',
  other: '#32c8bc',
  general: '#151515',
  electricity: '#eeb014',
};
const nodeTypeColors_light = {
  heat: '#D49494',
  special: '#BEB4FF',
  other: '#81D2C0',
  general: '#F1F1F1',
  electricity: '#FFDB71',
};

function getNodeStyle(nodeCategory, theme, highlighted) {
  if (theme.toLowerCase() === 'dark') {
    return {
      color: 'white',
      backgroundColor: nodeTypeColors_dark[nodeCategory],
      border: getBorder(theme, highlighted),
    };
  } else {
    return {
      color: 'black',
      backgroundColor: nodeTypeColors_light[nodeCategory],
      border: getBorder(theme, highlighted),
    };
  }
}

function styleNodeSelected(prevSelectedNodeID, selectedNodeID, nodes, theme) {
  if (prevSelectedNodeID) {
    const node = nodes.find((node) => node.id === prevSelectedNodeID);
    if (node) node.style.border = getBorder(theme, false);
  }
  if (selectedNodeID) {
    const node = nodes.find((node) => node.id === selectedNodeID);
    node.style.border = getBorder(theme, true);
  }
  return nodes;
}

function getBorder(theme, highlight = false) {
  const borderThickness = highlight ? 4 : 1;
  let borderColor = theme === 'dark' ? '#d1d1d1' : '#282828';
  if (highlight) {
    borderColor = theme === 'dark' ? '#ffffff' : '#000000';
  }
  const border = borderThickness + 'px solid ' + borderColor;
  return border;
}

function setNodesStyle(nodes, theme, selectedNodeID = null) {
  if (nodes.constructor !== Array) return nodes;
  let updatedNodes = JSON.parse(JSON.stringify(nodes));
  updatedNodes.forEach((node) => {
    if (!node.data.node_category) return;
    const category = node.data.node_category.toLowerCase();
    const highlighted = node.id === selectedNodeID;
    let style = getNodeStyle(category, theme, highlighted);
    style.width = 'auto';
    node.style = style;
  });
  return updatedNodes;
}

export { setNodesStyle, styleNodeSelected };
