import { Button, Result, Steps } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import APPLayout from '../../../../components/layout/layout';
import AddCourseForm from '../../../../components/course/addCourseForm';
import CourseSchedule from '../../../../components/course/courseSchedule';
import AddFormResult from '../../../../components/course/addFormResult';

const { Step } = Steps;

export default function AddCoursePage() {
  const [step, setStep] = useState(0);
  const [courseId, setCourseId] = useState(0);
  const [scheduleId, setScheduleId] = useState(0);
  const [currentStep, setCurrentStep] = useState([0]);
  const [course, setCourse] = useState(null);

  const next = () => {
    setStep(step + 1);
    setCurrentStep([...currentStep, step + 1]);
  };

  const steps = [
    <AddCourseForm
      course={course}
      onSuccess={(courseDetail) => {
        setCourse(courseDetail);
        setCourseId(courseDetail.id);
        setScheduleId(courseDetail.scheduleId);
        next();
      }}
    />,
    <CourseSchedule
      courseId={courseId}
      scheduleId={scheduleId}
      onSuccess={() => {
        next();
      }}
    />,
    <AddFormResult courseId={courseId} />,
  ];

  return (
    <APPLayout>
      <Steps
        current={step}
        type="navigation"
        onChange={(current) => {
          if (currentStep.includes(current)) {
            setStep(current);
          }
        }}
      >
        <Step title="Course Detail" />
        <Step title="Course Schedule" />
        <Step title="Success" />
      </Steps>

      {steps.map((item, index) => (
        <div key={index} style={{ display: index === step ? 'block' : 'none' }}>
          {item}
        </div>
      ))}
    </APPLayout>
  );
}
