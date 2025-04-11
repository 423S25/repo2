
import { useState, useEffect, JSX } from 'react';
import { Container, Grid, Card, Title, Text, Select, Tabs, Badge, Group, Stack } from '@mantine/core';
import { LineChart, PieChart, BarChart } from '@mantine/charts';
import { Calendar, TrendingUp, Package, CircleDollarSign, Clock } from 'lucide-react';

// Define types for the inventory data

// interface HistoricalRecord {
//   id: number;
//   history_date: string;
//   history_change_reason: string | null;
//   history_type: '+' | '-' | '~'; // Added, Deleted, Changed
//   history_user_id: number | null;
//   stock_count: number;
//   item_name: string;
//   // Other fields can be included as needed
// }

// Types for chart data
interface StockDataPoint {
  date: string;
  [key: string]: string | number; // For dynamic category properties
}

// PieChartCell interface for the Mantine Charts PieChart component
interface PieChartCell {
  name: string;
  value: number;
  color: string;
}

interface BulkVsIndividualDataPoint {
  month: string;
  Individual: number;
  Bulk: number;
}

interface CostDistributionDataPoint {
  name: string;
  value: number;
}

interface MostUsedItem {
  name: string;
  usage: number;
}

interface SummaryData {
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
  mostUsedItems: MostUsedItem[];
}

interface HistoryLogItem {
  date: string;
  item: string;
  action: string;
  quantity: number;
  user: string;
}

// Colors for charts
const COLORS: string[] = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6384', '#36A2EB', '#4BC0C0'];

