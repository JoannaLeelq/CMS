import { Result, Button } from 'antd';
import { useRouter } from 'next/router';

export default function AddFormResult() {
  const router = useRouter();

  return (
    <Result
      status="success"
      title="Successfully Create Course!"
      extra={[
        <Button type="primary" key="detail" onClick={() => router.push('/dashboard/')}>
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
