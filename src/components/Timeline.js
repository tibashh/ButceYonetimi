import React from 'react';
import { Timeline as AntTimeline, Card } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const TimelineCard = ({ entries }) => {
  return (
    <Card title="Timeline" bordered={false}>
      <AntTimeline>
        {entries.map((entry) => (
          <AntTimeline.Item
            key={entry.key}
            color={entry.type === 'income' ? 'green' : 'red'}
            dot={entry.type === 'expense' ? <ClockCircleOutlined style={{ fontSize: '16px' }} /> : null}
          >
            {`${moment(entry.date).format('YYYY-MM-DD')}: ${entry.name} - $${entry.amount} (${entry.type})`}
          </AntTimeline.Item>
        ))}
      </AntTimeline>
    </Card>
  );
};

export default TimelineCard;
