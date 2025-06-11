(async function() {
  const questions = await fetch('/questions').then(r => r.json());
  let current = questions[0].number;
  const answers = {};
  const review = {};

  function renderSidebar() {
    const sb = document.getElementById('sidebar');
    sb.innerHTML = '';
    questions.forEach(q => {
      const div = document.createElement('div');
      div.textContent = '문제 ' + q.number;
      div.className = 'qnum';
      const ans = answers[q.number];
      const answered = q.type === 'objective'
        ? ans !== null && ans !== undefined
        : Array.isArray(ans) && ans.every(a => a.trim() !== '');
      if (answered) div.classList.add('answered');
      if (review[q.number]) div.classList.add('review');
      div.onclick = () => { current = q.number; render(); };
      sb.appendChild(div);
    });
  }

  function render() {
    renderSidebar();
    const main = document.getElementById('main');
    const q = questions.find(x => x.number === current);
    main.innerHTML = '';

    // 리뷰 체크박스
    const rb = document.createElement('label');
    rb.innerHTML = '<input type="checkbox"/> 나중에 다시 보기';
    const cb = rb.querySelector('input');
    cb.checked = !!review[q.number];
    cb.onchange = () => { review[q.number] = cb.checked; renderSidebar(); };
    main.appendChild(rb);

    // 문제 제목 및 질문
    const h2 = document.createElement('h2');
    h2.textContent = '문제 ' + q.number;
    main.appendChild(h2);
    const p = document.createElement('p');
    p.textContent = q.question;
    main.appendChild(p);

    // 설명 또는 이미지
    if (q.explanation) {
      const div = document.createElement('div');
      div.className = 'explanation';
      if (/\.(png|jpe?g|gif)$/i.test(q.explanation)) {
        const img = document.createElement('img');
        img.src = q.explanation;
        div.appendChild(img);
      } else {
        div.textContent = q.explanation;
      }
      main.appendChild(div);
    }

    // 답안 입력
    if (q.type === 'objective') {
      q.choices.forEach((c, i) => {
        const lbl = document.createElement('label');
        lbl.innerHTML = `<input type="radio" name="q${q.number}" value="${i}"/> ${i+1}. ${c}`;
        const input = lbl.querySelector('input');
        input.checked = answers[q.number] == i;
        input.onchange = () => {
          answers[q.number] = i;
          render();
        };
        main.appendChild(lbl);
      });
      if (answers[q.number] === undefined) answers[q.number] = null;
    } else {
      for (let i = 0; i < q.textboxCount; i++) {
        const ta = document.createElement('textarea');
        ta.rows = 4;
        ta.value = (answers[q.number]?.[i]) || '';
        ta.oninput = () => {
          answers[q.number] = answers[q.number] || Array(q.textboxCount).fill('');
          answers[q.number][i] = ta.value;
          renderSidebar();
          updateFooter();
        };
        main.appendChild(ta);
      }
    }

    // Footer: 이전/다음/제출 버튼
    const footer = document.createElement('div');
    footer.id = 'footer';
    const idx = questions.findIndex(x => x.number === current);

    if (idx > 0) {
      const btnPrev = document.createElement('button');
      btnPrev.textContent = '이전 문제';
      btnPrev.className = 'prev';
      btnPrev.onclick = () => { current = questions[idx-1].number; render(); };
      footer.appendChild(btnPrev);
    }

    if (idx < questions.length - 1) {
      const btnNext = document.createElement('button');
      btnNext.textContent = '다음 문제';
      btnNext.className = 'next';
      btnNext.onclick = () => { current = questions[idx+1].number; render(); };
      footer.appendChild(btnNext);
    } else {
      const btnSubmit = document.createElement('button');
      btnSubmit.textContent = '제출';
      btnSubmit.className = 'submit';
      btnSubmit.onclick = submitAnswers;
      footer.appendChild(btnSubmit);
      
    }

    main.appendChild(footer);
    updateFooter();
  }

  function updateFooter() {
    const footer = document.getElementById('footer');
    if (!footer) return;
    const submitBtn = footer.querySelector('button.submit');
    if (!submitBtn) return;
    const allAnswered = questions.every(q => {
      const ans = answers[q.number];
      if (q.type === 'objective') return ans !== null && ans !== undefined;
      return Array.isArray(ans) && ans.every(a => a.trim() !== '');
    });
    submitBtn.disabled = !allAnswered;
  }

  function submitAnswers() {
    const data = questions.map(q => ({ number: q.number, answer: answers[q.number] }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'answers.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // 초기 렌더링
  render();
})();
