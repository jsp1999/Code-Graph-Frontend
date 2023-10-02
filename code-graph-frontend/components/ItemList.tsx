import React from 'react';
import { List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Item {
  id: number;
  segmentText: string;
  codeText: string;
}

interface ItemListProps {
  items: Item[];
  onDelete: (id: number) => void;
  onTrain: () => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onDelete, onTrain }) => {
  if (!items.length) return null;

  return (
    <div>
      <h1>Movements</h1>
      <List>
        {items.map((item) => (
          <ListItem key={item.id}>
            <div>
              Segment: {item.dot.segment} | Code: {item.dot.codeText}
              <IconButton onClick={() => onDelete(item)}>
                <DeleteIcon />
              </IconButton>
            </div>
          </ListItem>
        ))}
      </List>

      <button onClick={onTrain}>
        Train
      </button>
    </div>
  );
};

export default ItemList;