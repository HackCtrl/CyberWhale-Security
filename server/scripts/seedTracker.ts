import { initDb, createTask, getTasks } from '../trackerDb';
import tasks from '../../client/src/data/mvpRoadmap';

async function seed() {
  initDb();
  const existing = getTasks();
  if (existing.length > 0) {
    console.log('DB already seeded — skipping');
    return;
  }

  for (const t of tasks) {
    createTask({
      title: t.title,
      description: t.description,
      epic: t.epic,
      status: t.status,
      percent_complete: t.percent,
      estimate_days: t.estimate_days,
      tags: [ `month:${t.month}`, `sprint:${t.sprint}` ],
    });
    console.log('Inserted:', t.id, t.title);
  }

  console.log('Seeding complete');
}

seed().catch(e => {
  console.error('Seed failed', e);
  process.exit(1);
});
