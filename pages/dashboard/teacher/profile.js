import APPLayout from '../../../components/layout/Layout';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { Calendar, Card, Modal, Descriptions, Tooltip, Upload, Divider } from 'antd';
import apiService from '../../../lib/services/api-service';
import storage from '../../../lib/services/storage';
import { getMonth, getYear, add, isSameDay } from 'date-fns';
import { DurationUnit, Weekdays } from '../../../lib/constant/duration';
import { ClockCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

export default function Profile() {
  const [data, setData] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState();

  // cover
  const onChange = ({ fileList: newFileList, file }) => {
    //   if(file ?.response){

    //   }
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;

    setPreview({
      previewImage: src,
      previewTitle: file.name,
    });
  };

  useEffect(() => {
    const userId = storage?.getUserInfo().userId;
    apiService.getProfileByUserId({ userId: userId }).then((res) => {
      const { data } = res;

      setData(data);
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: data.avatar,
        },
      ]);
    });
  }, []);

  return (
    <APPLayout>
      <Card
        title="My Profile"
        extra={
          <Tooltip placement="topRight" title="Double click content to edit">
            <QuestionCircleOutlined />
          </Tooltip>
        }
      >
        <ImgCrop rotate aspect={16 / 9}>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
          >
            {fileList.length < 1 && '+ Upload'}
          </Upload>
        </ImgCrop>

        <Divider />

        {data && (
          <>
            <Descriptions title="Basic Info">
              <Descriptions.Item label="Name"></Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>
    </APPLayout>
  );
}
