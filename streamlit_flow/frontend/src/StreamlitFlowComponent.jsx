import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Streamlit } from 'streamlit-component-lib';

import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  useNodesInitialized,
  useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './style.css';

import { AppContext } from './components/AppContext';
import { MarkdownInputNode, MarkdownOutputNode, MarkdownDefaultNode } from './components/MarkdownNode';
import PaneConextMenu from './components/PaneContextMenu';
import NodeContextMenu from './components/NodeContextMenu';
import EdgeContextMenu from './components/EdgeContextMenu';
import { isHandleTaken, mediumsMatch, getMediumKey, getMedium } from './HandleUtils';
import { updateBusDataOnEdgeConnect } from './components/BusDataWidget/BusDataUtils';
import { setNodesStyle, styleNodeSelected } from './NodeThemeUtils';

import createElkGraphLayout from './layouts/ElkLayout';

const StreamlitFlowComponent = (props) => {
  const nodeTypes = useMemo(
    () => ({
      input: MarkdownInputNode,
      output: MarkdownOutputNode,
      default: MarkdownDefaultNode,
    }),
    []
  );

  const [viewFitAfterLayout, setViewFitAfterLayout] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(props.args.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.args.edges);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(props.args.timestamp);
  const [layoutNeedsUpdate, setLayoutNeedsUpdate] = useState(false);
  const [overrideLayout, setOverrideLayout] = useState(false);

  const [layoutCalculated, setLayoutCalculated] = useState(false);

  const [paneContextMenu, setPaneContextMenu] = useState(null);
  const [nodeContextMenu, setNodeContextMenu] = useState(null);
  const [edgeContextMenu, setEdgeContextMenu] = useState(null);

  const nodesInitialized = useNodesInitialized({ includeHiddenNodes: false });
  const [selectedNodeID, setNodeSelected] = useState(null);

  const ref = useRef(null);
  const reactFlowInstance = useReactFlow();
  const { fitView, getNodes, getEdges } = useReactFlow();

  const susiContext = { mediums: props.args.additionalData.mediums, theme: props.theme.base };

  // Helper Functions
  const handleLayout = () => {
    const layoutOptions = overrideLayout ? props.args.resetLayoutOptions : props.args.layoutOptions;
    createElkGraphLayout(getNodes(), getEdges(), layoutOptions)
      .then(({ nodes, edges }) => {
        setNodes(nodes);
        setEdges(edges);
        setViewFitAfterLayout(false);
        handleDataReturnToStreamlit(nodes, edges, selectedNodeID);
        setOverrideLayout(false);
        setLayoutCalculated(true);
      })
      .catch((err) => console.log(err));
  };

  const handleDataReturnToStreamlit = (_nodes, _edges, selectedId) => {
    // set selected node
    styleNodeSelected(selectedNodeID, selectedId, _nodes, props.theme.base);
    setNodeSelected(selectedId);
    // get timestamp
    const timestamp = new Date().getTime();
    setLastUpdateTimestamp(timestamp);
    Streamlit.setComponentValue({
      nodes: _nodes,
      edges: _edges,
      selectedId: selectedId,
      timestamp: timestamp,
      warning_message: props.args.warning_message,
    });
  };

  const calculateMenuPosition = (event) => {
    const pane = ref.current.getBoundingClientRect();
    return {
      top: event.clientY < pane.height - 200 && event.clientY,
      left: event.clientX < pane.width - 200 && event.clientX,
      right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
      bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
    };
  };

  const clearMenus = () => {
    setPaneContextMenu(null);
    setNodeContextMenu(null);
    setEdgeContextMenu(null);
  };

  // when the theme changes
  useEffect(() => {
    setNodes(setNodesStyle(nodes, props.theme.base, setNodeSelected));
  }, [props.theme.base]);

  useEffect(() => Streamlit.setFrameHeight());

  // Layout calculation
  useEffect(() => {
    if (nodesInitialized && !layoutCalculated) handleLayout();
  }, [nodesInitialized, layoutCalculated]);

  // Update elements if streamlit sends new arguments - check by comparing timestamp recency
  useEffect(() => {
    if (lastUpdateTimestamp <= props.args.timestamp) {
      setLayoutNeedsUpdate(true);
      // set node styles
      const nodes = props.args.nodes;
      const updatedNodes = setNodesStyle(nodes, props.theme.base);
      const newSelectedNodeID = props.args.additionalData.selectedNodeID;
      // set the nodes and edges
      setNodes(updatedNodes);
      setEdges(props.args.edges);
      setLastUpdateTimestamp(new Date().getTime());
      handleDataReturnToStreamlit(updatedNodes, props.args.edges, newSelectedNodeID);
    }
  }, [props.args.nodes, props.args.edges]);

  // Handle layout when streamlit sends new state
  useEffect(() => {
    if (layoutNeedsUpdate) {
      setLayoutNeedsUpdate(false);
      setLayoutCalculated(false);
    }
  }, [nodes, edges]);

  // Auto zoom callback
  useEffect(() => {
    if (!viewFitAfterLayout && props.args.fitView) {
      fitView();
      setViewFitAfterLayout(true);
    }
  }, [viewFitAfterLayout, props.args.fitView]);

  // Theme callback
  useEffect(() => {
    setEdges(edges.map((edge) => ({ ...edge, labelStyle: { fill: props.theme.base === 'dark' ? 'white' : 'black' } })));
  }, [props.theme.base]);

  // Context Menu Callbacks
  const handlePaneContextMenu = (event) => {
    event.preventDefault();

    setNodeContextMenu(null);
    setEdgeContextMenu(null);

    setPaneContextMenu({
      ...calculateMenuPosition(event),
      clickPos: reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }),
    });
  };

  const handleNodeContextMenu = (event, node) => {
    event.preventDefault();

    setPaneContextMenu(null);
    setEdgeContextMenu(null);

    setNodeContextMenu({
      node: node,
      ...calculateMenuPosition(event),
    });
  };

  const handleEdgeContextMenu = (event, edge) => {
    event.preventDefault();

    setPaneContextMenu(null);
    setNodeContextMenu(null);

    setEdgeContextMenu({
      edge: edge,
      ...calculateMenuPosition(event),
    });
  };

  // Flow interaction callbacks

  const handlePaneClick = (event) => {
    clearMenus();
    handleDataReturnToStreamlit(nodes, edges, null);
  };

  const handleNodeClick = (event, node) => {
    clearMenus();
    if (props.args.getNodeOnClick) handleDataReturnToStreamlit(nodes, edges, node.id);
  };

  const handleEdgeClick = (event, edge) => {
    clearMenus();
    if (props.args.getEdgeOnClick) handleDataReturnToStreamlit(nodes, edges, edge.id);
  };

  const handleConnect = (params) => {
    let sourceNode = nodes.find((e) => e.id === params.source);
    let targetNode = nodes.find((e) => e.id === params.target);
    // check if its a valid connection
    if (isHandleTaken(params.sourceHandle, params.targetHandle, sourceNode, targetNode, edges)) {
      props.args.warning_message = 'Cannot attach two edges to the same Handle';
      handleDataReturnToStreamlit(nodes, edges, null);
      return;
    }
    let sourceMedium = getMedium(params.sourceHandle, sourceNode.data, susiContext.mediums);
    let sourceMediumKey = sourceMedium.key;
    let targetMediumKey = getMediumKey(params.targetHandle, targetNode.data);
    if (!mediumsMatch(sourceMediumKey, targetMediumKey)) {
      props.args.warning_message = 'The mediums of these handles do not match or are undefined.';
      handleDataReturnToStreamlit(nodes, edges, null);
      return;
    }
    // update bus data with this new connection if the nodes are buses
    updateBusDataOnEdgeConnect(sourceNode, targetNode.id, false);
    updateBusDataOnEdgeConnect(targetNode, sourceNode.id, true);
    // add new edge
    var newEdgeId = `st-flow-edge_${params.source}-${params.target}`;
    newEdgeId += '_' + props.args.timestamp;
    const newEdges = addEdge(
      {
        ...params,
        style: { stroke: sourceMedium.color },
        medium_key: sourceMediumKey,
        animated: props.args['animateNewEdges'],
        labelShowBg: false,
        id: newEdgeId,
      },
      edges
    );
    setEdges(newEdges);
    handleDataReturnToStreamlit(nodes, newEdges, newEdgeId);
  };

  const handleNodeDragStop = (event, node) => {
    const updatedNodes = nodes.map((n) => {
      if (n.id === node.id) return node;
      return n;
    });
    handleDataReturnToStreamlit(updatedNodes, edges, selectedNodeID);
  };

  return (
    <div style={{ height: props.args.height }}>
      <AppContext.Provider value={susiContext}>
        <ReactFlow
          nodeTypes={nodeTypes}
          ref={ref}
          nodes={nodes}
          onNodesChange={onNodesChange}
          onNodeDragStop={handleNodeDragStop}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={props.args.allowNewEdges ? handleConnect : null}
          fitView={props.args.fitView}
          style={props.args.style}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onNodeDragStart={clearMenus}
          onPaneClick={handlePaneClick}
          onPaneContextMenu={props.args.enablePaneMenu ? handlePaneContextMenu : (event) => {}}
          onNodeContextMenu={props.args.enableNodeMenu ? handleNodeContextMenu : (event, node) => {}}
          onEdgeContextMenu={props.args.enableEdgeMenu ? handleEdgeContextMenu : (event, edge) => {}}
          panOnDrag={props.args.panOnDrag}
          zoomOnDoubleClick={props.args.allowZoom}
          zoomOnScroll={props.args.allowZoom}
          zoomOnPinch={props.args.allowZoom}
          minZoom={props.args.minZoom}
          defaultEdgeOptions={props.args.defaultEdgeOptions}
          proOptions={{ hideAttribution: props.args.hideWatermark }}
        >
          <Background />
          {paneContextMenu && (
            <PaneConextMenu
              paneContextMenu={paneContextMenu}
              setPaneContextMenu={setPaneContextMenu}
              setOverrideLayout={setOverrideLayout}
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              handleDataReturnToStreamlit={handleDataReturnToStreamlit}
              setLayoutCalculated={setLayoutCalculated}
              theme={props.theme}
            />
          )}
          {nodeContextMenu && (
            <NodeContextMenu
              nodeContextMenu={nodeContextMenu}
              setNodeContextMenu={setNodeContextMenu}
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
              handleDataReturnToStreamlit={handleDataReturnToStreamlit}
              theme={props.theme}
            />
          )}
          {edgeContextMenu && (
            <EdgeContextMenu
              edgeContextMenu={edgeContextMenu}
              setEdgeContextMenu={setEdgeContextMenu}
              nodes={nodes}
              setNodes={setNodes}
              edges={edges}
              setEdges={setEdges}
              handleDataReturnToStreamlit={handleDataReturnToStreamlit}
              theme={props.theme}
            />
          )}
          {props.args['showControls'] && <Controls />}
          {props.args['showMiniMap'] && <MiniMap pannable zoomable />}
        </ReactFlow>
      </AppContext.Provider>
    </div>
  );
};

const ContextualStreamlitFlowComponent = (props) => {
  return (
    <ReactFlowProvider>
      <StreamlitFlowComponent {...props} />
    </ReactFlowProvider>
  );
};

export default ContextualStreamlitFlowComponent;
