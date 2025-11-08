// Quick local test: calls server/emailService directly using local .env
import 'dotenv/config';
import { emailService } from '../emailService.js';

async function main() {
  const ok = await emailService.sendEmail({
    to: process.argv[2] || 'test-unisender-recipient@example.com',
    subject: 'Local script test',
    text: 'Test message from send_test_local.js'
  });
  console.log('send result:', ok);
  // If emailService.getLastSent exists, print it
  if (typeof emailService.getLastSent === 'function') {
    console.log('lastSent:', emailService.getLastSent(5));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
