import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
import EditItemDrawer from './EditItemDrawer';
import {
  IconEdit,
  IconTrash
} from '@tabler/icons-react'
import {
  Center,
  Group,
  keys,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import classes from './InventoryTable.module.css';
import DeleteInventoryItemModal from './DeleteItemModal';


// Define a ts interface that contains the datatypes and schema for the return data for each inventory item
interface RowData {
  item_name: string;
  min_count: number;
  count: number;
}

// Define interface for the props that can be passed to our table header
interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}


// Custom table header element that allows for sorting each column 
function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => String(item[key]).toLowerCase().includes(query))
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
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
    min_count : 50,
    count : 100,
  },
  {
    item_name : "Shampoo",
    min_count : 20,
    count : 25,
  },
  {
    item_name : "Hand Soap",
    min_count : 10,
    count : 4,
  },
  {
    item_name : "Towels",
    min_count : 15,
    count : 9,
  },
  {
    item_name : "Washcloths",
    min_count : 30,
    count : 31,
  }
];

export function TableSort() {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.item_name}>
      <Table.Td>{row.item_name}</Table.Td>
      <Table.Td>{row.min_count}</Table.Td>
      <Table.Td>{row.count}</Table.Td>
      <td>
        <ActionIcon variant="light">
          <IconEdit size={20} stroke={1.5} onClick={open} />
        </ActionIcon>
        <ActionIcon variant="light" color="red" className ="mx-4" onClick={DeleteInventoryItemModal}>
          <IconTrash  size={20} stroke={1.5}/>
        </ActionIcon>
      </td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <EditItemDrawer opened={opened} close={close} open={open} item_name={'Toilet Paper'} item_count={10} min_count={5}/>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
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
              sorted={sortBy === 'min_count'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('min_count')}
            >
              Minimum Count
            </Th>
            <Th
              sorted={sortBy === 'count'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('count')}
            >
            Count
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