export default function Analytics(): JSX.Element {
  const [timeRange, setTimeRange] = useState<string>('30');
  const [category, setCategory] = useState<string>('all');
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<PieChartCell[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0,
    mostUsedItems: []
  });
  const [historyData, setHistoryData] = useState<HistoryLogItem[]>([]);

  useEffect(() => {
    fetchInventoryData(timeRange, category);
  }, [timeRange, category]);
  // @ts-ignore
  const fetchInventoryData = async (days: string, itemCategory: string): Promise<void> => {
    try {
      const mockStockData = generateMockStockData(days);
      const mockCategoryData = generateMockCategoryData();
      const mockSummaryData = generateMockSummaryData();
      const mockHistoryData = generateMockHistoryData(days);

      setStockData(mockStockData);
      setCategoryData(mockCategoryData);
      setSummaryData(mockSummaryData);
      setHistoryData(mockHistoryData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  const generateMockStockData = (days: string): StockDataPoint[] => {
    const data: StockDataPoint[] = [];
    const date = new Date();
    date.setDate(date.getDate() - parseInt(days));

    for (let i = 0; i <= parseInt(days); i += Math.max(1, Math.floor(parseInt(days) / 15))) {
      const currentDate = new Date(date);
      currentDate.setDate(date.getDate() + i);
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        Paper: Math.floor(Math.random() * 50) + 50,
        Cleaning: Math.floor(Math.random() * 40) + 30,
        Food: Math.floor(Math.random() * 60) + 20,
        Office: Math.floor(Math.random() * 35) + 15,
      });
    }
    return data;
  };

  // Generate mock data for categories with color property
  const generateMockCategoryData = (): PieChartCell[] => {
    return [
      { name: 'Paper Products', value: 35, color: COLORS[0] },
      { name: 'Cleaning Supplies', value: 25, color: COLORS[1] },
      { name: 'Food Items', value: 20, color: COLORS[2] },
      { name: 'Office Supplies', value: 15, color: COLORS[3] },
      { name: 'Other', value: 5, color: COLORS[4] }
    ];
  };

  // Generate mock summary data
  const generateMockSummaryData = (): SummaryData => {
    return {
      totalItems: 487,
      lowStockItems: 12,
      totalValue: 8750.42,
      mostUsedItems: [
        { name: "Paper Towels", usage: 145 },
        { name: "Hand Soap", usage: 98 },
        { name: "Copy Paper", usage: 87 },
        { name: "Coffee Pods", usage: 76 }
      ]
    };
  };

  // Generate mock history data
  const generateMockHistoryData = (days: string): HistoryLogItem[] => {
    const actions: string[] = ["Added", "Removed", "Adjusted"];
    const items: string[] = ["Paper Towels", "Hand Soap", "Copy Paper", "Coffee Pods", "Pens", "Notebooks"];
    const data: HistoryLogItem[] = [];
    const date = new Date();
    date.setDate(date.getDate() - parseInt(days));
    
    for (let i = 0; i < 20; i++) {
      const currentDate = new Date(date);
      currentDate.setDate(date.getDate() + Math.floor(Math.random() * parseInt(days)));
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        item: items[Math.floor(Math.random() * items.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        quantity: Math.floor(Math.random() * 20) + 1,
        user: "Admin"
      });
    }
    
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  // Prepare donation status data with colors
  const donationStatusData: PieChartCell[] = [
    { name: 'Donated Items', value: 35, color: COLORS[5] },
    { name: 'Purchased Items', value: 65, color: COLORS[6] },
  ];

  // Stock change chart for bulk vs individual items
  const bulkVsIndividualData: BulkVsIndividualDataPoint[] = [
    { month: 'Jan', Individual: 65, Bulk: 28 },
    { month: 'Feb', Individual: 59, Bulk: 30 },
    { month: 'Mar', Individual: 80, Bulk: 42 },
    { month: 'Apr', Individual: 81, Bulk: 40 },
    { month: 'May', Individual: 56, Bulk: 36 },
    { month: 'Jun', Individual: 55, Bulk: 39 },
    { month: 'Jul', Individual: 72, Bulk: 45 },
  ];

  // Cost distribution
                    // @ts-ignore
  const costDistributionData: CostDistributionDataPoint[] = [
    { name: 'Under $5', value: 30 },
    { name: '$5-$15', value: 40 },
    { name: '$15-$30', value: 20 },
    { name: 'Over $30', value: 10 },
  ];

  // Usage frequency data
  const usageFrequencyData = [
    { date: '2025-01', value: 24 },
    { date: '2025-02', value: 32 },
    { date: '2025-03', value: 28 },
    { date: '2025-04', value: 36 },
    { date: '2025-05', value: 42 },
    { date: '2025-06', value: 30 },
  ];

  // Types for select options
  type SelectOption = {
    value: string;
    label: string;
  };

  const timeRangeOptions: SelectOption[] = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
    { value: '365', label: 'Last year' },
  ];

  const categoryOptions: SelectOption[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'paper', label: 'Paper Products' },
    { value: 'cleaning', label: 'Cleaning Supplies' },
    { value: 'food', label: 'Food Items' },
    { value: 'office', label: 'Office Supplies' },
  ];

  return (
    <Container size="lg" py="md">
      <Title order={2} mb="md">Inventory Analytics Dashboard</Title>
      
      {/* Filters */}
      <Group mb="md">
        <Select
          label="Time Range"
          placeholder="Select time range"
          data={timeRangeOptions}
          value={timeRange}
          onChange={(value: string | null) => value && setTimeRange(value)}
          w={200}
        />
        <Select
          label="Category"
          placeholder="Select category"
          data={categoryOptions}
          value={category}
          onChange={(value: string | null) => value && setCategory(value)}
          w={200}
        />
      </Group>

      {/* Summary Cards */}
      <Grid mb="md">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <Text fw={500}>Total Items</Text>
              <Package size={20} />
            </Group>
            <Text fw={700} size="xl" mt="md">{summaryData.totalItems}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <Text fw={500}>Low Stock Items</Text>
              <TrendingUp size={20} color="orange" />
            </Group>
            <Text fw={700} size="xl" mt="md" c="orange">{summaryData.lowStockItems}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <Text fw={500}>Inventory Value</Text>
              <CircleDollarSign size={20} />
            </Group>
            <Text fw={700} size="xl" mt="md">${summaryData.totalValue.toFixed(2)}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <Text fw={500}>Last Updated</Text>
              <Clock size={20} />
            </Group>
            <Text fw={700} size="xl" mt="md">{new Date().toLocaleDateString()}</Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Tabs defaultValue="stock">
        <Tabs.List mb="md">
          <Tabs.Tab value="stock" leftSection={<TrendingUp size={16} />}>Stock Trends</Tabs.Tab>
          <Tabs.Tab value="usage" leftSection={<Package size={16} />}>Usage Analysis</Tabs.Tab>
          <Tabs.Tab value="history" leftSection={<Calendar size={16} />}>History Log</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="stock">
          <Grid>
            {/* Line Chart */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" p="lg" radius="md" withBorder h={400}>
                <Title order={3} mb="md">Stock Levels Over Time</Title>
                <LineChart
                  h={300}
                  data={stockData}
                  dataKey="date"
                  series={[
                    { name: 'Paper', color: 'indigo.6' },
                    { name: 'Cleaning', color: 'teal.6' },
                    { name: 'Food', color: 'yellow.6' },
                    { name: 'Office', color: 'grape.6' }
                  ]}
                  curveType="linear"
                  withLegend
                  withTooltip
                />
              </Card>
            </Grid.Col>

            {/* Pie Chart */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" p="lg" radius="md" withBorder h={400}>
                <Title order={3} mb="md">Items by Category</Title>
                <PieChart
                  h={300}
                  withTooltip
                    // @ts-ignore
                  withLegend
                  data={categoryData}
                  categoryKey="name"
                  valueKey="value"
                  paddingAngle={2}
                  sortByValue={false}
                  startAngle={0}
                  endAngle={360}
                />
              </Card>
            </Grid.Col>

            {/* Bar Chart for Bulk vs Individual */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" p="lg" radius="md" withBorder h={400} mt="md">
                <Title order={3} mb="md">Bulk vs Individual Inventories</Title>
                <BarChart
                  h={300}
                  data={bulkVsIndividualData}
                  dataKey="month"
                  series={[
                    { name: 'Individual', color: 'blue.6' },
                    { name: 'Bulk', color: 'violet.6' },
                  ]}
                  tickLine="y"
                  withLegend
                  withTooltip
                />
              </Card>
            </Grid.Col>

            {/* Pie Chart for Cost Distribution */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" p="lg" radius="md" withBorder h={400} mt="md">
                <Title order={3} mb="md">Cost Distribution</Title>
                                {categoryData.length > 0 && (
                  <PieChart
                    h={300}
                    withTooltip
                    data={categoryData}
                    // @ts-ignore
                    categoryKey="name"
                    valueKey="value"
                    paddingAngle={2}
                    sortByValue={false}
                    startAngle={0}
                    endAngle={360}
                  />
                )}
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="usage">
          <Grid>
            {/* Most Used Items */}
            <Grid.Col span={12}>
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Title order={3} mb="md">Most Used Items</Title>
                <BarChart
                  h={300}
                  data={summaryData.mostUsedItems.map(item => ({ name: item.name, value: item.usage }))}
                  dataKey="name"
                  series={[
                    { name: 'usage', color: 'blue.6', label: 'Usage Count' },
                  ]}
                  tickLine="y"
                  withLegend
                  withTooltip
                />
              </Card>
            </Grid.Col>

            {/* Usage by Category */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" p="lg" radius="md" withBorder h={400} mt="md">
                <Title order={3} mb="md">Usage by Donated Status</Title>
                <PieChart
                  h={300}
                  withTooltip
                  // @ts-ignore
                  withLegend
                  data={donationStatusData}
                  categoryKey="name"
                  valueKey="value"
                  paddingAngle={2}
                  sortByValue={false}
                />
              </Card>
            </Grid.Col>

            {/* Line chart showing item usage over time */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" p="lg" radius="md" withBorder h={400} mt="md">
                <Title order={3} mb="md">Usage Frequency Over Time</Title>
                <LineChart
                  h={300}
                  data={usageFrequencyData}
                  dataKey="date"
                  series={[
                    { name: 'value', color: 'green.6', label: 'Usage Count' },
                  ]}
                  curveType="linear"
                  withLegend
                  withTooltip
                />
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="history">
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Title order={3} mb="md">Inventory History Log</Title>
            <Stack gap="xs">
              {historyData.map((item, index) => (
                <Card key={index} withBorder shadow="xs" padding="sm">
                  <Group justify="space-between">
                    <Group>
                      <Badge
                        color={
                          item.action === 'Added' ? 'green' : 
                          item.action === 'Removed' ? 'red' : 'blue'
                        }
                      >
                        {item.action}
                      </Badge>
                      <Text fw={500}>{item.item}</Text>
                      <Text>Qty: {item.quantity}</Text>
                    </Group>
                    <Group>
                      <Text size="sm" c="dimmed">{item.date}</Text>
                      <Text size="sm" c="dimmed">by {item.user}</Text>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
