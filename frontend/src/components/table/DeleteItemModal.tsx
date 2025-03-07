import { Alert, Button } from '@mantine/core';
// import { modals } from "@mantine/modals";
import { IconAlertCircle } from "@tabler/icons-react";
import InventoryItem from '../../types/InventoryItemType';
import { Modal } from '@mantine/core';
import { useEffect, useState } from 'react';


interface DeleteModalProps {
  deleteItem : (item : InventoryItem) => void; 
  currentItem : InventoryItem;
  opened : boolean,
  close : () => void,
}

/*
Delete Inventory Item Modal element that deletes a given item from the list of all items and
warns users about their action
*/
const DeleteInventoryItemModal = (props : DeleteModalProps) => {
  const [item, setItem] = useState(props.currentItem);
  useEffect(() => {
    setItem(props.currentItem)
  }, [props.currentItem])
  return (
    <>
      <Modal opened={props.opened} onClose={props.close} title="Delete Item">
        <div className ="flex flex-col">
            <Alert  variant="transparent" color="orange" title="Warning" icon={<IconAlertCircle/>}>

              Are you sure? By deleting this item all related info and metrics related to this item will also be deleted.
            </Alert>
        </div>
        <div className="flex flex-row">
          <Button variant="outline" className="mr-2">Close</Button>
          <Button color="red" onClick={() => {
            props.deleteItem(item);
            props.close();
          }}>Confirm</Button>
        </div>
      </Modal>
    </>
  )
}
// const DeleteInventoryItemModal = (props : DeleteModalProps) => modals.openConfirmModal({
//   title: 'Delete Item',
//   centered: true,
//   children: (
//     <>
//       <div className ="flex flex-col">
//           <Alert  variant="transparent" color="orange" title="Warning" icon={<IconAlertCircle/>}>

//             Are you sure? By deleting this item all related info and metrics related to this item will also be deleted.
//           </Alert>
//       </div>
//     </>
//   ),
//   labels: { confirm: 'Delete Item', cancel: "Cancel" },
//   confirmProps: { color: 'red' },
//   //TODO need to add function to request to make request to delete item from the api
//   onCancel: () => console.log('Cancel'),
//   onConfirm: () => {() => props.deleteItem()},
// });

export default DeleteInventoryItemModal
