import {
  AlibabaOutlined,
  CaretUpOutlined,
  ReadOutlined,
  PlayCircleOutlined,
  SelectOutlined,
  TeamOutlined,
  UpOutlined,
  UserAddOutlined,
  UserOutlined,
  SolutionOutlined,
  EditOutlined,
  MessageOutlined,
  CalendarOutlined,
  ProfileOutlined,
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
  editCourse: 'editCourse',
  message: 'message',
  classSchedule: 'schedule',
  profile: 'profile',
};

const students = {
  path: [RoutePath.students],
  label: 'Students',
  icon: <SolutionOutlined />,
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
  icon: <ReadOutlined />,
  hidePathLink: false,
  subNav: [
    { path: [''], label: 'All Courses', icon: <CaretUpOutlined /> },
    {
      path: [RoutePath.addCourse],
      label: 'Add Course',
      icon: <UserAddOutlined />,
    },
    {
      path: [RoutePath.editCourse],
      label: 'Edit Course',
      icon: <EditOutlined />,
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

const message = {
  path: [RoutePath.message],
  label: 'Message',
  icon: <MessageOutlined />,
};

const classSchedule = {
  path: [RoutePath.classSchedule],
  label: 'Class Schedule',
  icon: <CalendarOutlined />,
};

const profile = {
  path: [RoutePath.profile],
  label: 'Profile',
  hide: true,
  icon: <ProfileOutlined />,
};

export const routes = {
  manager: [overview, students, teachers, courses, message],
  teacher: [overview, classSchedule, students, courses, message, profile],
  student: [overview, classSchedule, courses, message, profile],
};
