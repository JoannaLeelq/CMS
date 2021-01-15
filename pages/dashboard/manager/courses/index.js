import APPLayout from '../../../../components/layout/layout';
import styled from 'styled-components';
import { Input, Table, Space, Pagination, Button, Popconfirm, Breadcrumb } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import apiService from '../../../../lib/services/api-service';
import { debounce, omitBy, throttle } from 'lodash';
import Link from 'next/link';
import { PlusOutlined } from '@ant-design/icons';
import ModalForm from '../../../../components/common/modal-form';
import AddStudentForm from '../../../../components/students/add-student';
import { formatDistanceToNow } from 'date-fns';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Courses() {
  const [coursesContent, setCourse] = useState([]);

  return (
    <APPLayout>
      {/* <InfiniteScroll> */}
      <div>course page</div>
      {/* </InfiniteScroll> */}
    </APPLayout>
  );
}
