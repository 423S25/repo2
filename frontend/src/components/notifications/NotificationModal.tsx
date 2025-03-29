// import { modals } from "@mantine/modals";
import { List, Modal } from '@mantine/core';
import { TableDataContext } from '../../pages/home';
import { useContext } from 'react';
import InventoryItem from '../../types/InventoryItemType';


interface NotificationModalProps {
  opened : boolean,
  close : () => void,
}


const NotificationModal = (props : NotificationModalProps) => {
  const data = useContext(TableDataContext);
  let displayData = data.filter((e) => e.status !== "Good");
  const rows = displayData.map((e :InventoryItem) => (
         <List.Item>{e.item_name} is running {e.status} on supply.</List.Item>
  ));
  const emptyNotification = (
    <div>
      No Notifications
    </div>
  )
  return (
    <>
      <Modal opened={props.opened} onClose={props.close} title="Delete Item">
        <List>
          {displayData.length > 0 ? rows : emptyNotification}
        </List>
      </Modal>
    </>
  )
}


export default NotificationModal
