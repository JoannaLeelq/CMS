import Layout from '../../../components/layout/layout';
import 'antd/dist/antd.css';
import styled from 'styled-components';
import { Input, Table, Space, Pagination } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import { makeServer } from '../../../mock';
import Axios from 'axios';
import apiService from '../../../lib/services/api-service';
import { debounce, omitBy } from 'lodash';

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });

  const [total, setTotal] = useState(0);

  // axios.get('/api/dashboard/students').then((response) => {
  //   setData(response.data.data.students.models);
  // });

  const dataSource = data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      area: item.address,
      email: item.email,
    };
  });

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

  const [query, setQuery] = useState('');

  const debounceSearch = useCallback(
    debounce((searchContent) => {
      setQuery(searchContent);
    }, 3000),
    []
  );

  useEffect(() => {
    const req = { limit: pagination.pageSize, page: pagination.current, query };

    apiService.getStudent(req).then((res) => {
      console.log(res);
      const { total, students } = res.data;
      setData(students);
    });
  });

  return (
    <Layout>
      <Search
        placeholder="通过名称搜索"
        onSearch={(value) => {
          setQuery(value);
        }}
        onChange={(event) => {
          debounceSearch(event.target.value);
        }}
      />
      <div>
        <Table
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
          onChange={setPagination}
          pagination={{ ...pagination, total }}
        ></Table>
      </div>
    </Layout>
  );
}
