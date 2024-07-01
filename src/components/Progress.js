
import React from 'react';
import { Statistic,Card, Select, Typography, Progress } from 'antd';
import { LineChart, Line, Tooltip, Legend, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from 'recharts';
import moment from 'moment';

const { Text } = Typography;

const ProgressCard = ({
  totalIncome,
  totalExpense,
  incomePercentage,
  expensePercentage,
  amountLeft,
  filteredChartData,
  handleFilterChange,
  filterType,
}) => {
  return (
    <Card title="Income & Expense Progress" bordered={false}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ textAlign: 'center' }}>
          <Text strong>Total Income</Text>
          <br />
          <Progress type="circle" percent={incomePercentage} format={() => <span style={{ color: '#52c41a' }}>₺{totalIncome}</span>} width={100} className="income-progress" strokeColor="#52c41a"  />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text strong>Total Expense</Text>
          <br />
          <Progress type="circle" percent={expensePercentage} format={() => `₺${totalExpense}`} width={100} status="exception" />
        </div>
        <Statistic title="Amount Left (₺)" value={amountLeft} />
      </div>
      <br/>
      <Select defaultValue={filterType} style={{ width: 120, marginBottom: 16 }} onChange={handleFilterChange}>
        <Select.Option value="day">Day</Select.Option>
        <Select.Option value="week">Week</Select.Option>
        <Select.Option value="month">Month</Select.Option>
      </Select>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amountLeft" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ProgressCard;
