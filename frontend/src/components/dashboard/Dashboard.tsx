import {
  Container,
  Text,
  Group,
  Table,
  Title,

  Badge,
  Card,
  SimpleGrid,
} from "@mantine/core";
import InventoryItem from "../../types/InventoryItemType";
import classes from "./Dashboard.module.css"
import {  IconArrowDownRight, IconArrowUpRight, IconCoin } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import APIRequest from "../../api/request";
import { baseURL } from "../../App";

interface DashBoardProps {
  items : InventoryItem[];
  
}


// const icons = {
//   user: IconUserPlus,
//   discount: IconDiscount2,
//   receipt: IconReceipt2,
//   coin: IconCoin,
// };


interface StatInterface {
  title : string;
  value : number;
  diff : number;
}


const StatElement = ( stat : StatInterface) => {
    // const Icon = icons[stat.icon];
    const Icon = IconCoin;
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight: IconArrowDownRight;

    return (
      <Card shadow="sm" withBorder p="md" radius="md" key={stat.title}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size={22} stroke={1.5} />
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text c={stat.diff > 0 ? 'teal' : 'red'} fz="sm" fw={500} className={classes.diff}>
            <span>{stat.diff}%</span>
            <DiffIcon size={16} stroke={1.5} />
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          Compared to previous month
        </Text>
      </Card>
    );
}

const Dashboard = ( {items : items} : DashBoardProps) => {
  const totalItems = items.length;
  const lowStockItems = items.filter(
    (item) => item.stock_count < item.base_count
  ).length;
  const values : StatInterface[] = [
    {
      "title" : "Total Items",
      "value" : totalItems,
      "diff" : 0
    },
    {
      "title" : "Low Count Items",
      "value" : lowStockItems,
      "diff" : 0
    }
  ]
  const [statValues, setStats] = useState<StatInterface[]>(values);

  useEffect(() => {
    const fetchData = async () =>{
      const requester = new APIRequest(`${baseURL}/management/inventory/dashboard/summary`);
      const response = await requester.get()
      const stat = response as StatInterface[];
      setStats(values.concat(stat));
      console.log(statValues)
    }
    fetchData();
  }, [])



  const recentItems = items.slice(-5).reverse();
  const stats = statValues.map((e : StatInterface) =>
    (
      <StatElement title={e.title} value={e.value} diff={e.diff}/>
    )
  )

  return (
    <Container>
      <Title order={2} mb="md">
        Inventory Dashboard
      </Title>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>
        {stats}
      </SimpleGrid>

      <Group mt="xl" mb="md">
        <Title order={3}>Recent Items</Title>
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Stock</Table.Th>
            <Table.Th>Base</Table.Th>
            <Table.Th>Brand</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {recentItems.map((item) => (
            <Table.Tr key={item.id}>
              <Table.Td> {item.item_name}</Table.Td>
              <Table.Td>{item.stock_count}</Table.Td>
              <Table.Td>{item.base_count}</Table.Td>
              <Table.Td>{item.brand}</Table.Td>
              <Table.Td>{item.item_category}</Table.Td>
              <Table.Td>
                <Badge color={item.stock_count < item.base_count ? "red" : "green"}>
                  {item.status}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  );
};

export default Dashboard;
