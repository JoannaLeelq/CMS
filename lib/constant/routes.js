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
  addCourse: 'addCourse',
};

const students = {
  path: [RoutePath.students],
  label: 'Students',
  icon: <YoutubeOutlined />,
  hidePathLink: false,
  subNav: [
    { path: [''], label: 'Student List', icon: <UserOutlined /> },
    {
      path: [RoutePath.selectStudents],
      label: 'Select Students',
      icon: <SelectOutlined />,
      subNav: [{ path: ['aa'], label: 'Test', icon: <UpOutlined /> }],
    },
  ],
};

const courses = {
  path: [RoutePath.courses],
  label: 'Courses',
  icon: <FileOutlined />,
  hidePathLink: false,
  subNav: [
    { path: [''], label: 'All Courses', icon: <CaretUpOutlined /> },
    {
      path: [RoutePath.addCourse],
      label: 'Add Course',
      icon: <UserAddOutlined />,
    },
  ],
};

const teachers = {
  path: [RoutePath.teachers],
  label: 'Teachers',
  icon: <AlibabaOutlined />,
  hidePathLink: false,
  subNav: [
    {
      path: [''],
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
