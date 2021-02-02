import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Row, Col, TimePicker, Select, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export default function CourseSchedule(onSuccess) {
  const [form] = Form.useForm();
  const gutterValue = [24, 16];
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [isAdd, setIsAdd] = useState(true);
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const { Option } = Select;

  const initialValues = {
    chapter: [{ name: '', content: '' }],
    classTime: [{ weekday: '', time: '' }],
  };

  const finishForm = (chapterSchedule) => {
    console.log(chapterSchedule);
    const courseSchedule = {
      detail: chapterSchedule,
    };

    if (!!chapterSchedule) {
      setIsAdd(false);
    }

    console.log(onSuccess);
    if (!!onSuccess) {
      onSuccess();
    }
  };

  useEffect(() => {
    if (isAdd) {
      return;
    }
  }, []);

  // when delete weekday update it
  const updateSelectedWeekdays = (value) => {
    const selectedItem = form.getFieldValue('classTime');
    const deleteItem = selectedItem[value];

    let afterDeletedItem = selectedWeekdays.filter((item) => item !== deleteItem?.weekday);

    setSelectedWeekdays(afterDeletedItem);
  };

  return (
    <div className="courseSchedule">
      <Form form={form} name="schedule" initialValues={initialValues} onFinish={finishForm}>
        <Row gutter={gutterValue}>
          <Col xs={24} sm={24} md={12}>
            <h2>Chapter Detail</h2>
            <Form.List name="chapter">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Row key={field.key} gutter={[12, 12]}>
                      <Col span={10}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          fieldKey={[field.fieldKey, 'name']}
                          rules={[{ required: true, message: 'Missing chapter name' }]}
                        >
                          <Input size="large" placeholder="Chapter Name" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'content']}
                          fieldKey={[field.fieldKey, 'content']}
                          rules={[{ required: true, message: 'Missing chapter content' }]}
                        >
                          <Input size="large" placeholder="Chapter content" />
                        </Form.Item>
                      </Col>

                      <Col span={2}>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(field.name);
                            } else {
                              message.warn('You must set at least one chapter.');
                            }
                          }}
                        />
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Chapter
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <h2>Class times</h2>

            <Form.List name="classTime">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Row key={field.key} gutter={[12, 12]}>
                      <Col span={10}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'weekday']}
                          fieldKey={[field.fieldKey, 'weekday']}
                          rules={[{ required: true, message: 'Missing weekday' }]}
                        >
                          <Select
                            size="large"
                            onChange={(value) => setSelectedWeekdays([...selectedWeekdays, value])}
                          >
                            {weekdays.map((day, index) => {
                              // console.log(day);
                              return (
                                <Option
                                  key={index}
                                  value={day}
                                  disabled={selectedWeekdays.includes(day)}
                                  style={{ width: '100%' }}
                                >
                                  {day}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'time']}
                          fieldKey={[field.fieldKey, 'time']}
                          rules={[{ required: true, message: 'Missing class time' }]}
                        >
                          <TimePicker size="large" style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>

                      <Col span={2}>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              updateSelectedWeekdays(field.name);
                              remove(field.name);
                            } else {
                              message.warn('You must set at least one class time.');
                            }
                          }}
                        />
                      </Col>
                    </Row>
                  ))}

                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Class Time
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
