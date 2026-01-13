import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

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

function styleArgs(pos, n, i) {
  if (pos === Position.Left || pos === Position.Right) {
    return { top: `${(i + 1) * (100.0 / (n + 1))}%` };
  } else {
    return { left: `${(i + 1) * (100.0 / (n + 1))}%` };
  }
}

function MarkdownNode(data, sourcePosition = false, targetPosition = false) {
  const sourceHandles = data.sourceHandles !== undefined ? data.sourceHandles : 0;
  const targetHandles = data.targetHandles !== undefined ? data.targetHandles : 0;
  const sourcePos = sourcePosition && (handlePosMap[sourcePosition] || Position.Right);
  const targetPos = targetPosition && (handlePosMap[targetPosition] || Position.Left);

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
              style={styleArgs(sourcePos, sourceHandles, i)}
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
              style={styleArgs(targetPos, targetHandles, i)}
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
