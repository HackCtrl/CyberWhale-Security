import 'dotenv/config';
import { verifyCaptcha } from '../server/captcha';

(async () => {
  console.log('Running verifyCaptcha test with token "test-token"');
  const ok = await verifyCaptcha('test-token');
  console.log('verifyCaptcha returned:', ok);
  process.exit(ok ? 0 : 1);
})();
