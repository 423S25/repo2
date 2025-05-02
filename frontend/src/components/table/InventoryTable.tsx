import React, { useState,  useEffect, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, Button } from '@mantine/core';
import EditItemDrawer from './EditItemDrawer';
import InventoryItem from '../../types/InventoryItemType'; 
import NewItemDrawer from './NewItemDrawer';
import {Th } from './TableHeader';
import {
  IconSearch,
  IconDownload,
  IconPlus,
  IconBrandAppleNews,
  IconCategory,
} from '@tabler/icons-react'
import {
  keys,
  ScrollArea,
  Table,
  Menu,
  Text,
  TextInput,
} from '@mantine/core';
import DeleteInventoryItemModal from './DeleteItemModal';
import APIRequest from '../../api/request';
import { ItemReducerAction } from '../../pages/home';
import { baseURL } from '../../App';
import InventoryTableRows from './InventoryRow';
import HistoryModal from '../history/HistoryModal';
import { AuthContext } from '../../contexts/AuthContext';
import { notifications } from '@mantine/notifications';
import NewCategoryModal from '../category/NewCategoryModal';



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





interface TableSortProps {
  items : InventoryItem[];
  dispatchItemChange : React.ActionDispatch<[action : ItemReducerAction]>
  
}

export function TableSort( {items : items, dispatchItemChange : dispatchItemChange } : TableSortProps) {
  const [search, setSearch] = useState('');
  const context = useContext(AuthContext);

  const requester = new APIRequest(`${baseURL}/management/inventory/`);
  const [selectedItem , setSelectedItem] = useState<number>(0);
  const [deleteItem, setDeleteItem] = useState<number>(0);
  const [sortedData, setSortedData] = useState(items);
  const [sortBy, setSortBy] = useState<keyof InventoryItem | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(true);
  const [loading, setLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState<string[]>([]);

  // Function to set the new item and dispatch an update to the DOM
  const setNewItemForm = async (newItem : InventoryItem) => {
    try{
      
      const poster = new APIRequest(`${baseURL}/management/inventory/create/`);
      const response =await poster.post(newItem);
      // Make sure to update the primary key of the item so when updating or deleting the item the correct pk is sent in the request
      // This might throw an error for the typescipt linter but its fine
    // @ts-ignore
      newItem.id = response['id']

    }
    catch (err) {
      console.log(err);
      return;
    }
    finally{
      
    }
    dispatchItemChange({
      type : "add",
      item : newItem
    });
    notifications.show({
          title: 'Item Added!',
          message: 'Your Item was added successfully to the Table.',
    })
    setSortedData(sortData(items, { sortBy: sortBy, reversed: reverseSortDirection, search }));
  }

  const setUpdatedItem = (updatedItem : InventoryItem) => {
    try{
      console.log(updatedItem.id)
      const poster = new APIRequest(`${baseURL}/management/inventory/${updatedItem.id}/`);
      poster.put(updatedItem);
    }
    catch (err) {
      console.log(err)
    }
    finally{
    
    }
    dispatchItemChange({
      type : "update",
      item : updatedItem
    });
    notifications.show({
          title: 'Item Changed!',
          message: 'Your Item was updated successfully in the Table.',
    })
    setSortedData(sortData(items, { sortBy: sortBy, reversed: reverseSortDirection, search }));
  }

  const deleteItemReducer = (deleteItem : InventoryItem) => {
    
    try{
    
      const poster = new APIRequest(`${baseURL}/management/inventory/${deleteItem.id}/`);
      poster.delete({id : deleteItem.id});
    }
    catch (err) {
      console.log(err)
    }
    finally{
    
    }
    console.log(deleteItem)
    dispatchItemChange({
      type : "delete",
      item : deleteItem
    });
    notifications.show({
          title: 'Item Deleted!',
          message: 'Your Item was deleted successfully from the Table.',
    })
    setSortedData(sortData(items, { sortBy: sortBy, reversed: reverseSortDirection, search }));
  } 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await requester.get();
        dispatchItemChange({type : "set", "item" : json})
        setSortedData(items);
        setLoading(false);
      } catch (err) {
        console.log(err)
      } finally {
      }
    };

    fetchData();}
 ,[]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const requester = new APIRequest(`${baseURL}/management/inventory/category/`);
        const responseData = await requester.get();
        setCategories(responseData);
      }
      catch (err) {
        console.log(err)
      }
    }
    getCategories()
  }, [])

  // Automatically update sorted data when items change
  useEffect(() => {
    setSortedData(sortData(items, { sortBy, reversed: reverseSortDirection, search }));
  }, [items, sortBy, reverseSortDirection, search]);
  
  // Set of hooks to set and control if the drawers for adding and editing a new item are opened or closed
  const [editOpened, editDrawewrHandler] = useDisclosure(false);
  const [newOpened, newDrawerHandler] = useDisclosure(false);
  const [deleteOpened, deleteModalHandler] = useDisclosure(false);
  const [historyOpened, historyModalHandler] = useDisclosure(false);
  const [categoryOpened, categoryHandler] = useDisclosure(false);

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

  const downloadCSV = async () => {
    const requester = new APIRequest(`${baseURL}/management/inventory/csv/`);
    let response = await requester.get();
    const csvString = response['csv'];
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
    link.target = '_blank';
    link.setAttribute(
      'download',
      `HRDC-Current-Inventory.csv`,
    );

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    // @ts-ignore
    link.parentNode.removeChild(link);
  }
  const downloadReport = async () => {
    const requester = new APIRequest(`${baseURL}/management/inventory/report/`);
    let response = await requester.get({}, "csv");
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI(response);
    link.target = '_blank';
    link.setAttribute(
      'download',
      `HRDC-report.csv`,
    );

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    // @ts-ignore
    link.parentNode.removeChild(link);
  }

  const rows = InventoryTableRows(
                {sortedData:sortedData,
                setUpdatedItem : setUpdatedItem,
                setSelectedItem :setSelectedItem,
                setDeleteItem : setDeleteItem,
                openEditDrawer : editDrawewrHandler.open,
                openDeleteModal : deleteModalHandler.open,
                openHistoryModal : historyModalHandler.open}
                );

  return (
    <div className="p-4">
    {loading ? <p>Loading</p> : null}
    { !loading ? 
    <ScrollArea>
      <DeleteInventoryItemModal currentItem={items[deleteItem]} deleteItem={deleteItemReducer} opened={deleteOpened} close={deleteModalHandler.close}/>
      <EditItemDrawer updateItem={setUpdatedItem} categories={categories} position="right" opened={editOpened} close={editDrawewrHandler.close} open={editDrawewrHandler.open} currentItem={items[selectedItem]}/>
      <NewItemDrawer setNewItem={setNewItemForm} categories={categories} position="right" opened={newOpened} close={newDrawerHandler.close} open={newDrawerHandler.open} />
      <HistoryModal currentItem={items[deleteItem]} opened = {historyOpened} close={historyModalHandler.close}/>
      <NewCategoryModal opened={categoryOpened} close={categoryHandler.close} categories={categories} setCategories={setCategories} />
      <div className="flex flex-row items-top">
        <TextInput
          placeholder="Search by any field"
          mb="md"
          leftSection={<IconSearch size={16} stroke={1.5} />}
          value={search}
          className = "w-full"
          onChange={handleSearchChange}
        />
        {context?.user?.superuser  ?
          <ActionIcon variant="light" className ="ml-4" onClick={newDrawerHandler.open}>
            <IconPlus size={28} stroke={2}/>
          </ActionIcon>
         : null }
        <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button className="ml-4">Options</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Table Options</Menu.Label>
        <Menu.Item leftSection={<IconDownload size={14}  />} onClick={() => downloadCSV()}>
          Download CSV
        </Menu.Item>
        <Menu.Item onClick={() => downloadReport()} leftSection={<IconDownload size={14} />}>
          Download PDF Report
        </Menu.Item>
        <Menu.Item onClick={() => categoryHandler.open()} leftSection={<IconCategory size={14} />}>
          Add New Category
        </Menu.Item>
      </Menu.Dropdown>
        </Menu>
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
              sorted={sortBy === 'stock_count'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('stock_count')}
            >
            Count
            </Th>
            <Th
              sorted={sortBy === 'base_count'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('base_count')}
            >
              Base Count
            </Th>
            <Th
              sorted={sortBy === 'bulk_count'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('bulk_count')}
            >
              Bulk Count
            </Th>
            <Th
              sorted={sortBy === 'status'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('status')}
            >
            Status
            </Th>
            <Th
              sorted={sortBy === 'item_category'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('item_category')}
            >
            Category
            </Th>
            <Th
              sorted={sortBy === 'brand'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('brand')}
            >
            Brand
            </Th>
            <Th
              sorted={sortBy === 'donated'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('donated')}
            >
              Donated
            </Th>
            <Th
              sorted={sortBy === 'is_bulk'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('is_bulk')}
            >
              Bulk Item
            </Th>
            <Th
              sorted={sortBy === 'individual_cost'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('individual_cost')}
            >
            Item Price
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
              <Table.Td colSpan={10}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea> : null}
  </div>
  );
}
