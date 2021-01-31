import {
  Row,
  Col,
  Input,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Spin,
  message,
  Modal,
} from 'antd';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { InboxOutlined, KeyOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import apiService from '../../lib/services/api-service';
import NumberWithUnit from '../common/number-unit';
import { fil } from 'date-fns/locale';
import { format } from 'date-fns';

const StyledFormItem = styled(Form.Item)`
  display: block;
`;

export default function AddCourseForm({ course, onSuccess }) {
  const [form] = Form.useForm();
  const gutterValue = [24, 16];
  const [teachers, setTeachers] = useState([]);
  const [isTeacherSearching, setIsTeacherSearching] = useState(false);
  const [type, setType] = useState([]);
  const [isCodeDisplay, setIsCodeDisplay] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAdd, setIsAdd] = useState(course === undefined);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState();

  const { Option } = Select;
  const { TextArea } = Input;
  const durationUnits = ['hour', 'day', 'week', 'month', 'year'];

  // for start date
  const disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };

  // for course code
  const getCode = () => {
    apiService.getCourseCodes().then((res) => {
      form.setFieldsValue({ courseCode: res.data });
      setIsCodeDisplay(false);
    });
  };

  // type
  const selectType = () => {
    getCode();
  };

  // cover
  const onChange = ({ fileList: newFileList, file }) => {
    console.log('file', file);

    if (file?.thumbUrl) {
      form.setFieldsValue({ cover: file.thumbUrl });
    } else {
      form.setFieldsValue({ cover: course?.cover || '' });
    }
    setIsUploading(file.status === 'uploading');
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
    // const imgWindow = window.open(src);
    // imgWindow.document.write(image.outerHTML);
  };

  const finishForm = async (formContent) => {
    console.log(formContent);
    if (!isAdd && !course) {
      message.error('you must select a course to update!');
      return;
    }

    const addCourseRequest = {
      name: formContent.name,
      teacher: formContent.teacherId,
      uid: formContent.uid,
      startTime: formContent.startTime && format(formContent.startTime, 'yyyy-MM-dd'),
      price: formContent.price,
      maxStudents: formContent.maxStudents,
      duration: formContent.durationPart.duration,
      durationUnit: formContent.durationPart.durationUnit,
      cover: formContent.cover,
    };
  };

  // 仅需要一次
  useEffect(() => {
    apiService.getCourseTypes().then((res) => {
      setType(res.data);
    });
  }, []);

  return (
    <div>
      <Form form={form} onFinish={(formContent) => finishForm(formContent)}>
        {/* the first row */}
        <Row gutter={gutterValue}>
          <Col xs={24} sm={24} md={8}>
            <StyledFormItem
              label="Course Name"
              name="name"
              rules={[{ required: true }, { min: 3, max: 100 }]}
            >
              <Input type="text" placeholder="Course Name" />
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={24} md={16}>
            <Row gutter={gutterValue}>
              <Col xs={24} sm={24} md={8}>
                <StyledFormItem label="Teacher" name="teacherId" rules={[{ required: true }]}>
                  <Select
                    showSearch
                    placeholder="Select Teacher"
                    notFoundContent={isTeacherSearching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={(query) => {
                      setIsTeacherSearching(true);

                      apiService.getTeachers({ query }).then((res) => {
                        const { data } = res;
                        if (!!data) {
                          setTeachers(data.teachers);
                        }
                        setIsTeacherSearching(false);
                      });
                    }}
                  >
                    {teachers.map(({ id, name }) => (
                      <Select.Option key={id} value={id}>
                        {name}
                      </Select.Option>
                    ))}
                  </Select>
                </StyledFormItem>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <StyledFormItem label="Type" name="uid" rules={[{ required: true }]}>
                  <Select onSelect={selectType}>
                    {type.map((item) => (
                      <Option key={item.id} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </StyledFormItem>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <StyledFormItem label="Course Code" name="courseCode" rules={[{ required: true }]}>
                  <Input
                    type="text"
                    placeholder="Course Code"
                    disabled
                    addonAfter={
                      isCodeDisplay ? <KeyOutlined style={{ cursor: 'pointer' }} /> : null
                    }
                  />
                </StyledFormItem>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* second row */}
        <Row gutter={gutterValue}>
          <Col xs={24} sm={24} md={8}>
            <StyledFormItem label="Start Date" name="startTime">
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                disabledDate={disabledDate}
                style={{ width: '100%' }}
              />
            </StyledFormItem>

            <StyledFormItem label="Price" name="price" rules={[{ required: true }]}>
              <InputNumber
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
                step={0.01}
                style={{ width: '100%' }}
              />
            </StyledFormItem>

            <StyledFormItem label="Student Limit" name="maxStudents" rules={[{ required: true }]}>
              <InputNumber min={1} max={10} step={1} style={{ width: '100%' }} />
            </StyledFormItem>

            <StyledFormItem label="Duration" name="durationPart" rules={[{ required: true }]}>
              <Input.Group compact>
                <Form.Item
                  name={['durationPart', 'duration']}
                  noStyle
                  rules={[{ required: true, message: 'duration is required' }]}
                >
                  <Input style={{ width: '85%' }} />
                </Form.Item>
                <Form.Item
                  name={['durationPart', 'durationUnit']}
                  noStyle
                  // rules={[{ required: true, message: 'duration is required' }]}
                >
                  <Select defaultValue={durationUnits} style={{ width: '15%' }}>
                    {durationUnits.map((item, index) => (
                      <Option key={index} value={index}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Input.Group>
            </StyledFormItem>
          </Col>

          <Col xs={24} sm={24} md={16}>
            <Row gutter={gutterValue} style={{ height: '100%' }}>
              <Col xs={24} sm={24} md={12}>
                <StyledFormItem
                  label="Description"
                  name="description"
                  rules={[
                    { required: true },
                    {
                      min: 100,
                      max: 1000,
                      message: 'Description length must between 100 - 1000 characters.',
                    },
                  ]}
                  style={{ height: '100%', border: '1px solid' }}
                >
                  <TextArea placeholder="Course description" style={{ height: '100%' }} />
                </StyledFormItem>
              </Col>

              {/* cover */}
              <Col xs={24} sm={24} md={12} style={{ height: '100%' }}>
                <StyledFormItem label="Cover" name="cover">
                  <ImgCrop rotate aspect={16 / 9}>
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      onChange={onChange}
                      onPreview={onPreview}
                    >
                      {fileList.length >= 1 ? null : (
                        <div>
                          <InboxOutlined />

                          <p>Click or drag file to this area to upload</p>
                        </div>
                      )}
                    </Upload>
                  </ImgCrop>
                </StyledFormItem>

                {isUploading && (
                  <CloseCircleOutlined
                    onClick={() => {
                      setIsUploading(false);
                      setFileList([]);
                    }}
                    style={{ position: 'absolute', top: '0px', right: '0px' }}
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>

        {/* third row */}
        <Row gutter={gutterValue}>
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={isUploading}>
                {isAdd ? 'Create Course' : 'Update Course'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/* Preview cover image */}
      <Modal
        visible={!!preview}
        title={preview?.previewTitle}
        footer={null}
        onCancel={() => setPreview(null)}
      >
        <img alt="example" style={{ width: '100%' }} src={preview?.previewImage} />
      </Modal>
    </div>
  );
}
