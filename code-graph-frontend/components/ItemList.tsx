import React, {useEffect} from 'react';
import { List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';



interface ItemListProps {
  items: [];
  onDelete: (item) => void;
  onTrain: () => void;
}

function rgbToRgba(rgbString, alpha = 1) {
  const matches = rgbString.match(/\d+/g); // extract numbers from the rgb string

  if (!matches || matches.length !== 3) {
    console.error("Invalid RGB format"); // handle error
    return '';
  }

  const [r, g, b] = matches.map(Number);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const ItemList: React.FC<ItemListProps> = ({ items, onDelete, onTrain }) => {
  //if (!items.length) return null;
    console.log("ItemList re rendered")
    console.log(items)
useEffect(() => {
    console.log("ItemList re rendered")
    console.log(items)
}, []);

useEffect(() => {
    console.log("ItemList has been updated")
    console.log(items)
}, [items]);
  return (
  <div className="container-list">
    <h1>Arrows</h1>

    <List className="scroll-list-list">
      {items.map((item) => (
        <ListItem key={item.dot.dotId} style={{
          backgroundColor: item.dot.color
            ? rgbToRgba(item.dot.color, 0.5) // 50% transparency
            : 'rgba(245, 100, 245, 0.5)'
          }}>
          <div className="flex">
            <div>
              <div>
                Code: {item.dot.codeText}
              </div>
              <div>
                Segment: {item.dot.segment}
              </div>
            </div>
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