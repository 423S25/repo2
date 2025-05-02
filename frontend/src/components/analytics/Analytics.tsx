
import { useState, useEffect, JSX } from 'react';
import { Container, Grid, Card, Title, Text, Select, Tabs,  Group } from '@mantine/core';
import { LineChart, PieChart, BarChart } from '@mantine/charts';
import { Calendar, TrendingUp, Package, CircleDollarSign, Clock } from 'lucide-react';
import APIRequest from '../../api/request';
import { baseURL } from '../../App';

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


// Colors for charts

export default function Analytics(): JSX.Element {
  const [timeRange, setTimeRange] = useState<string>('30');
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<PieChartCell[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0,
    mostUsedItems: []
  });

  useEffect(() => {
    fetchInventoryData(timeRange);
  }, [timeRange]);
  // @ts-ignore
  const fetchInventoryData = async (days: string): Promise<void> => {
    try {
      const requester =new APIRequest(`${baseURL}/management/inventory/analytics/`)
      let returnData  = await requester.get({"days" : timeRange})
      // const mockStockData = generateMockStockData(days);

      setStockData(returnData['stock_level'] as StockDataPoint[]);
      setCategoryData(returnData["category_distribution"] as PieChartCell[]);
      setSummaryData(returnData["card_stats"] as SummaryData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };



  


  // Cost distribution
                    // @ts-ignore
  const costDistributionData: CostDistributionDataPoint[] = [
    { name: 'Under $5', value: 30 },
    { name: '$5-$15', value: 40 },
    { name: '$15-$30', value: 20 },
    { name: 'Over $30', value: 10 },
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
                    { name: 'PPE', color: 'indigo.6' },
                    { name: 'Toiletries', color: 'teal.6' },

                    { name: 'Office Supplies', color: 'grape.6' }
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

            {/* Pie Chart for Cost Distribution */}
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
                   data={summaryData.mostUsedItems.map(item => ({ name: item.name, usage: item.usage }))}
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


          </Grid>
        </Tabs.Panel>

      </Tabs>
    </Container>
  );
}
