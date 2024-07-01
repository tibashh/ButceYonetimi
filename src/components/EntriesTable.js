import React, { useState } from 'react';
import { Table, Button, Input, DatePicker, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const EntriesTable = ({ entries, editEntry, deleteEntry }) => {
  const [nameFilter, setNameFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(null);

  const handleNameFilterChange = (e) => {
    setNameFilter(e.target.value);
  };

  const handleDateFilterChange = (date) => {
    setDateFilter(date ? date.format('YYYY-MM-DD') : null);
  };

  const filteredEntries = entries.filter((entry) => {
    const entryDate = moment(entry.date).format('YYYY-MM-DD');
    const matchesName = entry.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesDate = dateFilter ? entryDate === dateFilter : true;
    return matchesName && matchesDate;
  });


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => moment(text).format('YYYY-MM-DD'),
      sorter: (a, b) => moment(a.date) - moment(b.date),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      filters: [
        { text: 'Income', value: 'income' },
        { text: 'Expense', value: 'expense' },
      ],
      onFilter: (value, record) => record.type.includes(value),
      render: (type) => (
        <span style={{ color: type === 'income' ? 'green' : 'red' }}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => editEntry(record)}>
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => deleteEntry(record.key)}
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Filter by name"
            value={nameFilter}
            onChange={handleNameFilterChange}
          />
        </Col>
        <Col>
          <DatePicker
            format="YYYY-MM-DD"
            onChange={handleDateFilterChange}
          />
        </Col>
      </Row>
      <Table
        bordered
        dataSource={filteredEntries}
        columns={columns}
        rowClassName="editable-row"
        pagination={{ onChange: () => {} }}
      />
    </>
  );
};

export default EntriesTable;
