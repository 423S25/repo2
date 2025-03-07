import { useEffect, useState } from 'react'
import { Drawer,
        Button,
        TextInput,
        NumberInput } from '@mantine/core';
import InventoryItem from '../../types/InventoryItemType';


interface EditItemDrawerProps {
  currentItem : InventoryItem,
  updateItem : (updatedItem : InventoryItem) => void,
  opened : boolean,
  open : () => void,
  close : () => void,
  position : string
}

/*
  Drawer element that only opens when a user wants to edit some of the current information about an
  inventory item
*/ 
const EditItemDrawer = (props : EditItemDrawerProps) => {
  const [item, setItem] = useState<InventoryItem>(props.currentItem);
  
  // Function that will update our InventoryItem object any time a form is changed by the user
  const handleNewItemChange = (name: string, value: string | number | null) => {
    setItem({ ...item, [name]: value ?? '' });
  };

  useEffect(() => {
    if (props.currentItem !== undefined){
      setItem(props.currentItem);
    }
    else{
      setItem({
        pk : 0,
        item_name : "",
        stock_count : 0,
        minimum_count : 0,
        category : ""
      })
  }
  }, [props.currentItem])

  return (
    <>
      <Drawer position="right" opened={props.opened} onClose={props.close} title="Edit Inventory Item">
        <TextInput
          label="Edit Item Name"
          name = "item_name"
          placeholder="Edit Current Item Name"
          value ={item.item_name}
          onChange={(e) => handleNewItemChange("item_name", e.target.value)}
        />
        <NumberInput
          label="Edit Item Count"
          placeholder="Set Current Count"
          name = "stock_count"
          min={0}
          max={100000000}
          value ={item.stock_count}
          onChange={(e) => handleNewItemChange("stock_count", e)}
        />      
        <NumberInput
          label="Edit Minimum Item Count"
          placeholder="Set Minimum Count Needed"
          min={0}
          name=""
          max={100000000}
          value ={item.minimum_count}
          onChange={(e) => handleNewItemChange("minimum_count", e)}
        />      
        <Button onClick={() => {
          props.updateItem(item);
          props.close();
        }}>Update Item</Button>
      </Drawer>
    </>
  );
}

export default EditItemDrawer
