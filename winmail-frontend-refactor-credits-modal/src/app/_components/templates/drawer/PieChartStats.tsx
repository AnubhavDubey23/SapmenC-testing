import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, Tooltip, ArcElement, ChartData, Legend } from 'chart.js';
import { ISelectedTemplateState } from '@/store/features/selected-template/selected-template-slice';

Chart.register([ArcElement, Tooltip, Legend]);

type PieChartStatsProps = {
  template: Partial<ISelectedTemplateState>;
};

export default function PieChartStats({ template }: PieChartStatsProps) {
  const totalEmails = template.stats?.totalEmails;
  const receivedEmails = template.stats?.receivedEmails;
  const openedEmails = template.stats?.openedEmails;
  const bouncedEmails = template.stats?.bouncedMails;

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

  return (
    <Doughnut
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
              filter: function (item, _) {
                return !item.text.includes('Email statistics');
              },
            },
          },
        },
      }}
    />
  );
}
