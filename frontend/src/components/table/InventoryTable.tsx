import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon } from '@mantine/core';
import EditItemDrawer from './EditItemDrawer';
import InventoryItem from '../../types/InventoryItemType'; 
import NewItemDrawer from './NewItemDrawer';
import {Th } from './TableHeader';
import {
  IconEdit,
  IconTrash,
  IconSearch,
  IconPlus
} from '@tabler/icons-react'
import {
  keys,
  ScrollArea,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import DeleteInventoryItemModal from './DeleteItemModal';


// Return the list of items that match the search query stirng given from our list of InventoryItems
function filterData(data: InventoryItem[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => String(item[key]).toLowerCase().includes(query))
  );
}

function sortData(
  data: InventoryItem[],
  payload: { sortBy: keyof InventoryItem | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return String(b[sortBy]).localeCompare(String(a[sortBy]));
      }

      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    }),
    payload.search
  );
}

const data = [
  {
    item_name : "Toilet Paper",
    minimum_count : 50,
    stock_count : 100,
    category : "Paper Product"
  },
  {
    item_name : "Shampoo",
    min_count : 20,
    stock_count : 25,
    category : "Toiletries"
  },
  {
    item_name : "Hand Soap",
    min_count : 10,
    stock_count : 4,
    category : "Toiletries"
  },
  {
    item_name : "Towels",
    min_count : 15,
    stock_count : 9,
    category : "Toiletries"
  },
  {
    item_name : "Washcloths",
    min_count : 30,
    stock_count : 31,
    category : "Toiletries"
  }
];

export function TableSort() {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof InventoryItem | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  // const [itemList, setItemList] = useState(data);
  
  // Set of hooks to set and control if the drawers for adding and editing a new item are opened or closed
  const [editOpened, editDrawewrHandler] = useDisclosure(false);
  const [newOpened, newDrawerHandler] = useDisclosure(false);

  const setSorting = (field: keyof InventoryItem) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };


  // if the search fields has user input this function will be called to set the list of items to display using setSearch
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.item_name}>
      <Table.Td>{row.item_name}</Table.Td>
      <Table.Td>{row.minimum_count}</Table.Td>
      <Table.Td>{row.stock_count}</Table.Td>
      <td>
        <ActionIcon variant="light">
          <IconEdit size={20} stroke={1.5} onClick={editDrawewrHandler.open} />
        </ActionIcon>
        <ActionIcon variant="light" color="red" className ="mx-4" onClick={DeleteInventoryItemModal}>
          <IconTrash  size={20} stroke={1.5}/>
        </ActionIcon>
      </td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <EditItemDrawer position="right" opened={editOpened} close={editDrawewrHandler.close} open={editDrawewrHandler.open} item_name={'Toilet Paper'} item_count={10} min_count={5}/>
      <NewItemDrawer position="right" opened={newOpened} close={newDrawerHandler.close} open={newDrawerHandler.open} />
      <div className="flex flex-row items-top">
        <TextInput
          placeholder="Search by any field"
          mb="md"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          value={search}
          className = "w-full"
          onChange={handleSearchChange}
        />
        <ActionIcon variant="light" className ="mx-4" onClick={newDrawerHandler.open}>
          <IconPlus size={28} stroke={2}/>
        </ActionIcon>
      </div>
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            <Th
              sorted={sortBy === 'item_name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('item_name')}
            >
              Item Name
            </Th>
            <Th
              sorted={sortBy === 'minimum_count'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('minimum_count')}
            >
              Minimum Count
            </Th>
            <Th
              sorted={sortBy === 'stock_count'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('stock_count')}
            >
            Count
            </Th>
            <Th
              sorted={sortBy === 'category'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('category')}
            >
            Category
            </Th>
          <th className = "max-w-24 w-24">

          </th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={Object.keys(data[0]).length}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
