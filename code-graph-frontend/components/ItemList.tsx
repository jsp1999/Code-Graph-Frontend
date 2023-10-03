import React from 'react';
import { List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';



interface ItemListProps {
  items: [];
  onDelete: (item) => void;
  onTrain: () => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onDelete, onTrain }) => {
  //if (!items.length) return null;
    console.log("ItemList re rendered")
    console.log(items)

  return (
    <div>
      <h1>Arrows</h1>
      <List>
        {items.map((item) => (
          <ListItem key={item.dot.dotId}>
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