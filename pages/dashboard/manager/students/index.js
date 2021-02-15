import APPLayout from '../../../../components/layout/layout';
import 'antd/dist/antd.css';
import styled from 'styled-components';
import { Input, Table, Space, Pagination, Button, Popconfirm, Breadcrumb } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../../../lib/services/api-service';
import { debounce } from 'lodash';
import Link from 'next/link';
import { PlusOutlined } from '@ant-design/icons';
import ModalForm from '../../../../components/common/modal-form';
import AddStudentForm from '../../../../components/students/add-student';
import { formatDistanceToNow } from 'date-fns';

const Search = styled(Input.Search)`
  width: 30%;
  margin-bottom: 16px;
  display: block;
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
`;

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });

  const [total, setTotal] = useState(0);
  const [isModalDisplay, setModalDisplay] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [countries, setCountries] = useState([]);

  const dataSource = data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      area: item.country,
      email: item.email,
      typeName: item.type.name,
      joinTime: item.createdAt,
      curriculum: item.courses,
    };
  });

  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      render: (_1, _2, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (preItem, nextItem) => {
        const preItemCode = preItem.name;
        const nextItemCode = nextItem.name;
        return preItemCode.localeCompare(nextItemCode);
      },
      sortDirections: ['ascend', 'descend'],
      render: (_, record) => (
        <Link href={`/dashboard/manager/students/${record.id}`}>{record.name}</Link>
      ),
    },
    {
      title: 'Area',
      dataIndex: 'area',
      key: 'area',
      filters: countries.map((item) => {
        return { text: item.en, value: item.en };
      }),
      onFilter: (value, record) => record.area.includes(value),
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
      render: (courses) => courses?.map((item) => item.name).join(','),
    },
    {
      title: 'Student Type',
      dataIndex: 'typeName',
      filters: [
        { text: 'developer', value: 'developer' },
        { text: 'tester', value: 'tester' },
      ],
      onFilter: (value, record) => record.typeName === value,
    },
    {
      title: 'Join Time',
      dataIndex: 'joinTime',
      render: (value) => formatDistanceToNow(new Date(value), { addSuffix: true }),
    },
    {
      title: 'Action',
      key: 'action',
      sorter: true,
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setEditingStudent(record);
              setModalDisplay(true);
            }}
          >
            Edit
          </a>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => {
              apiService.deleteStudent({ id: record.id }).then((res) => {
                if (res.data) {
                  const index = data.findIndex((item) => item.id === record.id);
                  const updatedData = [...data];

                  updatedData.splice(index, 1);
                  setData(updatedData);
                  setTotal(total - 1);
                }
              });
            }}
            okText="Yes"
            cancelText="No"
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [query, setQuery] = useState('');

  const debounceSearch = useCallback(
    debounce((searchContent) => {
      setQuery(searchContent);
    }, 1000),
    []
  );

  const cancel = () => {
    setModalDisplay(false);
    setEditingStudent(null);
  };

  useEffect(() => {
    apiService.getAllCountries().then((res) => {
      setCountries(res.data);
    });
  }, []);

  useEffect(() => {
    const req = {
      page: pagination.current,
      limit: pagination.pageSize,
      query,
    };

    apiService.getStudent(req).then((res) => {
      setData(res.data.students);
      setTotal(res.data.total);
      setLoading(false);
    });
  }, [pagination, query]);

  return (
    <APPLayout>
      <FlexContainer>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setModalDisplay(true);
            setEditingStudent(null);
          }}
        >
          Add
        </Button>
        <Search
          placeholder="search by name"
          onSearch={(value) => {
            setQuery(value);
          }}
          onChange={(event) => {
            debounceSearch(event.target.value);
          }}
        />
      </FlexContainer>

      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        onChange={setPagination}
        pagination={{ ...pagination, total }}
      ></Table>

      <ModalForm
        title={!!editingStudent ? 'Edit Student' : 'Add Student'}
        centered
        visible={isModalDisplay}
        cancel={cancel}
      >
        <AddStudentForm
          onFinish={(student) => {
            if (!!editingStudent) {
              const index = data.findIndex((item) => item.id === student.id);

              data[index] = student;
              setData([...data]);
            } else {
              setData([...data, student]);
            }
            setModalDisplay(false);
          }}
          student={editingStudent}
          countries={countries}
        />
      </ModalForm>
    </APPLayout>
  );
}
