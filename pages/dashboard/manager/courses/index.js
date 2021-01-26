import { Button, List, Spin } from 'antd';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import APPLayout from '../../../../components/layout/layout';
import CourseOverview from '../../../../components/course/courseOverview';
import apiService from '../../../../lib/services/api-service';
import BackTop from '../../../../components/common/back-top';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [paginator, setPaginator] = useState({ limit: 8, page: 1 });
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    apiService.getCourses(paginator).then((res) => {
      const total = res.data.total;
      const newCourses = res.data.courses;
      const displayedCourses = [...courses, ...newCourses];

      setCourses(displayedCourses);
      setHasMore(total > displayedCourses.length);
    });
  }, [paginator]);

  return (
    <APPLayout>
      <InfiniteScroll
        next={() => setPaginator({ ...paginator, page: paginator.page + 1 })}
        hasMore={hasMore}
        loader={
          <div>
            <Spin size="large" style={{ position: 'relative', left: '50%' }} />
          </div>
        }
        dataLength={courses.length}
        endMessage={<h3>No More Courses</h3>}
        scrollableTarget="contentPart"
        style={{ overflow: 'hidden' }}
      >
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 }}
          dataSource={courses}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <CourseOverview {...item}>
                <Link href={`/dashboard/manager/courses/${item.id}`} passHref>
                  <Button type="primary">Read More</Button>
                </Link>
              </CourseOverview>
            </List.Item>
          )}
        />
      </InfiniteScroll>

      <BackTop />
    </APPLayout>
  );
}
