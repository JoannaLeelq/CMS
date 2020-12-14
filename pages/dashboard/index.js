import Layout from '../../components/layout/layout';
import 'antd/dist/antd.css';
import styled from 'styled-components';
import { Input, Table, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { makeServer } from '../../mock';
import Axios from 'axios';

if (process.env.NODE_ENV === 'development') {
  makeServer({ environment: 'development' });
}

const Search = styled(Input.Search)`
  width: 30%;
  margin-bottom: 16px;
  display: block;
`;

const axios = require('axios');

export default function Dashboard() {
  let [data, setData] = useState([]);

  axios.get('/api/dashboard').then(function (response) {
    setData(response.data.data.students.models);
  });

  const dataSource = data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      area: item.address,
      email: item.email,
    };
  });

  // console.log(dataSource);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Area',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Selected Curriculum',
      dataIndex: 'curriculum',
      key: 'curriculum',
    },
    {
      title: 'Student Type',
      dataIndex: 'studentType',
    },
    {
      title: 'Join Time',
      dataIndex: 'joinTime',
    },
    {
      title: 'Action',
      key: 'action',
      sorter: true,
      render: () => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  return (
    <Layout>
      <Search placeholder="通过名称搜索" onSearch={() => {}} />
      <div>
        <Table dataSource={dataSource} columns={columns}></Table>
      </div>
    </Layout>
  );
}
