import { useState } from 'react';
import { useMotionValue, Reorder } from 'framer-motion';
import { useRaisedShadow } from './use-raised-shadow';
import './reorder-styles.css';

export default function DragAndDropMenu({ title, menuNodeIDs, onOrderChange, allNodes }) {
  let menuNodes = menuNodeIDs.map((id) => allNodes.find((n) => n.id == id));
  let menuNodeNames = menuNodes.map((node) => node.data.content);
  const [items, setItems] = useState(menuNodeNames);

  function onReorder(order) {
    setItems(order);
    console.log(order);
    let nodeIDs = order.map((name) => allNodes.find((node) => node.data.content === name).id);
    onOrderChange(nodeIDs);
  }

  return (
    <div class="drag-drop-menu">
      <header> {title}</header>
      <Reorder.Group axis="y" values={items} onReorder={onReorder}>
        {items.map((nodeName) => (
          <Item key={nodeName} item={nodeName} />
        ))}
      </Reorder.Group>
    </div>
  );
}

export const Item = ({ item }) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <Reorder.Item value={item} id={item} style={{ boxShadow, y }}>
      <span>{item}</span>
    </Reorder.Item>
  );
};
