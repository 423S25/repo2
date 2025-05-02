import { IconDots, IconEdit, IconHistory,  IconTrash } from "@tabler/icons-react";
import InventoryItem from "../../types/InventoryItemType";
import {
  Table,
  Group,
  ActionIcon,
  Menu,
  NumberInput} from "@mantine/core"
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
          
          {superuser || staff ? 
              <NumberInput value={row.stock_count} onChange={(e) => {
                row.stock_count = Number(e);
                setUpdatedItem(row)
              }}/> : <div>{row.stock_count}</div>}
        </Group>
      </Table.Td>
      <Table.Td>{row.base_count}</Table.Td>
      {row.is_bulk ? <Table.Td>{row.bulk_count}</Table.Td> : <Table.Td>NA</Table.Td>}
      <Table.Td>{row.status}</Table.Td>
      <Table.Td>{row.item_category}</Table.Td>
      <Table.Td>{row.brand}</Table.Td>
      <Table.Td>{row.donated ? "Yes" : "No"}</Table.Td>
      <Table.Td>{row.is_bulk ? "Yes" : "No"}</Table.Td>
      <Table.Td>${row.individual_cost}</Table.Td>

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
          <Menu>
            <Menu.Target>
              <ActionIcon variant="light" className ="mx-4" >
                <IconDots size={20} stroke={1.5}/>
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<IconHistory size={20} stroke={1.5} />}  onClick={() => {
                openHistoryModal();
                setDeleteItem(index);
            }}>
              View Item's History
              </Menu.Item>

              <Menu.Item className="red" leftSection={<IconTrash  size={20} stroke={1.5} color="red"/>} onClick={() => {
                openDeleteModal()
                setDeleteItem(index);
            }}>
              Delete Item
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          </>
        : null}
      </td>
    </Table.Tr>
  ));
}


export default InventoryTableRows 
