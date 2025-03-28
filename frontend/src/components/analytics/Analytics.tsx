import { LineChart } from '@mantine/charts';
import { Text, Paper
   } from '@mantine/core';


const data = [
  {
    data : "Mar 2",
    Paper : 20
  },
  {
    data : "Mar 3",
    Paper : 40
  },
  {
    data : "Mar 4",
    Paper : 39
  },
  {
    data : "Mar 5",
    Paper : 39
  },
  {
    data : "Mar 6",
    Paper : 39
  },
  {
    data : "Mar 7",
    Paper : 32
  },
]
  

interface ChartTooltipProps {
  label: string;
  payload: Record<string, any>[] | undefined;
}

function ChartTooltip({ label, payload }: ChartTooltipProps) {
  if (!payload) return null;

  return (
    <Paper px="md" py="sm" withBorder shadow="md" radius="md">
      <Text fw={500} mb={5}>
        {label}
      </Text>
      {payload.map((item: any) => (
        <Text key={item.name} c={item.color} fz="sm">
          {item.name}: {item.value}
        </Text>
      ))}
    </Paper>
  );
}



import { Tooltip,PieChart, Pie, Cell, Legend } from "recharts";
import { Container, Grid, Card, Title } from "@mantine/core";


const pieData = [
  { name: "Category A", value: 400 },
  { name: "Category B", value: 300 },
  { name: "Category C", value: 200 },
  { name: "Category D", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  return (
    <Container size="lg" py="md">
      <Grid>
        {/* Line Chart */}
        <Grid.Col span={6}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Title order={3}>Item Usage Over Time</Title>
            <LineChart
              h={300}
              w={400}
              data={data}
              dataKey="date"
              tooltipProps={{
                content: ({ label, payload }) => <ChartTooltip label={label} payload={payload} />,
              }}
              series={[
                { name: 'Paper', color: 'indigo.6' },
              ]}
              curveType="linear"
            />
          </Card>
        </Grid.Col>

        {/* Pie Chart */}
        <Grid.Col span={6}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Title order={3}>Item Usage by Category</Title>
            <PieChart width={400} height={300}>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
// const Analytics = () => {
//   return (
//     <div className="flex flex-row w-full p-4">
//     <LineChart
//       h={400}
//       w="100%"
//       data={data}
//       dataKey="date"
//       tooltipProps={{
//         content: ({ label, payload }) => <ChartTooltip label={label} payload={payload} />,
//       }}
//       series={[
//         { name: 'Paper', color: 'indigo.6' },
//       ]}
//       curveType="linear"
//     />
//     </div>
//   );
// }

// export default Analytics
