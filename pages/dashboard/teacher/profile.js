import APPLayout from '../../../components/layout/Layout';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Cascader,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Radio,
  Rate,
  Row,
  Select,
  Tag,
  DatePicker,
  Tooltip,
  Upload,
} from 'antd';
import apiService from '../../../lib/services/api-service';
import storage from '../../../lib/services/storage';
import { getMonth, getYear, add, isSameDay } from 'date-fns';
import { DurationUnit, Weekdays } from '../../../lib/constant/duration';
import {
  CloseCircleTwoTone,
  MinusCircleOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import moment from 'moment';
import EditableText from '../../../components/common/editableText';
import { Gender } from '../../../lib/constant/gender';
import addressOptions from '../../../public/address.json';
import TextArea from 'antd/lib/input/TextArea';
import { colors } from '../../../lib/constant/color';

const StyledForm = styled(Form)`
  display: flex;
`;

export default function Profile() {
  const [data, setData] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [countries, setCountries] = useState([]);

  // update the form item
  const updateContent = (values) => {
    console.log('values: ', values);

    if (values.birthday) {
      const birthday = values.birthday;
      // console.log(birthday.getMonth());
      values.birthday = moment.format(values.birthday, 'YYYY-MM-DD');
    }

    apiService.updateProfile({ id: data.id, ...values }).then((res) => {
      const { data } = res;

      if (!!data) {
        setData(data);
        setIsEdit(false);
      }
    });
  };

  const cancelChange = () => {
    setIsEdit(false);
    setData(data);
  };

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
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  useEffect(() => {
    const userId = storage?.getUserInfo().userId;

    // get all countries
    apiService.getAllCountries().then((res) => {
      const { data } = res;

      const allEnglishCountries = data.map((item) => item.en);
      setCountries(allEnglishCountries);
    });

    apiService.getProfileByUserId({ userId: userId }).then((res) => {
      const { data } = res;

      console.log('data: ', data);

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
              <Descriptions.Item label="Name">
                {/* {!isEdit ? (
                  <div onClick={()=>{setIsEdit(true)}}>
                    {data?.name}
                  </div>
                  
                ) : (
                  <StyledForm form={form} onFinish={updateContent}>
                    <Form.Item initialValue={data?.name} rules={[{ required: true }]} name="name">
                      <Input /> 
                    </Form.Item>
                    <Form.Item>
                      <Button onClick={cancelChange}>
                        <CloseCircleTwoTone style={{color: 'red'}}/>
                      </Button>
                      <Button htmlType='submit'>
                        <CheckCircleTwoTone />
                      </Button>
                    </Form.Item>

                  </StyledForm>
                )} */}
                <EditableText
                  textPro={data?.name}
                  saveChange={updateContent}
                  cancelChange={cancelChange}
                >
                  <Form.Item initialValue={data?.name} rules={[{ required: true }]} name="name">
                    <Input />
                  </Form.Item>
                </EditableText>
              </Descriptions.Item>

              <Descriptions.Item label="Birthday">
                <EditableText
                  textPro={data?.birthday}
                  saveChange={updateContent}
                  cancelChange={cancelChange}
                >
                  <Form.Item
                    rules={[{ required: true }]}
                    name="birthday"
                    initialValue={moment(data?.birthday)}
                  >
                    <DatePicker />
                  </Form.Item>
                </EditableText>
              </Descriptions.Item>

              <Descriptions.Item label="Gender">
                <EditableText
                  textPro={Gender[data?.gender]}
                  saveChange={updateContent}
                  cancelChange={cancelChange}
                >
                  <Form.Item initialValue={data?.gender} rules={[{ required: true }]} name="gender">
                    <Radio.Group defaultValue={data.gender}>
                      <Radio value={1}>Male</Radio>
                      <Radio value={2}>Female</Radio>
                    </Radio.Group>
                  </Form.Item>
                </EditableText>
              </Descriptions.Item>

              <Descriptions.Item label="Phone">
                <EditableText
                  textPro={data?.phone}
                  saveChange={updateContent}
                  cancelChange={cancelChange}
                >
                  <Form.Item initialValue={data?.phone} rules={[{ required: true }]} name="phone">
                    <Input />
                  </Form.Item>
                </EditableText>
              </Descriptions.Item>

              <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>

              <Descriptions.Item label="Country">
                <EditableText
                  textPro={data?.country}
                  saveChange={updateContent}
                  cancelChange={cancelChange}
                >
                  <Form.Item
                    initialValue={data?.country}
                    rules={[{ required: true }]}
                    name="country"
                  >
                    <Select defaultValue={data?.country}>
                      {countries?.map((item, index) => (
                        <Select.Option value={item} key={index}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </EditableText>
              </Descriptions.Item>

              <Descriptions.Item label="Address">
                <EditableText
                  textPro={data?.address}
                  saveChange={updateContent}
                  cancelChange={cancelChange}
                >
                  <Form.Item
                    initialValue={data?.address}
                    rules={[{ required: true }]}
                    name="address"
                  >
                    <Cascader
                      options={addressOptions}
                      fieldNames={{ label: 'name', value: 'name', children: 'children' }}
                    />
                  </Form.Item>
                </EditableText>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Other" layout="vertical" column={6}>
              <Descriptions.Item label="Skills" span={3}>
                <EditableText
                  textPro={data?.skills.map((item, index) => (
                    <Row key={index} gutter={[2, 6]}>
                      <Col span={4}>
                        <Tag color={colors[index]}>{item.name}</Tag>
                      </Col>
                      <Col offset={1}>
                        <Rate value={item.level} />
                      </Col>
                    </Row>
                  ))}
                  saveChange={updateContent}
                  cancelChange={cancelChange}
                  initialValues={{ skills: data?.skills }}
                  displaybutton="vertical"
                >
                  <Form.List name="skills">
                    {(fields, { add, remove }) => {
                      console.log(
                        '%c [ fields ]',
                        'font-size:13px; background:pink; color:#bf2c9f;',
                        fields
                      );

                      return (
                        <>
                          {fields.map((field) => (
                            <Row gutter={[2, 6]} key={field.key}>
                              <Col span={10}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'name']}
                                  fieldKey={[field.fieldKey, 'name']}
                                  rules={[{ required: true }]}
                                >
                                  <Input placeholder="Skill Name" />
                                </Form.Item>
                              </Col>

                              <Col span={10}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'level']}
                                  fieldKey={[field.fieldKey, 'level']}
                                  rules={[{ required: true }]}
                                >
                                  <Rate count={5} />
                                </Form.Item>
                              </Col>

                              <Col span={2}>
                                <Form.Item>
                                  <MinusCircleOutlined
                                    onClick={() => {
                                      if (fields.length > 1) {
                                        remove(field.name);
                                      } else {
                                        message.warn('You must set at least one skill.');
                                      }
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          ))}

                          <Row>
                            <Col span={20}>
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  size="large"
                                  onClick={() => add()}
                                  block
                                  icon={<PlusOutlined />}
                                >
                                  Add Skill
                                </Button>
                              </Form.Item>
                            </Col>
                          </Row>
                        </>
                      );
                    }}
                  </Form.List>
                </EditableText>
              </Descriptions.Item>

              <Descriptions.Item label="Intro" span={3}>
                <EditableText
                  textPro={data?.description}
                  saveChange={updateContent}
                  cancelChange={cancelChange}
                  displaybutton="vertical"
                >
                  <Form.Item
                    initialValue={data?.description}
                    rules={[{ required: true }]}
                    name="description"
                  >
                    <TextArea />
                  </Form.Item>
                </EditableText>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>
    </APPLayout>
  );
}
