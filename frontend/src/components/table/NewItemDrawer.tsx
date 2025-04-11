import { Drawer,
          Select,
          Text,
          TextInput,
          NumberInput, 
          Button,
          SegmentedControl} from '@mantine/core';
import InventoryItem from '../../types/InventoryItemType';
import { useState } from 'react'
import ErrorObject from '../../types/FormError';


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
  const initialState : InventoryItem = {
            id : 0,
            item_name : "",
            stock_count : 0,
            base_count : 0,
            bulk_count: 0,
            item_category : "",
            donated :  true,
            is_bulk : true,
            individual_cost: 0,
            bulk_cost : 0,
            brand : "",
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
    if (newItem.brand== ""){
      currentErrors.brand = "Brand Name is required";
    }
    if (newItem.item_category == ""){
      currentErrors.item_category = "Category cannot be blank"
    }
    if (newItem.individual_cost == 0){
      currentErrors.individual_cost= "Item Cost cannot be blank"
    }
    setErrors(currentErrors);
    const length : number = Object.keys(currentErrors).length;
    return length === 0;
  }
  
  // Function that will update our InventoryItem object any time a form is changed by the user
  const handleNewItemChange = (name: string, value: string | number | boolean | null) => {
    if (name == "is_bulk" || name==="donated"){
      value = value == "true"
    }
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
        
        <div className="flex flex-row my-2 justify-around">
          <div>
            <Text size="sm" fw={500} mb={3}>
              Donated?
            </Text>
            <SegmentedControl
              name = "donated"
              data={[
                {
                  value: "true",
                  label: 'Yes',
                },
                {
                  value: 'false',
                  label: 'No',
                },
              ]}
              onChange={(e) => handleNewItemChange("donated", e)}
            />
          </div>
          <div>
            <Text size="sm" fw={500} mb={3}>
              Bulk Item?
            </Text>
            <SegmentedControl
              name="is_bulk"
              data={[
                {
                  value: "true",
                  label: 'Yes',
                },
                {
                  value: 'false',
                  label: 'No',
                },
              ]}
              onChange={(e) => handleNewItemChange("is_bulk", e)}
            />
          </div>
        </div>
        {newItem.is_bulk ?
          <NumberInput
            label="Bulk Unit Count"
            placeholder="Set Current Count"
            name="bulk_count"
            min={0}
            max={1000}
            value ={newItem.stock_count}
            onChange={(e) => handleNewItemChange("bulk_count", e)}
          />      
         : null}
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
          label="Minimum Item Count"
          name = "base_count"
          placeholder="Set Minimum Count Needed"
          min={0}
          max={1000}
          value ={newItem.base_count}
          onChange={(e) => handleNewItemChange("base_count", e)}
        />
        <NumberInput
          label="Item Cost"
          placeholder="How much does an individual or item in bulk cost?"
          min={0}
          name="cost"
          max={10000}
          prefix="$"
          error={errors.individual_cost}
          onChange={(e) => handleNewItemChange("individual_cost", e)}
        />
        <div className="flex flex-row">
        <Select
          className="mr-2"
          label="Item Category"
          placeholder="Pick value"
          name= "category"
          data={['Paper Product', 'Office Supplies', 'PPE', 'Toiletries']}
          value ={newItem.item_category}
          error={errors.item_category}
          onChange={(e) => handleNewItemChange("item_category", e)}
        />
        <TextInput
          label="Edit Brand Name"
          name = "brand"
          placeholder="Change to new brand"
          value ={newItem.brand}
          error={errors.brand}
          onChange={(e) => handleNewItemChange("brand", e.target.value)}
        />
        </div>
        <Button className="mt-4" onClick={(_) => {submitForm()}}>Add New Item</Button>
      </Drawer>
    </>
  );
  // Removing location for now
}

export default NewItemDrawer
