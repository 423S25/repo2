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

interface ErrorObject {
  item_name : string;
  item_category : string;
}

/*
  Drawer element that only opens when a user wants to add a new
  inventory item and allows them to change that attribute. 
*/ 
const NewItemDrawer = (props : NewItemDrawerProps) => {
  const initialState : InventoryItem = {
            id : 0,
            item_name : "",
            stock_count : 0,
            base_count : 0,
            item_category : "",
            location : "",
            status : ""
  };
  const [newItem, setNewItem] = useState<InventoryItem>(initialState);
  const [errors, setErrors] = useState<Partial<ErrorObject>>({});


  const submitForm = () => {
    if (!validForm()){
      return;
    }
    props.setNewItem(newItem);
    resetForm();
    props.close();
  }

  const validForm = () : boolean => {
    let currentErrors : Partial<ErrorObject> = {};
    if (newItem.item_name == ""){
      currentErrors["item_name"] = "Item Name is required";
    }
    if (newItem.item_category == ""){
      currentErrors.item_category = "Category cannot be blank"
    }
    setErrors(currentErrors);
    const length : number = Object.keys(currentErrors).length;
    return length === 0;
  }
  
  // Function that will update our InventoryItem object any time a form is changed by the user
  const handleNewItemChange = (name: string, value: string | number | null) => {
    setNewItem({ ...newItem, [name]: value ?? '' });
  };


  // If the user ever submits the item make sure to reset the current form to be blank
  const resetForm = ()=>{
    setNewItem(initialState)
  }

  return (
    <>
      <Drawer position="right" opened={props.opened} onClose={props.close} title="Add New Inventory Item">
        <TextInput
          label="Item Name"
          name = "item_name"
          placeholder="Set Item Name"
          error={errors.item_name}
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
          name = "base_count"
          placeholder="Set Minimum Count Needed"
          min={0}
          max={1000}
          value ={newItem.base_count}
          onChange={(e) => handleNewItemChange("base_count", e)}
        />
        <Select
          label="Location"
          name="location"
          placeholder="Pick Location"
          data={["Bozeman", "Livingston"]}
          value ={newItem.location}
          onChange={(e) => handleNewItemChange("location", e)}
        /> 
        <Select
          label="Item Category"
          placeholder="Pick value"
          name= "category"
          data={['Paper Product', 'Office Supplies', 'PPE', 'Toiletries']}
          value ={newItem.item_category}
          error={errors.item_category}
          onChange={(e) => handleNewItemChange("item_category", e)}
        />
        <Button onClick={(_) => {submitForm()}}>Add New Item</Button>
      </Drawer>
    </>
  );
  // Removing location for now
}

export default NewItemDrawer
