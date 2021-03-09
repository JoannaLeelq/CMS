import APPLayout from '../../../components/layout/Layout';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { Card, Select, Row, Col, Progress } from 'antd';
import apiService from '../../../lib/services/api-service';
import { Role, Types } from '../../../lib/constant/role';
import { AlibabaOutlined, ReadOutlined, SolutionOutlined } from '@ant-design/icons';
import Distribution from '../../../components/charts/distribution';
import Pie from '../../../components/charts/pie';
import Line from '../../../components/charts/line';
import Bar from '../../../components/charts/bar';
import HeatMap from '../../../components/charts/heatMap';
import dynamic from 'next/dynamic';

const IconCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  .anticon {
    color: #999999;
    padding: 25px;
    background: white;
    border-radius: 50%;
  }
`;

// statistics overview
const Overview = ({ data, title, icon, style, percent }) => {
  return (
    <Card style={{ borderRadius: 5, cursor: 'pointer', ...style }}>
      <Row gutter={[16]}>
        <IconCol span={6}>{icon}</IconCol>
        <Col span={18}>
          <h3 style={{ color: 'white' }}>{title}</h3>
          <h2 style={{ color: 'white', fontSize: '32px' }}>{data.total}</h2>
          <Progress
            percent={100 - percent}
            showInfo={false}
            strokeColor="white"
            trailColor="lightgreen"
          />
          <p style={{ color: 'white' }}>{percent}% Increase in 30 Days</p>
        </Col>
      </Row>
    </Card>
  );
};

const { Option } = Select;

const DistributionWithNoSSR = dynamic(() => import('../../../components/charts/distribution'), {
  ssr: false,
});

export default function Page() {
  const [overview, setOverview] = useState(null);
  const [studentDistribution, setStudentDistribution] = useState(null);
  const [teacherDistribution, setTeacherDistribution] = useState(null);
  const [courseStatistics, setCourseStatistics] = useState(null);
  const [distrubtionRole, setDistributionRole] = useState(Role.Student);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [type, setType] = useState(Types.StudentType);

  useEffect(() => {
    // statistics overview part
    apiService.getStatisticsOverview().then((res) => {
      const { data } = res;

      if (!!data) {
        setOverview(data);
      }
    });

    // high chart part
    // distribution for student
    apiService.getStatistics(Role.Student).then((res) => {
      const { data } = res;

      setStudentDistribution(data);
      const totalStudentsNum = data?.type.reduce((acc, cur) => acc + cur.amount, 0);
      setTotalStudents(totalStudentsNum);
    });

    // teacher statistics
    apiService.getStatistics(Role.Teacher).then((res) => {
      const { data } = res;

      setTeacherDistribution(data);
    });

    // course statistics
    apiService.getStatistics(Role.Course).then((res) => {
      const { data } = res;

      setCourseStatistics(data);
      const totalCoursesNum = data?.type.reduce((acc, cur) => acc + cur.amount, 0);
      setTotalCourses(totalCoursesNum);
    });
  }, []);

  return (
    <APPLayout>
      {/* statistics overview part */}
      {overview && (
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={24} md={8}>
            <Overview
              data={overview.student}
              title="TOTAL STUDENTS"
              icon={<SolutionOutlined />}
              percent={(overview.student.lastMonthAdded / overview.student.total).toFixed(3) * 100}
              style={{ background: '#1890ff' }}
            />
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Overview
              data={overview.teacher}
              title="TOTAL TEACHERS"
              icon={<AlibabaOutlined />}
              percent={(overview.teacher.lastMonthAdded / overview.teacher.total).toFixed(3) * 100}
              style={{ background: '#673bb7' }}
            />
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Overview
              data={overview.course}
              title="TOTAL COURSES"
              icon={<ReadOutlined />}
              percent={(overview.course.lastMonthAdded / overview.course.total).toFixed(3) * 100}
              style={{ background: '#ffaa16' }}
            />
          </Col>
        </Row>
      )}

      <Row gutter={[8, 16]}>
        <Col xs={24} sm={24} md={12}>
          <Card
            title="Distribution"
            extra={
              <Select
                defaultValue="student"
                onSelect={(value) => {
                  setDistributionRole(value);
                }}
                bordered={false}
              >
                <Option value={Role.Student}>Student</Option>
                <Option value={Role.Teacher}>Teacher</Option>
              </Select>
            }
          >
            <DistributionWithNoSSR
              data={
                distrubtionRole === Role.Student
                  ? studentDistribution?.country
                  : teacherDistribution?.country
              }
              title={distrubtionRole}
            />
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Card
            title="Types"
            extra={
              <Select
                defaultValue={type}
                onSelect={(value) => {
                  setType(value);
                }}
                bordered={false}
              >
                <Option value={Types.StudentType}>Student Type</Option>
                <Option value={Types.CourseType}>Course Type</Option>
                <Option value={Types.Gender}>Gender</Option>
              </Select>
            }
          >
            {type === 'studentType' ? (
              <Pie
                data={studentDistribution?.type}
                title="Student Type"
                subtitle={`student total: ${totalStudents}`}
              />
            ) : type === 'courseType' ? (
              <Pie
                data={courseStatistics?.type}
                title="Course Type"
                subtitle={`course total: ${totalCourses}`}
              />
            ) : (
              <Row gutter={16}>
                <Col span={12}>
                  <Pie
                    data={Object.entries(overview?.student.gender).map(([name, amount]) => ({
                      name,
                      amount,
                    }))}
                    title="Student Gender"
                    subtitle={`student total: ${overview?.student.total}`}
                  />
                </Col>

                <Col span={12}>
                  <Pie
                    data={Object.entries(overview?.teacher.gender).map(([name, amount]) => ({
                      name,
                      amount,
                    }))}
                    title="Teacher Gender"
                    subtitle={`teacher total: ${overview?.teacher.total}`}
                  />
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[8, 16]}>
        <Col xs={24} sm={24} md={12}>
          <Card title="Increment">
            <Line data={courseStatistics?.createdAt} />
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Card title="Languages">
            <Bar
              data={{
                interest: studentDistribution?.interest,
                teacher: teacherDistribution?.skills,
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Card title="Course Schedule">
            <HeatMap data={courseStatistics?.classTime} title="Course Schedule Per Weekday" />
          </Card>
        </Col>
      </Row>
    </APPLayout>
  );
}
