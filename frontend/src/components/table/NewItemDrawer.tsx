import { Drawer,
          Select,
          TextInput,
          NumberInput, 
          Button} from '@mantine/core';
import InventoryItem from '../../types/InventoryItemType';
import { useState } from 'react'


interface NewItemDrawerProps {
  setNewItem : (newItem : InventoryItem) => void,
  position : string,
  opened : boolean,
  open : () => void,
  close : () => void, 
}

/*
  Drawer element that only opens when a user wants to add a new
  inventory item and allows them to change that attribute. 
*/ 
const NewItemDrawer = (props : NewItemDrawerProps) => {

  const [newItem, setNewItem] = useState<InventoryItem>({
    pk: 0,
    item_name : "",
    stock_count : 0,
    minimum_count : 0,
    category : ""
  });
  
  // Function that will update our InventoryItem object any time a form is changed by the user
  const handleNewItemChange = (name: string, value: string | number | null) => {
    setNewItem({ ...newItem, [name]: value ?? '' });
  };

  return (
    <>
      <Drawer position="right" opened={props.opened} onClose={props.close} title="Edit Inventory Item">
        <TextInput
          label="Item Name"
          name = "item_name"
          placeholder="Set Item Name"
          value ={newItem.item_name}
          onChange={(e) => handleNewItemChange("item_name", e.target.value)}
        />
        <NumberInput
          label="Item Count"
          placeholder="Set Current Count"
          name="stock_count"
          min={0}
          max={1000}
          value ={newItem.stock_count}
          onChange={(e) => handleNewItemChange("stock_count", e)}
        />      
        <NumberInput
          label="Edit Minimum Item Count"
          name = "minimum_count"
          placeholder="Set Minimum Count Needed"
          min={0}
          max={1000}
          value ={newItem.minimum_count}
          onChange={(e) => handleNewItemChange("minimum_count", e)}
        />
        <Select
          label="Item Category"
          placeholder="Pick value"
          name= "category"
          data={['Paper Product', 'Office Supplies', 'PPE', 'Toiletries']}
          value ={newItem.category}
          onChange={(e) => handleNewItemChange("category", e)}
        />
        <Button onClick={(_) => {props.setNewItem(newItem); props.close()}}>Add New Item</Button>
      </Drawer>
    </>
  );
  // Removing location for now
        // <Select
        //   label="Location"
        //   placeholder="Pick Location"
        //   data={["Bozeman", "Livingston"]}
        //   value ={props.newItem.stock_count}
        //   onChange={(e) => handleNewItemChange("stock_count", e)}
        // /> 
}

export default NewItemDrawer
