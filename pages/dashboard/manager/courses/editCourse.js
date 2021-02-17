import styled from 'styled-components';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';
import { Input, Tabs, Select, Row, Col, Spin } from 'antd';
import APPLayout from '../../../../components/layout/layout';
import AddCourseForm from '../../../../components/course/addCourseForm';
import CourseSchedule from '../../../../components/course/courseSchedule';
import apiService from '../../../../lib/services/api-service';

export default function EditCoursePage() {
  const { TabPane } = Tabs;
  const [searchType, setSearchType] = useState('uid');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState([]);
  const [target, setTarget] = useState('');
  const [course, setCourse] = useState(null);

  // search course
  const searchCourse = useCallback(
    debounce((searchContent) => {
      if (!searchContent) {
        return;
      }
      setIsSearching(true);

      apiService
        .getCourses({ [searchType]: searchContent })
        .then((res) => {
          const { data } = res;
          if (!!data) {
            setResult(data.courses);
          }
        })
        .finally(() => setIsSearching(false));
    }, 1000),
    [searchType]
  );

  useEffect(() => {
    if (!!target) {
      apiService.getCourses({ [searchType]: target }).then((res) => {
        const { data } = res;

        if (!!data) {
          setCourse(data.courses[0]);
        }
      });
    }
  }, [target]);

  return (
    <APPLayout>
      <div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Input.Group compact style={{ display: 'flex' }}>
              <Select
                defaultValue="uid"
                onSelect={(value) => {
                  setSearchType(value);
                }}
              >
                <Select.Option value="uid">Code</Select.Option>
                <Select.Option value="name">Name</Select.Option>
                <Select.Option value="type">Category</Select.Option>
              </Select>

              <Select
                showSearch
                placeholder={`Search course by ${searchType}`}
                notFoundContent={isSearching ? <Spin size="small" /> : null}
                filterOption={false}
                onSelect={(value) => {
                  setTarget(value);
                }}
                onSearch={searchCourse}
                style={{ width: '100%' }}
              >
                {result.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item[searchType]}>
                      {item[searchType]}
                    </Select.Option>
                  );
                })}
              </Select>
            </Input.Group>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Tabs type="card" style={{ width: '100%' }}>
            <TabPane tab="Course Detail" key="1">
              <AddCourseForm course={course} />
            </TabPane>

            <TabPane tab="Course Schedule" key="2">
              <CourseSchedule courseId={course?.id} scheduleId={course?.scheduleId} isAdd={false} />
            </TabPane>
          </Tabs>
        </Row>
      </div>
    </APPLayout>
  );
}
