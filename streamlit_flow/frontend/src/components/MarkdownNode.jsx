import React, { memo, useContext } from 'react';
import { Handle, Position } from 'reactflow';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

import { AppContext } from './AppContext';
import { getMedium } from '../HandleUtils';

const handlePosMap = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
};

const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeHighlight, rehypeRaw, rehypeKatex];

const MemoizedMarkdown = memo(({ content }) => (
  <Markdown rehypePlugins={rehypePlugins} remarkPlugins={remarkPlugins}>
    {content}
  </Markdown>
));

/**
 * create the style object that defines the visuals of this Handle
 * @param {Position} pos
 * @param {int} n the number of handles on this side (source/target) of the node
 * @param {int} i the index of this handle
 * @param {string} handleColor the color the handle should be
 * @returns {Object} a style object for the node's handle
 */
function styleArgs(pos, n, i, handleColor) {
  let style = {
    background: handleColor,
    borderColor: '#ffffff',
    width: '8px',
    height: '8px',
  };

  if (pos === Position.Left || pos === Position.Right) {
    style.top = `${(i + 1) * (100.0 / (n + 1))}%`;
  } else {
    style.left = `${(i + 1) * (100.0 / (n + 1))}%`;
  }
  return style;
}

function MarkdownNode(data, sourcePosition = false, targetPosition = false) {
  const sourceHandles = data.sourceHandles !== undefined ? data.sourceHandles : 0;
  const targetHandles = data.targetHandles !== undefined ? data.targetHandles : 0;
  const sourcePos = sourcePosition && (handlePosMap[sourcePosition] || Position.Right);
  const targetPos = targetPosition && (handlePosMap[targetPosition] || Position.Left);
  const mediums = useContext(AppContext).mediums;

  /**
   * Get the color of the medium associated with this handle
   * @param {string} the handle's name like target-0 or source-2
   * @returns {string} the color the handle should be in format: "#ff00cc"
   */
  function getHandleColor(handleName) {
    let medium = getMedium(handleName, data, mediums);
    if (!medium) return '#ffffff';
    return medium.color;
  }

  let isBus = data.component_type.toLowerCase() === 'bus';
  let handleType = isBus ? 'bus-handle' : 'custom-handle';
  return (
    <>
      <div className="node-handles">
        {sourcePos &&
          [...Array(sourceHandles)].map((_, i) => (
            <Handle
              id={`source-${i}`}
              key={data.content + '_source-'+i}
              className={handleType}
              type="source"
              position={sourcePos}
              isConnectable
              style={styleArgs(sourcePos, sourceHandles, i, getHandleColor('source-'+ i))}
            />
          ))}
      </div>

      <div className="markdown-node">
        <MemoizedMarkdown content={data.content} />
      </div>

      <div className="node-handles">
        {targetPos &&
          [...Array(targetHandles)].map((_, i) => (
            <Handle
              id={`target-${i}`}
              key={data.content + '_target-'+i}
              className={handleType}
              type="target"
              position={targetPos}
              isConnectable
              style={styleArgs(targetPos, targetHandles, i, getHandleColor('target-'+ i))}
            />
          ))}
      </div>
    </>
  );
}

const MarkdownInputNode = ({ data, sourcePosition }) => {
  return MarkdownNode(data, sourcePosition, false);
};

const MarkdownOutputNode = ({ data, targetPosition }) => {
  return MarkdownNode(data, false, targetPosition);
};

const MarkdownDefaultNode = ({ data, sourcePosition, targetPosition }) => {
  return MarkdownNode(data, sourcePosition, targetPosition);
};

export { MarkdownInputNode, MarkdownOutputNode, MarkdownDefaultNode };
