import { IconDots, IconEdit, IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import InventoryItem from "../../types/InventoryItemType";
import {
  Table,
  Button,
  Group,
  ActionIcon} from "@mantine/core"
import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
  

interface ComponentTableRowsType {
  sortedData : InventoryItem[];
  setUpdatedItem : (updatedItem : InventoryItem) => void;
  setSelectedItem : React.Dispatch<React.SetStateAction<number>>;
  setDeleteItem : React.Dispatch<React.SetStateAction<number>>;
  openEditDrawer : () => void;
  openDeleteModal : () => void;
  openHistoryModal : () => void;
}


const InventoryTableRows = ({sortedData, setUpdatedItem, setSelectedItem, setDeleteItem, openEditDrawer, openDeleteModal, openHistoryModal} : ComponentTableRowsType)  => {
    
  const context = useContext(AuthContext);
  const superuser= context?.user?.superuser;
  const staff = context?.user?.staff;
  return sortedData.map((row, index) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.item_name}</Table.Td>
      <Table.Td>
        <Group gap="xs" className="flex flex-row" wrap="nowrap" >
          {row.stock_count}
          {staff || superuser ? 
          <Button
            size="compact-xs"
            onClick={() => {
              row.stock_count -= 1;
              setUpdatedItem(row);
            }}
            variant="light"
            color="red"
          >
            <IconMinus size={10} />
          </Button>
          : null}
          {superuser ? 
          <Button
            size="compact-xs"
            onClick={() => {
              row.stock_count += 1;
              setUpdatedItem(row);
            }}
            variant="light"
            color="green"
          >
            <IconPlus size={10} />
          </Button>
          : null}
        </Group>
      </Table.Td>
      <Table.Td>{row.base_count}</Table.Td>
      <Table.Td>{row.status}</Table.Td>
      <Table.Td>{row.item_category}</Table.Td>
      <Table.Td>{row.item_category}</Table.Td>
      <td>
        {superuser ?
          <>
          <ActionIcon variant="light">
            <IconEdit size={20} stroke={1.5} onClick={() => {
              openEditDrawer()
              setSelectedItem(index);
            }
          }

              />
          </ActionIcon>
          <ActionIcon variant="light" color="red" className ="mx-4" onClick={() => {
              openDeleteModal()
              setDeleteItem(index);
          }}>
            <IconTrash size={20} stroke={1.5}/>
          </ActionIcon>
          <ActionIcon variant="light" color="red" className ="mx-4" onClick={() => {
              openHistoryModal();
              setDeleteItem(index);
          }}>
            <IconDots size={20} stroke={1.5}/>
          </ActionIcon>
          </>
        : null}
      </td>
    </Table.Tr>
  ));
}


export default InventoryTableRows 
