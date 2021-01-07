import {
  AlibabaOutlined,
  CaretUpOutlined,
  FileOutlined,
  PlayCircleOutlined,
  SelectOutlined,
  TeamOutlined,
  UpOutlined,
  UserAddOutlined,
  UserOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import React from 'react';
import { Role } from './role';

/**
 * router path
 */

export const RoutePath = {
  manager: 'manager',
  teachers: 'teachers',
  students: 'students',
  selectStudents: 'selectStudents',
  courses: 'courses',
  add: 'add',
  edit: 'edit',
};

const students = {
  path: [],
  label: 'Students',
  icon: <YoutubeOutlined />,
  subNav: [
    { path: [RoutePath.students], label: 'Student List', icon: <UserOutlined /> },
    {
      path: [RoutePath.selectStudents],
      label: 'Select Students',
      icon: <SelectOutlined />,
      subNav: [{ path: ['aa'], label: 'Test', icon: <UpOutlined /> }],
    },
  ],
};

const courses = {
  path: [],
  label: 'Courses',
  icon: <FileOutlined />,
  subNav: [
    { path: [RoutePath.courses], label: 'All Courses', icon: <CaretUpOutlined /> },
    { path: [RoutePath.add], label: 'Add', icon: <UserAddOutlined /> },
  ],
};

const teachers = {
  path: [],
  label: 'Teachers',
  icon: <AlibabaOutlined />,
  subNav: [
    {
      path: [RoutePath.teachers],
      label: 'Teacher List',
      icon: <TeamOutlined />,
      subNav: [{ path: ['bb'], label: 'Test', icon: <UpOutlined /> }],
    },
  ],
};

const overview = {
  path: [],
  label: 'Overview',
  icon: <PlayCircleOutlined />,
};

export const routes = {
  manager: [overview, students, teachers, courses],
  teachers: [overview, students, courses],
  students: [overview, courses],
};
