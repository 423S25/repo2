import { Drawer} from '@mantine/core';


interface EditItemDrawerProps {
  item_name : string,
  item_count : number,
  min_count : number,
  opened : boolean,
  open : () => void,
  close : () => void
}

/*
  Drawer element that only opens when a user wants to edit some of the current information about an
  inventory item
*/ 
const EditItemDrawer = (props : EditItemDrawerProps) => {

  return (
    <>
      <Drawer opened={props.opened} onClose={props.close} title="Authentication">
      </Drawer>
    </>
  );
}

export default EditItemDrawer
