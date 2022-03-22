import React, { useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export const options = {
  indexAxis: 'y' as const,
  plugins: {
    datalabels: {
      align: 'center',
      anchor: 'center',
      display: function(context: any) {
        const index = context.dataIndex;
        const value = context.dataset.data[index];

        return value > 0;
      },
      formatter: function(value: any, context: any) {
        return `${value}%`
      }
   },
    title: {
      display: false,
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
      gridLines: {
        display: false,
        drawBorder: false,
      }
    },
    y: {
      stacked: true,
      ticks: {
        display: false
      },
      gridLines: {
        display: false,
        drawBorder: false,
      }
    },
  },
};

const labels = ['score'];

export default function PerformanceDistributionComp({ performance_percentages, student_total }: {
    performance_percentages: { [key: string]: number }
    student_total: number
}) {
    const compute_percentage = useCallback((ranging: string) => {
        return +((((performance_percentages[ranging] || 0)/(student_total || 1)) * 100).toFixed(0))
    }, [performance_percentages, student_total]);

  return <Bar
  height={30}
//   @ts-ignore
  options={options} 
  data={{
    labels,
    datasets: [
      {
        label: '0 - 49%',
        data: [compute_percentage('0 - 49')],
        backgroundColor: '#80d8ff',
      },
      {
        label: '50 - 64%',
        data: [compute_percentage('50 - 64')],
        backgroundColor: '#c5e1a5',
      },
      {
        label: '65 - 79%',
        data: [compute_percentage('65 - 79')],
        backgroundColor: '#ffc107',
      },
      {
          label: '80 - 100%',
          data: [compute_percentage('80 - 100')],
          backgroundColor: '#ef6c00',
      },
    ],
  }} 
  />;
}
