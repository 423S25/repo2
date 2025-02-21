import { Alert } from '@mantine/core';
import { modals } from "@mantine/modals";
import { IconAlertCircle } from "@tabler/icons-react";


const DeleteInventoryItemModal = () => modals.openConfirmModal({
  title: 'Delete Item',
  centered: true,
  children: (
    <>
      <div className ="flex flex-col">
          <Alert  variant="transparent" color="orange" title="Warning" icon={<IconAlertCircle/>}>

            Are you sure? By deleting this item all related info and metrics related to this item will also be deleted.
          </Alert>
      </div>
    </>
  ),
  labels: { confirm: 'Delete Item', cancel: "Cancel" },
  confirmProps: { color: 'red' },
  onCancel: () => console.log('Cancel'),
  onConfirm: () => console.log('Confirmed'),
});

export default DeleteInventoryItemModal
