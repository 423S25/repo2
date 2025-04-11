import {
  Container,
  Grid,
  Text,
  Group,
  Paper,
  Table,
  Title,
  Badge,
} from "@mantine/core";
import InventoryItem from "../../types/InventoryItemType";
import classes from "./Dashboard.module.css"
import {  IconArrowDownRight, IconArrowUpRight, IconCoin, IconDiscount2, IconReceipt2, IconUserPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import APIRequest from "../../api/request";
import { baseURL } from "../../App";

interface DashBoardProps {
  items : InventoryItem[];
  
}


const icons = {
  user: IconUserPlus,
  discount: IconDiscount2,
  receipt: IconReceipt2,
  coin: IconCoin,
};


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
      <Paper withBorder p="md" radius="md" key={stat.title}>
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
      </Paper>
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

      <Grid>
        {stats}
      </Grid>

      <Group mt="xl" mb="md">
        <Title order={3}>Recent Items</Title>
      </Group>

      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Base</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {recentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.item_name}</td>
              <td>{item.stock_count}</td>
              <td>{item.base_count}</td>
              <td>{item.brand}</td>
              <td>{item.item_category}</td>
              <td>
                <Badge color={item.stock_count < item.base_count ? "red" : "green"}>
                  {item.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Dashboard;
