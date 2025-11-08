import 'dotenv/config';
import { emailService } from '../emailService';

async function main() {
  const target = process.argv[2] || 'test-unisender-recipient@example.com';
  console.log('Sending test email to', target);
  const ok = await emailService.sendEmail({
    to: target,
    subject: 'Local script test',
    text: 'Test message from send_test_local.ts'
  });
  console.log('send result:', ok);
  if (typeof emailService.getLastSent === 'function') {
    console.log('lastSent:', emailService.getLastSent(5));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
