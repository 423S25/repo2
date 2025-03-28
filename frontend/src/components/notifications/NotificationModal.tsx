import { Alert, Button } from '@mantine/core';
// import { modals } from "@mantine/modals";
import { IconAlertCircle } from "@tabler/icons-react";
import { Modal } from '@mantine/core';
import { TableDataContext } from '../../pages/home';
import { useContext } from 'react';


interface NotificationModalProps {
  opened : boolean,
  close : () => void,
}


const NotificationModal = (props : NotificationModalProps) => {
  const data = useContext(TableDataContext);
  let displayData = data.filter((e) => e.status !== "Good");
  return (
    <>
      <Modal opened={props.opened} onClose={props.close} title="Delete Item">
      </Modal>
    </>
  )
}


export default NotificationModal
