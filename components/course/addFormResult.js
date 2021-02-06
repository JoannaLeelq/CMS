import { Result, Button } from 'antd';
import { useRouter } from 'next/router';
import storage from '../../lib/services/storage';

export default function AddFormResult({ courseId }) {
  const router = useRouter();

  return (
    <Result
      status="success"
      title="Successfully Create Course!"
      extra={[
        <Button
          type="primary"
          key="detail"
          onClick={() =>
            router.push(`/dashboard/${storage.getUserInfo('cms').role}/courses/${courseId}`)
          }
        >
          Go Course
        </Button>,
        <Button
          key="again"
          onClick={() => {
            router.reload();
          }}
        >
          Create Again
        </Button>,
      ]}
    />
  );
}
