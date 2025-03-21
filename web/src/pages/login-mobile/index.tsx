import { useLogin } from '@/hooks/login-hooks';
import { rsaPsw } from '@/utils';
import { Button, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'umi';

import logo from '@/assets/logo-with-text.png';

import styles from './index.less';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useLogin();
  const { t } = useTranslation('translation', { keyPrefix: 'login' });

  const [form] = Form.useForm();

  const onCheck = async () => {
    try {
      const params = await form.validateFields();
      const rsaPassWord = rsaPsw(params.password) as string;

      const code = await login({
        email: `${params.email}`.trim(),
        password: rsaPassWord,
      });
      if (code === 0) {
        navigate('/m/search');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={`${styles.loginBody} p-6`}>
        <Form form={form} layout="vertical" name="dynamic_rule">
          <div className={styles.logo}>
            <img src={logo} alt="RAGFlow" />
          </div>
          <Form.Item
            name="email"
            label={t('emailLabel')}
            rules={[{ required: true, message: t('emailPlaceholder') }]}
          >
            <Input size="large" placeholder={t('emailPlaceholder')} />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('passwordLabel')}
            rules={[{ required: true, message: t('passwordPlaceholder') }]}
          >
            <Input.Password
              size="large"
              placeholder={t('passwordPlaceholder')}
              onPressEnter={onCheck}
            />
          </Form.Item>
          <Button
            type="primary"
            block
            size="large"
            onClick={onCheck}
            loading={loading}
          >
            {t('login')}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
