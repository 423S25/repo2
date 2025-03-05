import { Drawer,
          Select,
          TextInput,
          NumberInput } from '@mantine/core';


interface NewItemDrawerProps {
  position : string,
  opened : boolean,
  open : () => void,
  close : () => void, 
}

/*
  Drawer element that only opens when a user wants to add a new
  inventory item
*/ 
const NewItemDrawer = (props : NewItemDrawerProps) => {

  return (
    <>
      <Drawer position="right" opened={props.opened} onClose={props.close} title="Edit Inventory Item">
        <TextInput
          label="Item Name"
          placeholder="Set Item Name"
        />
        <NumberInput
          label="Item Count"
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
        <Select
          label="Item Category"
          placeholder="Pick value"
          data={['Paper Product', 'Office Supplies', 'PPE', 'Toiletries']}
        />
        <Select
          label="Location"
          placeholder="Pick Location"
          data={["Bozeman", "Livingston"]}
        />
      </Drawer>
    </>
  );
}

export default NewItemDrawer
