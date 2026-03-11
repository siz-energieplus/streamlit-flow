import { useState } from 'react';
import { Reorder } from 'framer-motion';

export default function DragAndDropMenu({ initialItems, onOrderChange }) {
  // initialItems = ['🍅 Tomato', '🥒 Cucumber', '🧀 Cheese', '🥬 Lettuce'];
  const [items, setItems] = useState(initialItems);

  return (
    // <header> Drag and drop list</header>
    <Reorder.Group axis="y" values={items} onReorder={setItems}>
      {items.map((item) => (
        <Reorder.Item key={item} value={item}>
          {item}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
