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

function styleArgs(pos, n, i, handleColor) {
  let style = {
    background: handleColor,
    borderColor: '#ffffff',
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

  function getHandleColor(isSource, handleIndex) {
    // get the variable name for the medium that sets this handle's color
    let key = isSource ? 'source' : 'target';
    let colorList = data.handle_color_dict[key];
    let variableName = colorList[handleIndex];
    // find the medium that is set in this variable
    let mediumNodeInput = data.resie_data.find((x) => x.resie_name == variableName);
    //find the medium object (from global context) with this name
    let medium = mediums.find((x) => x.key == mediumNodeInput.value);
    return medium.color;
  }

  return (
    <>
      <div className="node-handles">
        {sourcePos &&
          [...Array(sourceHandles)].map((_, i) => (
            <Handle
              id={`source-${i}`}
              key={data.content + '_source-${i}'}
              className="custom-handle"
              type="source"
              position={sourcePos}
              isConnectable
              style={styleArgs(sourcePos, sourceHandles, i, getHandleColor(true, i))}
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
              key={data.content + '_target-${i}'}
              className="custom-handle"
              type="target"
              position={targetPos}
              isConnectable
              style={styleArgs(targetPos, targetHandles, i, getHandleColor(false, i))}
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
