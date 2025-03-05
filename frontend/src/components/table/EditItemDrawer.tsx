import { Drawer,
        Input,
        NumberInput } from '@mantine/core';


interface EditItemDrawerProps {
  item_name : string,
  item_count : number,
  min_count : number,
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

  return (
    <>
      <Drawer position="right" opened={props.opened} onClose={props.close} title="Edit Inventory Item">
        <Input.Wrapper label="Edit Item Name" description="Change the Items Name">
          <Input placeholder="Set New Item Name" />
        </Input.Wrapper>
        <NumberInput
          label="Edit Item Count"
          placeholder="Set Current Count"
          min={0}
          max={100000000}
        />      
        <NumberInput
          label="Edit Minimum Item Count"
          placeholder="Set Minimum Count Needed"
          min={0}
          max={100000000}
        />      
      </Drawer>
    </>
  );
}

export default EditItemDrawer
