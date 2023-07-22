import React from 'react';
import { EChartsOption } from 'echarts-for-react';
import { BaseChart, BaseChartProps } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';

interface PieChartProps extends BaseChartProps {
  option?: EChartsOption;
  // eslint-disable-next-line
  data?: any;
  name?: string;
}

export const PieChartRightLegend: React.FC<PieChartProps> = ({ option, data, name, ...props }) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const defaultPieOption = {
    tooltip: {
      trigger: 'item',
      position: ['15%', '80%'],
    },
    legend: {
      orient: 'vertical',
      left: '50%',
      top: 'middle',
      textStyle: {
        color: themeObject[theme].textMain,
      },
    },
    itemStyle: {
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
    },
    series: [
      {
        name,
        type: 'pie',
        center: ['25%', '50%'],
        radius: '50%',
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data,
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: (idx: any) => {
          return Math.random() * 200;
        },
      },
    ],
  };
  return <BaseChart {...props} option={{ ...defaultPieOption, ...option }} height={'200px'} />;
};
