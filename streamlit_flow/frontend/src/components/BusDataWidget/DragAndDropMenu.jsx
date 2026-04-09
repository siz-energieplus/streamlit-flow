import { useState, useContext } from 'react';
import { useMotionValue, Reorder } from 'framer-motion';
import { useRaisedShadow } from './use-raised-shadow';
import { AppContext } from '../AppContext';
import './reorder-styles.css';

export default function DragAndDropMenu({ title, nodeNames, onOrderChange }) {
  const [items, setItems] = useState(nodeNames);
  const theme = useContext(AppContext).theme;

  function onReorder(order) {
    setItems(order);
    onOrderChange(order);
  }

  return (
    <div class="drag-drop-menu" theme={theme}>
      <header> {title}</header>
      <Reorder.Group axis="y" values={items} onReorder={onReorder}>
        {items.map((nodeName) => (
          <Item key={nodeName} item={nodeName} theme={'dark'} />
        ))}
      </Reorder.Group>
    </div>
  );
}

export const Item = ({ item }) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const theme = useContext(AppContext).theme;

  return (
    <Reorder.Item value={item} id={item} style={{ boxShadow, y }} theme={theme}>
      <span>{item}</span>
    </Reorder.Item>
  );
};
