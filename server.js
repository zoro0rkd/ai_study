const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 32400;

// public 폴더를 정적 파일 서비스
app.use(express.static(path.join(__dirname, 'public')));

// 문제 JSON 제공
app.get('/questions', (req, res) => {
  const questionsPath = path.join(__dirname, 'questions.json');
  fs.readFile(questionsPath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'questions.json 읽기 실패' });
    try {
      const questions = JSON.parse(data);
      res.json(questions);
    } catch {
      res.status(500).json({ error: 'JSON 파싱 오류' });
    }
  });
});

app.listen(port, () => console.log(`Server listening: http://localhost:${port}`));