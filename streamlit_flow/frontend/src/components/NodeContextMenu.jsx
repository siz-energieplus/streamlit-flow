import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResieInputMenu from './ResieInputMenu/ResieInputMenu';
import { getEdgesWithMediumMismatch } from '../HandleUtils';
import { getEmptyBusdata, updateBusDataOnNodeDelete, updateBusDataOnEdgeDelete } from './BusDataWidget/BusDataUtils';

const EditNodeModal = ({
  show,
  node,
  handleClose,
  theme,
  setNodeContextMenu,
  setModalClosing,
  setNodes,
  setEdges,
  nodes,
  edges,
  handleDataReturnToStreamlit,
}) => {
  const [editedNode, setEditedNode] = useState(node);
  const [edgesToDelete, setEdgesToDelete] = useState([]);

  const onExited = (e) => {
    setModalClosing(true);
    setNodeContextMenu(null);
  };

  const onNodeContentChange = (e) => {
    setEditedNode((editedNode) => ({ ...editedNode, data: { ...editedNode.data, content: e.target.value } }));
  };

  const onNodeInputValueChange = (key, newValue) => {
    changeNodeInput(key, 'value', newValue);
  };
  const onNodeInputIncludedChange = (key, isIncluded) => {
    changeNodeInput(key, 'isIncluded', isIncluded);
  };
  const changeNodeInput = (resieName, inputAttributeName, value) => {
    //change node input
    //if you don't make a copy, the change to the resie_data is applied to the nodes list, since editedNode is a reference, not a copy
    const resie_data_copy = JSON.parse(JSON.stringify(editedNode.data.resie_data));
    let node_input = resie_data_copy.find((obj) => obj.resie_name === resieName);
    node_input[inputAttributeName] = value;
    setEditedNode((editedNode) => ({ ...editedNode, data: { ...editedNode.data, resie_data: resie_data_copy } }));
    // remove edge if the medium change necessitates it
    let newEdgesToDelete = getEdgesWithMediumMismatch(edges, editedNode, resieName);
    newEdgesToDelete = newEdgesToDelete.concat(edgesToDelete);
    setEdgesToDelete(newEdgesToDelete);
  };
  const onNodeBusDataChange = (busData) => {
    setEditedNode((editedNode) => ({ ...editedNode, data: { ...editedNode.data, bus_data: busData } }));
  };

  const handleSaveChanges = (e) => {
    let updatedNodes = nodes.map((n) => (n.id === editedNode.id ? editedNode : n));
    edgesToDelete.forEach((edgeID) => {
      const edge = edges.find((e) => e.id === edgeID);
      updateBusDataOnEdgeDelete(updatedNodes, edge);
    });
    setNodes(updatedNodes);
    const updatedEdges = edges.filter((edge) => edgesToDelete.findIndex((e) => e === edge.id) === -1);
    setEdges(updatedEdges);
    handleDataReturnToStreamlit(updatedNodes, updatedEdges, null);
    setNodeContextMenu(null);
  };

  return (
    <Modal show={show} onHide={handleClose} data-bs-theme={theme} onExited={onExited}>
      <Modal.Header closeButton style={{ padding: '20px 10%' }}>
        <Modal.Title>Edit Node</Modal.Title>
      </Modal.Header>
      <Modal.Body className="side-padded-menu">
        <Row className="g-2">
          <Col md>
            <FloatingLabel controlId="floatingInput" label="Node Content">
              <Form.Control
                type="text"
                as="textarea"
                style={{ height: '100px' }}
                placeholder="nodeContent"
                value={editedNode.data.content}
                autoFocus
                onChange={onNodeContentChange}
              />
            </FloatingLabel>
          </Col>
        </Row>
      </Modal.Body>
      <ResieInputMenu
        node={editedNode}
        nodes={nodes}
        onValueChange={onNodeInputValueChange}
        onIncludedChange={onNodeInputIncludedChange}
        onBusDataChange={onNodeBusDataChange}
      />
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const NodeContextMenu = ({
  nodeContextMenu,
  nodes,
  edges,
  setNodeContextMenu,
  setNodes,
  setEdges,
  theme,
  handleDataReturnToStreamlit,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);

  // Check if the node still exists and if it was deleted somehow, close the context menu
  // This can happen if the user clicked 'Clear Graph' while the context menu was open
  useEffect(() => {
    let nodeInList = nodes.find((node) => node.id === nodeContextMenu.node.id);
    if (nodeInList === undefined) setNodeContextMenu(null);
  });

  const handleClose = () => {
    setShowModal(false);
    setModalClosing(true);
  };

  const handleShow = () => setShowModal(true);

  const handleEditNode = (e) => {
    handleShow();
  };

  const handleDeleteNode = (e) => {
    if (nodeContextMenu.node.deletable) {
      const updatedNodes = nodes.filter((node) => node.id !== nodeContextMenu.node.id);
      const updatedEdges = edges.filter(
        (edge) => edge.source !== nodeContextMenu.node.id && edge.target !== nodeContextMenu.node.id
      );
      updateBusDataOnNodeDelete(nodeContextMenu.node.id, nodes, edges);
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      handleDataReturnToStreamlit(updatedNodes, updatedEdges, null);
    }
    setNodeContextMenu(null);
  };

  /**
   * Seperate the node name into the text part and the number at the end,
   * And increase the number at the end until it's a unique name
   * @param {string} name The name of the node being duplicated
   * @param {*} nodes A list of all the nodes in the scene
   * @returns {string} The name for the duplicated node
   */
  const findNameForDuplicate = (name, nodes) => {
    // divide the node name into a string part nameBase and whatever number is at the end of the name
    // if there is no number, the nameBase will just be the name and the new number will be 1
    const match = name.match(/^(.*?)(\d+)$/);
    let nameBase = match ? match[1] : name;
    let number = match ? parseInt(match[2]) + 1 : 1;
    // increase number until the name 'nameBase + number' (with and without 0 padding) is not taken
    while (number < 1000) { // loop-safeguard
      // eslint-disable-next-line
      if (!nodes.find((node) => nameMatches(node.data.content, nameBase, number))) {
        break;
      }
      number++;
    }
    return getPaddedName(nameBase, number);

    /** Get the node name where the number is zero padded to >2 digits */
    function getPaddedName(nameBase, number) {
      let paddedNumber = (number < 10 ? '0' : '') + number;
      return nameBase + paddedNumber;
    }
    /** Check if the name matches either the regular or padded version of nameBase+number */
    function nameMatches(nameToCheck, nameBase, number) {
      return nameToCheck === getPaddedName(nameBase, number) || nameToCheck === nameBase + number;
    }
  };

  /**
   * Duplicate the selected node. Move the duplicated node towards the bottom right.
   * Give the duplicated node a unique ID and name.
   */
  const handleDuplicateNode = (e) => {
    const nodeToDuplicate = nodes.find((node) => node.id === nodeContextMenu.node.id);
    const duplicateNode = JSON.parse(JSON.stringify(nodeToDuplicate));
    // move node towards bottom right and give it a unique ID
    duplicateNode.position.x += 20;
    duplicateNode.position.y += 20;
    duplicateNode.id = nodeToDuplicate.id + '_' + new Date().getTime();
    let isBus = duplicateNode.data.component_type.toLowerCase() === 'bus';
    duplicateNode.data.bus_data = isBus ? getEmptyBusdata() : null;
    duplicateNode.data.content = findNameForDuplicate(nodeToDuplicate.data.content, nodes);
    // update list of nodes
    let updatedNodes = [...nodes, duplicateNode];
    setNodes(updatedNodes);
    handleDataReturnToStreamlit(updatedNodes, edges, null);
    setNodeContextMenu(null);
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: nodeContextMenu.top,
          left: nodeContextMenu.left,
          right: nodeContextMenu.right,
          bottom: nodeContextMenu.bottom,
          backgroundColor: 'white',
          borderRadius: '8px',
          zIndex: 10,
        }}
      >
        {!showModal && !modalClosing && (
          <ButtonGroup vertical>
            <Button variant="outline-primary" onClick={handleEditNode}>
              <i className="bi bi-tools"></i> Edit Node
            </Button>
            <Button variant="outline-primary" onClick={handleDuplicateNode}>
              <i class="bi bi-copy"></i> Duplicate Node
            </Button>
            <Button
              variant={nodeContextMenu.node.deletable ? 'outline-danger' : 'secondary'}
              onClick={handleDeleteNode}
              disabled={!nodeContextMenu.node.deletable}
            >
              <i className="bi bi-trash3"></i> Delete Node
            </Button>
          </ButtonGroup>
        )}
      </div>
      <EditNodeModal
        show={showModal}
        node={nodeContextMenu.node}
        nodes={nodes}
        edges={edges}
        handleClose={handleClose}
        theme={theme.base}
        setNodeContextMenu={setNodeContextMenu}
        setModalClosing={setModalClosing}
        setNodes={setNodes}
        setEdges={setEdges}
        handleDataReturnToStreamlit={handleDataReturnToStreamlit}
      />
    </>
  );
};

export default NodeContextMenu;
