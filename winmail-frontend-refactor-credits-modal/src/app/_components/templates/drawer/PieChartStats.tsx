import React from 'react';
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  Tooltip,
  ArcElement,
  ChartData,
  Legend,
} from 'chart.js';
import { ISelectedTemplateState } from '@/store/features/selected-template/selected-template-slice';

ChartJS.register([ArcElement, Tooltip, Legend]);

type PieChartStatsProps = {
  template: Partial<ISelectedTemplateState>;
};

const PieChartStats: React.FC<PieChartStatsProps> = ({ template }) => {
  const stats = (template.stats || {}) as any;
  const totalEmails = Number(stats.totalEmails || 0);
  const receivedEmails = Number(
    stats.receivedEmails ?? stats.recievedEmails ?? 0
  );
  const openedEmails = Number(stats.openedEmails ?? 0);
  const bouncedEmails = Number(stats.bouncedEmails ?? stats.bouncedMails ?? 0);

  const data: ChartData<'doughnut', any[], string> = {
    labels: [
      'Total Emails',
      'Received Emails',
      'Opened Emails',
      'Bounced Emails',
    ],
    datasets: [
      {
        label: 'Email statistics',
        data: [totalEmails, receivedEmails, openedEmails, bouncedEmails],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(255, 100, 86)',
        ],
        hoverOffset: 4,
        borderJoinStyle: 'bevel',
      },
    ],
  };

  const DoughnutChart = dynamic(
    () => import('react-chartjs-2').then((mod: any) => mod.Doughnut || mod.Chart),
    { ssr: false }
  ) as unknown as React.ComponentType<any>;

  return (
    <DoughnutChart
      data={data}
      options={{
        plugins: {
          legend: {
            display: true,
            title: {
              display: true,
              text: 'Email statistics',
              font: {
                size: 16,
              },
            },
            position: 'bottom',
            align: 'start',
            labels: {
              font: {
                size: 14,
              },
              filter: function (item: any) {
                return !String(item.text || '').includes('Email statistics');
              },
            },
          },
        },
      }}
    />
  );
};

export default PieChartStats;
