import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResieInputMenu from './ResieInputMenu/ResieInputMenu';
import { getEdgesWithMediumMismatch } from '../HandleUtils';
import { getEmptyBusdata, updateBusDataOnNodeDelete } from '../BusDataUtils';

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
    var resie_data_copy = JSON.parse(JSON.stringify(editedNode.data.resie_data));
    var node_input = resie_data_copy.find((obj) => obj.resie_name === resieName);
    node_input[inputAttributeName] = value;
    setEditedNode((editedNode) => ({ ...editedNode, data: { ...editedNode.data, resie_data: resie_data_copy } }));
    // remove edge if the medium change necessitates it
    let edgesToDelete = getEdgesWithMediumMismatch(edges, editedNode, resieName);
    setEdgesToDelete(edgesToDelete);
  };

  const handleSaveChanges = (e) => {
    const updatedNodes = nodes.map((n) => (n.id === editedNode.id ? editedNode : n));
    setNodes(updatedNodes);
    const updatedEdges = edges.filter((edge) => edgesToDelete.findIndex((e) => e === edge.id) === -1);
    setEdges(updatedEdges);
    handleDataReturnToStreamlit(updatedNodes, updatedEdges, null);
    setNodeContextMenu(null);
  };

  return (
    <Modal show={show} onHide={handleClose} data-bs-theme={theme} onExited={onExited}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Node</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
        onValueChange={onNodeInputValueChange}
        onIncludedChange={onNodeInputIncludedChange}
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
    // find node name that is not taken
    let duplicateNodeName = nodeToDuplicate.data.content + '_COPY_';
    let nameSuffix = 0;
    while (nodes.findIndex((node) => node.data.content === duplicateNodeName + nameSuffix) !== -1) {
      nameSuffix++;
    }
    duplicateNode.data.content = duplicateNodeName + nameSuffix;
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
            <Button
              variant={nodeContextMenu.node.deletable ? 'outline-danger' : 'secondary'}
              onClick={handleDeleteNode}
              disabled={!nodeContextMenu.node.deletable}
            >
              <i className="bi bi-trash3"></i> Delete Node
            </Button>
            <Button variant="outline-primary" onClick={handleDuplicateNode}>
              <i class="bi bi-copy"></i> Duplicate Node
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
