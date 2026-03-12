import { useState } from 'react';
import { useMotionValue, Reorder } from 'framer-motion';
import { useRaisedShadow } from './use-raised-shadow';
import './reorder-styles.css';

export default function DragAndDropMenu({ title, nodeNames, onOrderChange }) {
  const [items, setItems] = useState(nodeNames);

  function onReorder(order) {
    setItems(order);
    onOrderChange(order);
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
