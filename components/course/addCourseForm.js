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
import styles from '../../styles/components/addCourse.module.css';

// css part
const StyledFormItem = styled(Form.Item)`
  display: block;
`;

const UploadCover = styled(Form.Item)`
  display: block;
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 37px;
    bottom: 30px;
  }

  .ant-upload-picture-card-wrapper,
  .ant-form-item-control-input,
  .ant-form-item-control-input div {
    width: 100%;
    height: 100%;
  }

  .ant-upload-picture-card-wrapper,
  .ant-upload-list-picture-card {
    width: 100%;
    height: 100%;
  }

  .ant-upload-select-picture-card {
    width: 100%;
    height: 100%;
  }

  .ant-upload-list-item-progress,
  .ant-tooltip {
    height: auto !important;
    .ant-tooltip-arrow {
      height: 13px;
    }
  }

  .ant-upload-list-item-actions {
    .anticon-delete {
      color: red;
    }
  }

  .ant-upload-list-picture-card img {
    object-fit: cover !important;
  }
`;

const UploadInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(240, 240, 240);
  width: 100%;
  .anticon {
    font-size: 44px;
    color: #1890ff;
  }
  p {
    font-size: 24px;
    color: #999;
  }
`;

export default function AddCourseForm({ course, onSuccess }) {
  const [form] = Form.useForm();
  const gutterValue = [24, 16];
  const [teachers, setTeachers] = useState([]);
  const [isTeacherSearching, setIsTeacherSearching] = useState(false);
  const [type, setType] = useState([]);
  const [isCodeDisplay, setIsCodeDisplay] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState();

  const { Option } = Select;
  const { TextArea } = Input;
  const durationUnits = ['hour', 'day', 'week', 'month', 'year'];

  // for start date
  const disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };

  const formatStartTime = (value) =>
    `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;

  // get type id
  const getTypeId = (value) => type.find((element) => element.name === value).id;

  // for course code
  const getCode = () => {
    apiService.getCourseCodes().then((res) => {
      form.setFieldsValue({ uid: res.data });
      setIsCodeDisplay(false);
    });
  };

  // cover
  const onChange = ({ fileList: newFileList, file }) => {
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
  };

  const closeUploadingImg = () => {
    form.setFieldsValue({ cover: '' });
    setIsUploading(false);
    setFileList([]);
    console.log(fileList);
  };

  const finishForm = async (formContent) => {
    const addCourseRequest = {
      name: formContent?.name,
      uid: formContent?.uid,
      detail: formContent?.description,
      startTime: formContent && formatStartTime(formContent.startTime._d),
      price: formContent?.price,
      maxStudents: formContent?.maxStudents,
      duration: formContent && parseInt(formContent.durationPart.duration),
      durationUnit: formContent?.durationPart.durationUnit,
      cover: formContent?.cover,
      teacherId: formContent?.teacherId,
      type: formContent?.type.map((item) => getTypeId(item)),
    };

    const response = isAdd
      ? apiService.addCourse(addCourseRequest)
      : apiService.updateCourse({ ...addCourseRequest, id: course?.id });

    const { data } = await response;
    console.log(data);
    if (!!data) {
      setIsAdd(false);
    }

    if (!!onSuccess) {
      onSuccess(data);
    }
  };

  useEffect(() => {
    // get course code
    if (isAdd) {
      getCode();
    }

    apiService.getCourseTypes().then((res) => {
      setType(res.data);
    });
  }, []);

  return (
    <div className="courseDetail">
      <Form form={form} onFinish={finishForm}>
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
                <StyledFormItem label="Type" name="type" rules={[{ required: true }]}>
                  <Select mode="multiple">
                    {type.map((item) => (
                      <Option key={item.id} value={item.name}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </StyledFormItem>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <StyledFormItem label="Course Code" name="uid" rules={[{ required: true }]}>
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
                format="DD/MM/YYYY"
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
                  <Input style={{ width: '80%' }} />
                </Form.Item>
                <Form.Item
                  name={['durationPart', 'durationUnit']}
                  noStyle
                  // rules={[{ required: true, message: 'duration is required' }]}
                >
                  <Select defaultValue={durationUnits[0]} style={{ width: '20%' }}>
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
                  style={{ height: '100%' }}
                >
                  <TextArea placeholder="Course description" rows={13} style={{ height: '100%' }} />
                </StyledFormItem>
              </Col>

              {/* cover */}
              <Col xs={24} sm={24} md={12}>
                <UploadCover
                  label="Cover"
                  name="cover"
                  className="cover"
                  style={{ width: '100%', height: '84%' }}
                >
                  <ImgCrop rotate aspect={16 / 9}>
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange}
                      onPreview={onPreview}
                      style={{ width: '100%', height: '100%', border: '1px solid' }}
                    >
                      {fileList.length >= 1 ? null : (
                        <UploadInner>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>

                          <p>Click or drag file to this area to upload</p>
                        </UploadInner>
                      )}
                    </Upload>
                  </ImgCrop>
                </UploadCover>

                {isUploading && (
                  <CloseCircleOutlined
                    onClick={closeUploadingImg}
                    style={{
                      position: 'absolute',
                      top: '1em',
                      right: '-10px',
                      color: 'red',
                      fontSize: '24px',
                    }}
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
