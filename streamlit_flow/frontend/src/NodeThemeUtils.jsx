const nodeTypeColors_dark = {
  heat: '#bc1b1b',
  special: '#1D1446',
  other: '#32c8bc',
  general: '#000000',
  electricity: '#eeb014',
};
const nodeTypeColors_light = {
  heat: '#da8d8d',
  special: '#d1c6ff',
  other: '#befef9',
  general: '#bebebe',
  electricity: '#ffe8ad',
};

function getNodeStyle(nodeCategory, theme) {
  if (theme.toLowerCase() === 'dark') {
    return {
      color: 'white',
      backgroundColor: nodeTypeColors_dark[nodeCategory],
      border: '1px solid white',
    };
  } else {
    return {
      color: 'black',
      backgroundColor: nodeTypeColors_light[nodeCategory],
      border: '1px solid black',
    };
  }
}

function setNodesStyle(nodes, theme) {
  if (nodes.constructor !== Array) return nodes;
  let updatedNodes = JSON.parse(JSON.stringify(nodes));
  updatedNodes.forEach((node) => {
    if (!node.data.node_category) return;
    let category = node.data.node_category.toLowerCase();
    let style = getNodeStyle(category, theme);
    style.width = 'auto';
    node.style = style;
  });
  return updatedNodes;
}

export { setNodesStyle };
