import APPLayout from '../../../../components/layout/layout';
import 'antd/dist/antd.css';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import apiService from '../../../../lib/services/api-service';
import { Row, Col, Card, Tag } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import styled from 'styled-components';

export const H3 = styled.h3`
  color: #7356f1;
  margin: 20px 0px;
  font-size: 24px;
`;

const tagColor = [
  'magenta',
  'volcano',
  'orange',
  'gold',
  'green',
  'cyan',
  'geekblue',
  'purple',
  'red',
  'lime',
];

export async function getServerSideProps(context) {
  return {
    props: { id: context.params.id },
  };
}

export default function DetailPage(props) {
  const router = useRouter();
  const [data, setData] = useState();
  const [left, setLeft] = useState([]);
  const [aboutInfo, setAbout] = useState([]);
  const [key, setKey] = useState({ key: 'about' });

  const tabList = [
    { key: 'about', tab: 'About' },
    { key: 'courses', tab: 'Courses' },
  ];

  const aboutPart = (about) => (
    <div>
      <H3>Information</H3>

      <Row gutter={[6, 16]}>
        {about.map((item) => (
          <Col span={24} key={item.label}>
            <b style={{ marginRight: 16, minWidth: 150, display: 'inline-block' }}>{item.label}:</b>
            <span>{item.value}</span>
          </Col>
        ))}
      </Row>

      <H3>Interesting</H3>

      <Row gutter={[6, 16]}>
        <Col>
          {data?.interest.map((item, index) => (
            <Tag color={tagColor[index]} key={item} style={{ padding: '5px 10px' }}>
              {item}
            </Tag>
          ))}
        </Col>
      </Row>

      <H3>Description</H3>

      <Row gutter={[6, 16]}>
        <Col>{data?.description}</Col>
      </Row>
    </div>
  );

  const onTabChange = (key, type) => {
    setKey({ [type]: key });
  };

  useEffect(() => {
    debugger;
    const id = router.query.id || props.id;
    apiService.getStudentProfile({ id }).then((res) => {
      console.log(res.data);
      setData(res.data);
      const left = [
        { label: 'Name', value: res.data.name },
        { label: 'Age', value: res.data.age },
        { label: 'Email', value: res.data.email },
        { label: 'Phone', value: res.data.phone },
        { label: 'Address', value: res.data.address },
      ];

      const aboutInfo = [
        { label: 'Eduction', value: res.data.education },
        { label: 'Area', value: res.data.country },
        { label: 'Gender', value: res.data.gender === 1 ? 'Male' : 'Female' },
        { label: 'Member Period', value: res.data.memberStartAt + ' - ' + res.data.memberEndAt },
        { label: 'Type', value: res.data.typeName },
        { label: 'Create Time', value: res.data.ctime },
        { label: 'Update Time', value: res.data.updateAt },
      ];
      setLeft(left);
      setAbout(aboutInfo);
    });
  }, []);

  const contentList = {
    about: aboutPart(aboutInfo),
    courses: (
      <div>
        <p>m</p>
        <p>n</p>
      </div>
    ),
  };

  return (
    <APPLayout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <Card
            title={
              <Avatar
                src={data?.avatar}
                style={{ width: 100, height: 100, display: 'block', margin: 'auto' }}
              />
            }
          >
            <Row>
              {left.map((item) => {
                if (item.label !== 'Address') {
                  return (
                    <Col span={12} style={{ textAlign: 'center' }}>
                      <h3>{item.label}</h3>
                      <p>{item.value}</p>
                    </Col>
                  );
                } else {
                  return (
                    <Col span={24} style={{ textAlign: 'center' }}>
                      <h3>{item.label}</h3>
                      <p>{item.value}</p>
                    </Col>
                  );
                }
              })}
            </Row>
          </Card>
        </Col>

        <Col span={16}>
          <Card
            tabList={tabList}
            activeTabKey={key.key}
            onTabChange={(key) => {
              console.log(key);
              onTabChange(key, 'key');
            }}
          >
            {contentList[key.key]}
          </Card>
        </Col>
      </Row>
    </APPLayout>
  );
}
