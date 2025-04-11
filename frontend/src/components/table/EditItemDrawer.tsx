import { useEffect, useState } from 'react'
import { Drawer,
        Button,
        TextInput,
        Text,
        Select,
        NumberInput, 
        SegmentedControl} from '@mantine/core';
import InventoryItem from '../../types/InventoryItemType';
import ErrorObject from '../../types/FormError';


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
  const [item, setItem] = useState<InventoryItem>( props.currentItem ?? {
    pk: 0,
    item_name: "",
    stock_count: 0,
    base_count: 0,
    item_category: "",
    individual_cost : 0,
    donated : false,
    is_bulk : false
  });
  const [errors, setErrors] = useState<Partial<ErrorObject>>({});
  
  // Function that will update our InventoryItem object any time a form is changed by the user
  const handleNewItemChange = (name: string, value: string | number | boolean | null) => {
    console.log(value)
    setItem({ ...item, [name]: value ?? '' });
  };

  const submitForm = () => {

    if (!validForm()){
      return;
    }
    props.updateItem(item);
    props.close();
  }

  const validForm = () : boolean => {
    let currentErrors : Partial<ErrorObject> = {};
    if (item.item_name == ""){
      currentErrors["item_name"] = "Item Name is required";
    }
    if (item.brand== ""){
      currentErrors.brand= "Brand Name is required";
    }
    if (item.item_category == ""){
      currentErrors.item_category = "Category cannot be blank"
    }
    if (item.individual_cost == 0){
      currentErrors.individual_cost= "Item Cost cannot be blank"
    }
    setErrors(currentErrors);
    const length : number = Object.keys(currentErrors).length;
    return length === 0;
  }


  useEffect(() => {
    if (props.currentItem) {
    setItem(props.currentItem);
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
        <div className="flex flex-row my-2 justify-around">
          <div>
            <Text size="sm" fw={500} mb={3}>
              Donated?
            </Text>
            <SegmentedControl
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
              value={String(item.donated)}
              name = "donated"
              onChange={(e) => handleNewItemChange("donated", e)}
            />
          </div>
          <div>
            <Text size="sm" fw={500} mb={3}>
              Bulk Item?
            </Text>
            <SegmentedControl
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
              name="is_donated"
              value={String(item.is_bulk)}
              onChange={(e) => handleNewItemChange("is_bulk", e)}
            />
          </div>
        </div>
        <NumberInput
          label="Edit Item Count"
          placeholder="Set Current Count"
          name = "stock_count"
          min={0}
          max={1000}
          value ={item.stock_count}
          onChange={(e) => handleNewItemChange("stock_count", e)}
        />      
        <NumberInput
          label="Edit Minimum Item Count"
          placeholder="Set Minimum Count Needed"
          min={0}
          name=""
          max={1000}
          value ={item.base_count}
          onChange={(e) => handleNewItemChange("base_count", e)}
        />      
        <Select
          label="Item Category"
          placeholder="Pick value"
          name= "category"
          data={['Paper Product', 'Office Supplies', 'PPE', 'Toiletries']}
          value ={item.item_category}
          error={errors.item_category}
          onChange={(e) => handleNewItemChange("item_category", e)}
        />
        <TextInput
          label="Edit Brand Name"
          name = "brand"
          placeholder="Change to new brand"
          value ={item.brand}
          error={errors.brand}
          onChange={(e) => handleNewItemChange("brand", e.target.value)}
        />
        <Button className="mt-4" onClick={() => {
          submitForm();
        }}>Update Item</Button>
      </Drawer>
    </>
  );
}

export default EditItemDrawer
