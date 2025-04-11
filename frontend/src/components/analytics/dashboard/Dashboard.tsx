import {
  Container,
  Grid,
  Card,
  Text,
  Group,
  Table,
  Title,
  Badge,
} from "@mantine/core";
import InventoryItem from "../../../types/InventoryItemType";
import { ItemReducerAction } from "../../../pages/home";

interface DashBoardProps {
  items : InventoryItem[];
  dispatchItemChange : React.ActionDispatch<[action : ItemReducerAction]>
  
}

const Dashboard = ( {items : items, dispatchItemChange : dispatchItemChange } : DashBoardProps) => {
  console.log(dispatchItemChange)
  const totalItems = items.length;
  const lowStockItems = items.filter(
    (item) => item.stock_count < item.base_count
  ).length;
  const donatedCount = items.filter((item) => item.donated).length;

  const recentItems = items.slice(-5).reverse();

  return (
    <Container>
      <Title order={2} mb="md">
        Inventory Dashboard
      </Title>

      <Grid>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg">Total Items</Text>
            <Title>{totalItems}</Title>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg">Low Stock Items</Text>
            <Title>{lowStockItems}</Title>
          </Card>
        </Grid.Col>
        <Grid.Col span={4}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg">Donated Items</Text>
            <Title>{donatedCount}</Title>
          </Card>
        </Grid.Col>
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
