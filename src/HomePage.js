import React, { useState, useEffect } from 'react';
import { Statistic, Layout, Menu, Breadcrumb, Input, Form, Button, DatePicker, Row, Col, Card, Table, Select, Typography, message, Progress, Modal, Timeline, Calendar } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, MailOutlined, ClockCircleOutlined,LogoutOutlined } from '@ant-design/icons';
import moment from 'moment';
import { LineChart, Line, Tooltip, Legend, ResponsiveContainer, CartesianGrid, XAxis, YAxis } from 'recharts';
import Login from './LoginPage';
import './App.css';
import { useNavigate } from "react-router-dom";
import { auth } from './config/firebase';
import ProfileInfo from './components/ProfileInfo';
import AddEntry from './components/AddEntry';
import ProgressCard from './components/Progress';
import EntriesTable from './components/EntriesTable';
import TimelineCard from './components/Timeline';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;
const { confirm } = Modal;

const HomePage = () => {
  const [form] = Form.useForm();
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [filteredChartData, setFilteredChartData] = useState([]);
  const [filterType, setFilterType] = useState('day'); 
  const [calendarData, setCalendarData] = useState({}); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [email, setEmail] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [amountLeft, setAmountLeft] = useState(0);

  const [profile, setProfile] = useState({ name: '', email: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ name: '', email: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  
  const totalIncome = entries.reduce((acc, curr) => {
    if (curr.type === 'income') {
      return acc + parseFloat(curr.amount);
    }
    return acc;
  }, 0);

  const totalExpense = entries.reduce((acc, curr) => {
    if (curr.type === 'expense') {
      return acc + parseFloat(curr.amount);
    }
    return acc;
  }, 0);

  useEffect(() => {
    
    const goback = auth.onAuthStateChanged(user => {
      if (user) {

        const { displayName, email } = user;
        setProfile({ name: displayName, email });
        setIsLoggedIn(true); 
      } else {
        
        setProfile({ name: '', email: '' }); 
        setIsLoggedIn(false);
      }
    });

    return () => goback();
  }, []);
  
  
  const incomePercentage = totalIncome > 0 ? Math.round((totalIncome / (totalIncome + totalExpense)) * 100) : 0;
  const expensePercentage = totalExpense > 0 ? Math.round((totalExpense / (totalIncome + totalExpense)) * 100) : 0;

 
  useEffect(() => {
    const initialCalendarData = {};
    entries.forEach((entry) => {
      const date = moment(entry.date).format('YYYY-MM-DD');
      if (!initialCalendarData[date]) {
        initialCalendarData[date] = [];
      }
      initialCalendarData[date].push(entry);
    });
    setCalendarData(initialCalendarData);
  }, [entries]);


  const addEntry = (values) => {
    const newEntry = {
      key: Date.now().toString(),
      ...values,
      date: values.date.format('YYYY-MM-DD')
    };
    setEntries([...entries, newEntry]);
    updateChartData([...entries, newEntry]);
    form.resetFields();
    message.success('Entry added successfully!');
  };

  const deleteEntry = (key) => {
    confirm({
      title: 'Are you sure you want to delete this entry?',
      icon: <DeleteOutlined style={{ color: 'red' }} />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const newEntries = entries.filter((item) => item.key !== key);
        setEntries(newEntries);
        updateChartData(newEntries);
        message.success('Entry deleted successfully!');
      },
      onCancel() {
        console.log('Deletion canceled');
      },
    });
  };

  const editEntry = (entry) => {
    setEditingEntry(entry);
    setIsEditing(true);
    form.setFieldsValue({
      name: entry.name,
      amount: entry.amount,
      date: moment(entry.date),
      type: entry.type,
    });
  };

  const updateEntry = (values) => {
    const updatedEntries = entries.map((item) => {
      if (item.key === editingEntry.key) {
        return {
          ...item,
          ...values,
          date: values.date.format('YYYY-MM-DD'),
        };
      }
      return item;
    });
    setEntries(updatedEntries);
    updateChartData(updatedEntries);
    setIsEditing(false);
    form.resetFields();
    message.success('Entry updated successfully!');
  };

  const cancelEdit = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const updateChartData = (data) => {
    const chartData = data.map((entry) => ({
      date: moment(entry.date).format('YYYY-MM-DD'),
      income: entry.type === 'income' ? parseFloat(entry.amount) : 0,
      expense: entry.type === 'expense' ? parseFloat(entry.amount) : 0,
    }));

    let amountLeft = 0;
    const newData = chartData.map((entry) => {
      amountLeft += (entry.income - entry.expense);
      return {
        ...entry,
        amountLeft,
      };
    });

    setChartData(newData);
    setAmountLeft(amountLeft); 
    filterChartData(newData, filterType); 
  };

  const filterChartData = (data, type) => {
    let filteredData = [];

    switch (type) {
      case 'day':
        filteredData = filterByDay(data);
        break;
      case 'week':
        filteredData = filterByWeek(data);
        break;
      case 'month':
        filteredData = filterByMonth(data);
        break;
      default:
        filteredData = data;
    }

    setFilteredChartData(filteredData);
  };

  const filterByDay = (data) => {
    const groupedData = {};
    data.forEach((entry) => {
      const dateKey = moment(entry.date).format('YYYY-MM-DD');
      groupedData[dateKey] = { date: dateKey, amountLeft: 0 };
    });

    let amountLeft = 0;
    const dayFilteredData = Object.values(groupedData).map((dayEntry) => {
      const filteredEntries = data.filter((entry) => moment(entry.date).format('YYYY-MM-DD') === dayEntry.date);
      filteredEntries.forEach((entry) => {
        amountLeft += (entry.income - entry.expense);
      });
      return {
        ...dayEntry,
        amountLeft,
      };
    });

    return dayFilteredData;
  };

  const filterByWeek = (data) => {
    const groupedData = {};
    data.forEach((entry) => {
      const startOfWeek = moment(entry.date).startOf('week').format('YYYY-MM-DD');
      if (!groupedData[startOfWeek]) {
        groupedData[startOfWeek] = { date: startOfWeek, amountLeft: 0 };
      }
      groupedData[startOfWeek].amountLeft += (entry.income - entry.expense);
    });
    return Object.values(groupedData);
  };

  const filterByMonth = (data) => {
    const groupedData = {};
    data.forEach((entry) => {
      const startOfMonth = moment(entry.date).startOf('month').format('YYYY-MM-DD');
      if (!groupedData[startOfMonth]) {
        groupedData[startOfMonth] = { date: startOfMonth, amountLeft: 0 };
      }
      groupedData[startOfMonth].amountLeft += (entry.income - entry.expense);
    });
    return Object.values(groupedData);
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
    filterChartData(chartData, value);
  };

  
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

  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const dateCellRender = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    if (calendarData[formattedDate]) {
      return (
        <ul className="events">
          {calendarData[formattedDate].map((entry) => (
            <li key={entry.key}>
              <span style={{ color: entry.type === 'income' ? 'green' : 'red' }}>
                {entry.name}: ${entry.amount} ({entry.type})
              </span>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  const handleEditProfile = () => {
    setEditedProfile({ name: profile.name, email: profile.email });
    setIsEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
  };

  const handleSaveProfile = () => {
    setLoading(true);

    setProfile({ name: editedProfile.name, email: editedProfile.email });
    setIsEditingProfile(false);
    
    setTimeout(() => {
      setIsModalVisible(false);
      setLoading(false);
      message.success('Saved!');
    }, 1000);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };


  const showModal = () => {
    setIsModalVisible(true);
  };

  
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setIsModalVisible(false);
      setLoading(false);
      message.success('Email sent successfully!');
    }, 1500); 
  };

  
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

 
  const sendReportByEmail = () => {
    setLoading(true);
    setTimeout(() => {
      setIsModalVisible(false);
      setLoading(false);
      message.success('Email sent successfully!');
    }, 1500); 
  };
  
  const handleLogout = () => {
    auth.signOut(); 
    setIsLoggedIn(false); 
    navigate('/');
  };

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <Layout className="layout">
       <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Budget Management</Menu.Item>
          <Menu.Item key="logout"  style={{ float: 'right' }}  onClick={handleLogout} > 
            <LogoutOutlined /> Logout
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item></Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <Row gutter={16}>
            <Col span={24}>
            <ProfileInfo
                profile={profile}
                isEditingProfile={isEditingProfile}
                editedProfile={editedProfile}
                isLoading={loading}
                onEditProfile={handleEditProfile}
                onCancelEditProfile={handleCancelEditProfile}
                onSaveProfile={handleSaveProfile}
                onProfileInputChange={handleProfileInputChange}
              />

            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col span={12}>
            <Card title="Add Entry" bordered={false} style={{ height: 573 }}>
                <AddEntry
                  form={form}
                  isEditing={isEditing}
                  editEntry={editEntry}
                  cancelEdit={cancelEdit}
                  addEntry={addEntry}
                  updateEntry={updateEntry}
                />
              </Card>
            </Col>
            <Col span={12}>
            <ProgressCard
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              incomePercentage={incomePercentage}
              expensePercentage={expensePercentage}
              amountLeft={amountLeft}
              filteredChartData={filteredChartData}
              handleFilterChange={handleFilterChange}
              filterType={filterType}/>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col span={24}>
            <Card title="Entries Table" bordered={false}>
                <EntriesTable
                  entries={entries}
                  editEntry={editEntry}
                  deleteEntry={deleteEntry}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col span={24}>
          <TimelineCard entries={entries} /> 
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col span={24}>
              <Card title="Calendar" bordered={false}>
                <Calendar
                  onPanelChange={onPanelChange}
                  dateCellRender={dateCellRender}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        <Button type="primary" icon={<MailOutlined />} onClick={showModal} style={{ marginTop: 16 }}>
          Get Report
        </Button>
        <Modal
            title="Send Report by Email"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
    <Button key="back" onClick={handleCancel}>
      Cancel
    </Button>,
    <Button
      key="submit"
      type="primary"
      loading={loading}
      onClick={sendReportByEmail}
    >
      {loading ? 'Sending' : 'Send'}
    </Button>,
  ]}>
  <Form layout="vertical">
    <Form.Item label="Email" required>
      <Input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter your email"
      />
    </Form.Item>
    <Form.Item label="Repor">
      <ul>
        {entries.map(entry => (
          <div>
            {`${entry.name}:  $${entry.amount}  (${entry.type})`}
            </div>
        ))}
      </ul>
    </Form.Item>
  </Form>
</Modal>
        <br/>
        <br/>
        Budget Management ©2024 Created
      </Footer>
    </Layout>
  );
};
export default HomePage;
