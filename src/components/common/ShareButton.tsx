import { FileExcelOutlined, FilePdfOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const ShareButton = ({ list, fileName }: any) => {
  const { t } = useTranslation();

  const exportCSV = () => {
    // filter out the properties that are arrays
    const filteredList = list.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach((key) => {
        if (!Array.isArray(item[key])) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const replacer = (key: any, value: any) => (value === null ? '' : value);
    const header = Object.keys(filteredList[0]);
    let csv = filteredList.map((row: any) =>
      header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(','),
    );
    csv.unshift(header.join(','));
    csv = csv.join('\r');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const menu = () => (
    <Menu>
      <Menu.Item onClick={() => exportCSV()} danger icon={<FileExcelOutlined />}>
        {t('common.exportCSV')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu()} placement="bottomRight">
      <Button type="text" shape="circle" size="large" style={{ alignItems: 'end' }}>
        <ShareAltOutlined style={{ transform: 'scale(1.2)' }} />
      </Button>
    </Dropdown>
  );
};
