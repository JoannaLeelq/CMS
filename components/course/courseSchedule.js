import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, TimePicker, Select, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import apiService from '../../lib/services/api-service';

export default function CourseSchedule({ courseId, scheduleId, onSuccess }) {
  const [form] = Form.useForm();
  const gutterValue = [24, 16];
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [isAdd, setIsAdd] = useState(true);
  const [time, setTime] = useState(null);
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const { Option } = Select;

  const initialValues = {
    chapters: [{ name: '', content: '' }],
    classTime: [{ weekday: '', time: '' }],
  };

  const onChange = (time) => {
    setTime(time);
  };

  const finishForm = (chapterSchedule) => {
    if (!courseId && !scheduleId) {
      message.error('You must select a course to update!');
      return;
    }

    // handle chapter and classTime
    const { chapters, classTime } = chapterSchedule;
    const formattedClassTime = classTime.map(({ weekday, time }) => {
      return `${weekday} ${time._d.getHours()}:${time._d.getMinutes()}:${time._d.getSeconds()}`;
    });

    const courseSchedule = {
      scheduleId: scheduleId,
      courseId: courseId,
      current: 0,
      status: 0,
      chapters: chapters.map((item, index) => ({ ...item, order: index + 1 })),
      classTime: formattedClassTime,
    };

    if (!!chapterSchedule) {
      setIsAdd(false);
    }

    apiService.updateSchedule(courseSchedule).then((res) => {
      if (!!onSuccess && res.data) {
        onSuccess();
      }
    });
  };

  useEffect(() => {
    if (!scheduleId) {
      return;
    }

    const { data } = apiService.getScheduleById({ courseId, scheduleId });
    console.log(data);

    if (!!data) {
      // const classTime
    }
  }, [scheduleId]);

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
            <Form.List name="chapters">
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
                          <TimePicker
                            value={time}
                            format="HH:mm:ss"
                            onChange={onChange}
                            size="large"
                            style={{ width: '100%' }}
                          />
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
                    <Button
                      type="dashed"
                      onClick={() => {
                        updateSelectedWeekdays();
                        add();
                      }}
                      block
                      icon={<PlusOutlined />}
                    >
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
