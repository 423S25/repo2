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

const Analytics = () => {
  return (
    <div className="flex flex-row w-full p-4">
    <LineChart
      h={400}
      w="100%"
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
    </div>
  );
}

export default Analytics
