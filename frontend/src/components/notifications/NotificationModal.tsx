import { Alert, Button } from '@mantine/core';
// import { modals } from "@mantine/modals";
import { IconAlertCircle } from "@tabler/icons-react";
import { Modal } from '@mantine/core';


interface NotificationModalProps {
  opened : boolean,
  close : () => void,
}


const NotificationModal = (props : NotificationModalProps) => {
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
        </div>
      </Modal>
    </>
  )
}


export default NotificationModal
