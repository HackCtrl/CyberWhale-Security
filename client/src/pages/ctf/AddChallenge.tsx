import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockChallenges, Challenge } from '@/data/challenges';
import { challengeHints, challengeFlags } from '@/data/challengeData';

// Интерфейс для входных данных JSON
interface ChallengeInput {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  tags: string[];
  solved: boolean;
  solvedBy: number;
  createdAt: string;
  updatedAt: string;
  downloadUrl: string;
  fileType: string;
  hints: string[];
  flag: string;
}

export default function AddChallenge() {
  const navigate = useNavigate();

  const handleTestImport = () => {
    fetch('/test-challenge.json', { method: 'GET' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Не удалось загрузить файл (статус: ${response.status})`);
        }
        alert('Файл успешно загружен, парсим JSON...');
        return response.json();
      })
      .then((json: ChallengeInput[]) => {
        alert(`Получен JSON: ${JSON.stringify(json, null, 2)}`);
        if (!Array.isArray(json)) {
          throw new Error('JSON должен быть массивом');
        }

        const newChallenges: Challenge[] = json.map((item: ChallengeInput) => {
          alert(`Проверяем кейс: ${JSON.stringify(item)}`);
          if (!item.id || !item.title || !item.description || !item.category || !item.difficulty || !item.points || !item.tags || !item.solvedBy) {
            throw new Error('Некорректный формат кейса: отсутствуют обязательные поля');
          }

          if (!item.hints || !Array.isArray(item.hints) || item.hints.length === 0) {
            throw new Error(`Кейс с ID ${item.id} должен содержать массив подсказок (hints)`);
          }
          if (!item.flag || typeof item.flag !== 'string') {
            throw new Error(`Кейс с ID ${item.id} должен содержать флаг (flag) в виде строки`);
          }

          return {
            id: item.id,
            title: item.title,
            description: item.description,
            category: item.category,
            difficulty: item.difficulty,
            points: item.points,
            tags: item.tags,
            solved: item.solved !== undefined ? item.solved : false,
            solvedBy: item.solvedBy,
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
            downloadUrl: item.downloadUrl || '',
            fileType: item.fileType || '',
          };
        });

        const existingIds = new Set(mockChallenges.map(c => c.id));
        for (const challenge of newChallenges) {
          if (existingIds.has(challenge.id)) {
            throw new Error(`Кейс с ID ${challenge.id} уже существует`);
          }
        }

        mockChallenges.push(...newChallenges);

        json.forEach((item: ChallengeInput) => {
          challengeHints[item.id] = item.hints;
          challengeFlags[item.id] = item.flag;
        });

        alert(`Кейсы импортированы. Успешно добавлено ${newChallenges.length} новых кейсов`);
        navigate('/ctf');
      })
      .catch((error: Error) => {
        alert(`Ошибка импорта: ${error.message}`);
      });
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#111827', color: '#e5e7eb' }}>
      <Link to="/ctf" style={{ color: '#60a5fa', display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '8px' }}>←</span> Назад к CTF платформе
      </Link>

      <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '24px', marginTop: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
          Импорт новых кейсов
        </h1>
        <p style={{ color: '#d1d5db', marginBottom: '24px' }}>
          Нажмите кнопку ниже, чтобы протестировать импорт тестового кейса из файла внутри проекта.
        </p>

        <button
          onClick={handleTestImport}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <span style={{ marginRight: '8px' }}>↑</span> Тестовый импорт
        </button>

        <div style={{ marginTop: '24px', backgroundColor: '#374151', padding: '16px', borderRadius: '8px', color: '#d1d5db' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Пример формата JSON:
          </h3>
          <pre style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
{`[
  {
    "id": "11",
    "title": "Тестовый кейс",
    "description": "Это тестовый кейс для проверки импорта.",
    "category": "web",
    "difficulty": "beginner",
    "points": 100,
    "tags": ["web", "test"],
    "solved": false,
    "solvedBy": 0,
    "createdAt": "2025-05-18",
    "updatedAt": "2025-05-18",
    "downloadUrl": "https://example.com/test.zip",
    "fileType": "archive",
    "hints": [
      "Проверьте первую подсказку.",
      "Попробуйте вторую подсказку."
    ],
    "flag": "CW{TestFlag123}"
  }
]`}
          </pre>
        </div>
      </div>
    </div>
  );
}