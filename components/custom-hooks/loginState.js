// 路由和用户类型的耦合
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import storage from '../../lib/services/storage';

export function useLoginState() {
  const router = useRouter();

  useEffect(() => {
    if (!storage.token) {
      router.push('/login', undefined, { shallow: true });
    }

    if (!!storage.loginType) {
      router.push(`/dashboard/${storage.loginType}`, undefined, { shallow: true });
    }
  }, []);

  return storage;
}

export function useUserType() {
  const router = useRouter();

  return storage.loginType || router.pathname.split('/')[2];
}
