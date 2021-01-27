import { Button, Result, Steps } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import APPLayout from '../../../../components/layout/layout';
import AddCourseForm from '../../../../components/course/addCourseForm';
import UpdateCourseDetailForm from '../../../../components/course/updateCourseDetailForm';
import AddFormResult from '../../../../components/course/addFormResult';

const { Step } = Steps;

export default function AddCoursePage() {
  const [step, setStep] = useState(0);

  const steps = [<AddCourseForm />, <UpdateCourseDetailForm />, <AddFormResult />];

  return (
    <APPLayout>
      <Steps type="navigation">
        <Step title="Course Detail" />
        <Step title="Course Schedule" />
        <Step title="Success" />
        {/* <Step status="wait" title="Step 4" /> */}
      </Steps>

      {steps.map((item, index) => (
        <div key={index} style={{ display: index === step ? 'block' : 'none' }}>
          {item}
        </div>
      ))}
    </APPLayout>
  );
}
