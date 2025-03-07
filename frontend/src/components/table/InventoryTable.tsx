import { useState, useReducer, useEffect } from 'react';
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


//List of mock data to simulate queries results from the backend
const data = [
  {
    pk : 1,
    item_name : "Toilet Paper",
    minimum_count : 50,
    stock_count : 100,
    category : "Paper Product"
  },
  {
    pk : 2,
    item_name : "Shampoo",
    minimum_count : 20,
    stock_count : 25,
    category : "Toiletries"
  },
  {
    pk : 3,
    item_name : "Hand Soap",
    minimum_count : 10,
    stock_count : 4,
    category : "Toiletries"
  },
  {
    pk : 4,
    item_name : "Towels",
    minimum_count : 15,
    stock_count : 9,
    category : "Toiletries"
  },
  {
    pk : 5,
    item_name : "Washcloths",
    minimum_count : 30,
    stock_count : 31,
    category : "Toiletries"
  }
];


interface ItemReducerAction {
  item : InventoryItem;
  type : string;
}


const inventoryItemReducer = (items : Array<InventoryItem>, action : ItemReducerAction) => {
  switch (action.type) {
    case "add": {
      return [
        ...items,
        {
          ...action.item
          // pk : action.item.pk,
          // item_name : action.item.item_name,
          // stock_count : action.item.stock_count,
          // minimum_count : action.item.minimum_count,
          // category: action.item.category,
        }
      ];
    }
    case "update": {
      return items.map((item) =>
        item.pk === action.item.pk ? { ...item, ...action.item } : item
      );
    }

    case "delete": {
      return items.filter((item) => item.pk !== action.item.pk);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}


export function TableSort() {
  const [search, setSearch] = useState('');

  const [selectedItem , setSelectedItem] = useState<number>(0);
  const [deleteItem, setDeleteItem] = useState<number>(0);
  const [items, dispatchItemChange] = useReducer(inventoryItemReducer, data);
  const [sortedData, setSortedData] = useState(items);
  const [sortBy, setSortBy] = useState<keyof InventoryItem | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  // Function to set the new item and dispatch an update to the DOM
  const setNewItemForm = (newItem : InventoryItem) => {
    dispatchItemChange({
      type : "add",
      item : newItem
    });
    setSortedData(sortData(items, { sortBy: sortBy, reversed: reverseSortDirection, search }));
  }

  const setUpdatedItem = (updatedItem : InventoryItem) => {
    dispatchItemChange({
      type : "update",
      item : updatedItem
    });
    setSortedData(sortData(items, { sortBy: sortBy, reversed: reverseSortDirection, search }));
  }

  const deleteItemReducer = (deleteItem : InventoryItem) => {
    dispatchItemChange({
      type : "delete",
      item : deleteItem
    })
    setSortedData(sortData(items, { sortBy: sortBy, reversed: reverseSortDirection, search }));
  } 

  // Automatically update sorted data when items change
  useEffect(() => {
    setSortedData(sortData(items, { sortBy, reversed: reverseSortDirection, search }));
  }, [items, sortBy, reverseSortDirection, search]);
  
  // Set of hooks to set and control if the drawers for adding and editing a new item are opened or closed
  const [editOpened, editDrawewrHandler] = useDisclosure(false);
  const [newOpened, newDrawerHandler] = useDisclosure(false);
  const [deleteOpened, deleteModalHandler] = useDisclosure(false);

  const setSorting = (field: keyof InventoryItem) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(sortedData, { sortBy: field, reversed, search }));
  };


  // if the search fields has user input this function will be called to set the list of items to display using setSearch
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(items, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = sortedData.map((row, index) => (
    <Table.Tr key={row.item_name}>
      <Table.Td>{row.item_name}</Table.Td>
      <Table.Td>{row.minimum_count}</Table.Td>
      <Table.Td>{row.stock_count}</Table.Td>
      <Table.Td>{row.category}</Table.Td>
      <td>
        <ActionIcon variant="light">
          <IconEdit size={20} stroke={1.5} onClick={() => {
            editDrawewrHandler.open();
            setSelectedItem(index);
          }
        }

            />
        </ActionIcon>
        <ActionIcon variant="light" color="red" className ="mx-4" onClick={() => {
            deleteModalHandler.open()
            setDeleteItem(index);
        }}>
          <IconTrash  size={20} stroke={1.5}/>
        </ActionIcon>
      </td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <DeleteInventoryItemModal currentItem={items[deleteItem]} deleteItem={deleteItemReducer} opened={deleteOpened} close={deleteModalHandler.close}/>
      <EditItemDrawer updateItem={setUpdatedItem} position="right" opened={editOpened} close={editDrawewrHandler.close} open={editDrawewrHandler.open} currentItem={items[selectedItem]}/>
      <NewItemDrawer setNewItem={setNewItemForm} position="right" opened={newOpened} close={newDrawerHandler.close} open={newDrawerHandler.open} />
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
