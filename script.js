// CTRL + ALT + ESCAPE — GDG Assiut landing page + interactive challenge simulation

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    mainNav.classList.toggle('is-open', !isOpen);
  });
  mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
  }));
  document.addEventListener('click', (event) => {
    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
      menuToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('is-open');
    }
  });
}

// Reveal sections gently as they enter the viewport.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else revealItems.forEach((item) => item.classList.add('is-visible'));

// Five-stage browser demo. Correct answers unlock the next challenge in order.
const challenges = [
  {
    title: 'Decode the Message', kicker: 'CHALLENGE_01 // LOGIC & CRYPTOGRAPHY',
    prompt: 'The attacker left a Caesar-cipher message. Each letter was shifted forward by 3. Shift the letters backward by 3 to reveal the access word.',
    puzzle: '<span class="puzzle-accent">ENCRYPTED MESSAGE</span>\n\nRSHQ\n\n<span class="puzzle-yellow">RULE:</span> Move each letter 3 places backward in the alphabet.',
    label: 'Decoded access word', placeholder: 'Type the decoded word...', answer: 'OPEN', hint: 'R becomes O, S becomes P. Apply the same shift to every letter.',
    success: 'Message decoded. The first access clue is OPEN. Stage 02 unlocked.'
  },
  {
    title: 'Debug the System', kicker: 'CHALLENGE_02 // PROGRAMMING',
    prompt: 'A junior developer left a simple access check in the system. Read the code and determine what it prints when age is 21.',
    puzzle: '<span class="puzzle-accent">01</span>  age = 21\n<span class="puzzle-accent">02</span>  if age >= 18:\n<span class="puzzle-accent">03</span>      print("ACCESS")\n<span class="puzzle-accent">04</span>  else:\n<span class="puzzle-accent">05</span>      print("DENIED")\n\n<span class="puzzle-yellow">QUESTION:</span> What is the exact output?',
    label: 'Program output', placeholder: 'Enter the output...', answer: 'ACCESS', hint: '21 is greater than or equal to 18, so the first branch runs.',
    success: 'Bug report cleared. The program returns ACCESS. Stage 03 unlocked.'
  },
  {
    title: 'Database Mystery', kicker: 'CHALLENGE_03 // DATABASES & SQL',
    prompt: 'The incident database contains several records. Which SQL clause filters rows to match a condition, such as status = \'suspicious\'?',
    puzzle: '<span class="puzzle-accent">SELECT</span> ip_address, status\n<span class="puzzle-accent">FROM</span> access_logs\n<span class="puzzle-yellow">????</span> status = \'suspicious\';\n\n<span class="puzzle-green">Available clue:</span> one SQL keyword is missing.',
    label: 'Missing SQL keyword', placeholder: 'Enter the SQL clause...', answer: 'WHERE', hint: 'It is the SQL clause that comes after FROM and before the filtering condition.',
    success: 'Query executed. The clue WHERE is verified. Stage 04 unlocked.'
  },
  {
    title: 'Cybersecurity Investigation', kicker: 'CHALLENGE_04 // SECURITY LOGS',
    prompt: 'Review the simulated authentication log. Identify the IP address responsible for the repeated failed login attempts.',
    puzzle: '<span class="puzzle-accent">09:41:02</span>  10.0.0.3  LOGIN_SUCCESS\n<span class="puzzle-accent">09:41:08</span>  10.0.0.7  LOGIN_FAILED\n<span class="puzzle-accent">09:41:11</span>  10.0.0.7  LOGIN_FAILED\n<span class="puzzle-accent">09:41:15</span>  10.0.0.7  LOGIN_FAILED\n<span class="puzzle-accent">09:41:19</span>  10.0.0.7  LOGIN_FAILED\n<span class="puzzle-accent">09:41:22</span>  10.0.0.7  LOGIN_FAILED\n\n<span class="puzzle-yellow">QUESTION:</span> Which IP address looks suspicious?',
    label: 'Suspicious IP address', placeholder: 'Example: 10.0.0.7', answer: '10.0.0.7', hint: 'Look for the same source address appearing repeatedly with LOGIN_FAILED.',
    success: 'Suspicious activity traced to 10.0.0.7. Stage 05 unlocked.'
  },
  {
    title: 'Final System Unlock', kicker: 'CHALLENGE_05 // FINAL MISSION',
    prompt: 'Combine the clues you recovered from the previous stages in order. Use uppercase letters and the hyphens exactly as shown.',
    puzzle: '<span class="puzzle-accent">CLUE 01</span>  OPEN\n<span class="puzzle-accent">CLUE 02</span>  ACCESS\n<span class="puzzle-accent">CLUE 03</span>  WHERE\n<span class="puzzle-accent">CLUE 04</span>  10.0.0.7\n\n<span class="puzzle-yellow">FINAL ACCESS FORMAT</span>\nOPEN-ACCESS-WHERE-7',
    label: 'Final system access code', placeholder: 'Enter the final access code...', answer: 'OPEN-ACCESS-WHERE-7', hint: 'Use the first three clues as words, then the final number from the suspicious IP. The required format is shown above.',
    success: 'Final access code accepted. The DevFest system has been restored.'
  }
];

const game = {
  current: 0, completed: new Set(), hintsUsed: new Set(), seconds: 30 * 60, timerId: null, finished: false
};
const stageSidebar = document.querySelector('#stageSidebar');
const gameTimer = document.querySelector('#gameTimer');
const gameStageLabel = document.querySelector('#gameStageLabel');
const gameProgressText = document.querySelector('#gameProgressText');
const gameProgressBar = document.querySelector('#gameProgressBar');
const gameKicker = document.querySelector('#gameKicker');
const gameTitle = document.querySelector('#gameTitle');
const gamePrompt = document.querySelector('#gamePrompt');
const puzzleBox = document.querySelector('#puzzleBox');
const answerForm = document.querySelector('#answerForm');
const challengeAnswer = document.querySelector('#challengeAnswer');
const answerLabel = document.querySelector('#answerLabel');
const submitAnswer = document.querySelector('#submitAnswer');
const gameFeedback = document.querySelector('#gameFeedback');
const hintButton = document.querySelector('#hintButton');
const hintBox = document.querySelector('#hintBox');
const resetGame = document.querySelector('#resetGame');

function normalizeAnswer(value) {
  return value.trim().toUpperCase().replace(/\s+/g, '');
}
function updateTimer() {
  if (!gameTimer) return;
  const mins = Math.floor(game.seconds / 60).toString().padStart(2, '0');
  const secs = (game.seconds % 60).toString().padStart(2, '0');
  gameTimer.textContent = `${mins}:${secs}`;
  gameTimer.parentElement.classList.toggle('is-low', game.seconds <= 60);
}
function startTimer() {
  clearInterval(game.timerId);
  game.timerId = setInterval(() => {
    if (game.finished || game.seconds <= 0) {
      clearInterval(game.timerId);
      if (game.seconds <= 0 && !game.finished) {
        gameFeedback.textContent = 'Time is up. Restart the simulation to try again.';
        gameFeedback.className = 'game-feedback is-error';
        challengeAnswer.disabled = true;
        submitAnswer.disabled = true;
      }
      return;
    }
    game.seconds -= 1;
    updateTimer();
  }, 1000);
}
function renderSidebar() {
  if (!stageSidebar) return;
  stageSidebar.innerHTML = challenges.map((challenge, index) => {
    const complete = game.completed.has(index);
    const active = index === game.current && !game.finished;
    const locked = index > game.current && !game.completed.has(index);
    const status = complete ? 'COMPLETE' : locked ? 'LOCKED' : 'IN PROGRESS';
    return `<button type="button" class="stage-nav-item ${active ? 'is-active' : ''} ${complete ? 'is-complete' : ''}" data-stage="${index}" ${locked || game.finished ? 'disabled' : ''} aria-current="${active ? 'step' : 'false'}"><span class="stage-nav-num">${complete ? '✓' : String(index + 1).padStart(2, '0')}</span><span class="stage-nav-copy"><strong>${challenge.title}</strong><small>${status}</small></span></button>`;
  }).join('');
  stageSidebar.querySelectorAll('[data-stage]').forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.stage);
    if (index <= game.current && !game.finished) { game.current = index; renderChallenge(); }
  }));
}
function renderChallenge() {
  if (!answerForm || !stageSidebar) return;
  const oldNextButton = document.querySelector('#nextChallengeButton');
  if (oldNextButton) oldNextButton.remove();
  const challenge = challenges[game.current];
  renderSidebar();
  gameStageLabel.textContent = `STAGE ${String(game.current + 1).padStart(2, '0')} / 05`;
  gameProgressText.textContent = `${game.completed.size} of 5 challenges complete`;
  gameProgressBar.style.width = `${game.completed.size * 20}%`;
  gameKicker.textContent = challenge.kicker;
  gameTitle.textContent = challenge.title;
  gamePrompt.textContent = challenge.prompt;
  puzzleBox.innerHTML = challenge.puzzle;
  answerLabel.textContent = challenge.label;
  challengeAnswer.placeholder = challenge.placeholder;
  challengeAnswer.value = '';
  challengeAnswer.disabled = false;
  submitAnswer.disabled = false;
  gameFeedback.textContent = '';
  gameFeedback.className = 'game-feedback';
  hintBox.hidden = true;
  hintBox.textContent = '';
  hintButton.disabled = game.hintsUsed.has(game.current);
  hintButton.innerHTML = game.hintsUsed.has(game.current) ? 'Hint already used <span>(−10 seconds)</span>' : 'Request a hint <span>(−10 seconds)</span>';
}
function showCompletion() {
  game.finished = true;
  clearInterval(game.timerId);
  renderSidebar();
  gameStageLabel.textContent = 'MISSION COMPLETE';
  gameProgressText.textContent = '5 of 5 challenges complete';
  gameProgressBar.style.width = '100%';
  gameKicker.textContent = 'DEVFEST_CORE // SYSTEM RESTORED';
  gameTitle.textContent = 'Mission accomplished.';
  gamePrompt.textContent = 'Your team decoded the message, debugged the program, queried the database, traced the suspicious activity, and restored the system.';
  puzzleBox.innerHTML = '<div class="game-complete"><div class="complete-icon">✓</div><h4>ACCESS GRANTED</h4><p>DEVFEST SYSTEM STATUS: <strong>RESTORED</strong></p><p>Challenges completed: <strong>5 / 5</strong><br>Hints used: <strong>' + game.hintsUsed.size + '</strong><br>Time remaining: <strong>' + gameTimer.textContent + '</strong></p></div>';
  answerForm.hidden = true;
  gameFeedback.textContent = 'Excellent work, operator. You completed the simulation.';
  gameFeedback.className = 'game-feedback is-success';
  hintButton.disabled = true;
  hintBox.hidden = true;
}
if (answerForm && stageSidebar) {
  renderChallenge();
  startTimer();
  answerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (game.finished || game.seconds <= 0) return;
    const challenge = challenges[game.current];
    if (normalizeAnswer(challengeAnswer.value) !== normalizeAnswer(challenge.answer)) {
      gameFeedback.textContent = 'Not quite. Check the clue and try again.';
      gameFeedback.className = 'game-feedback is-error';
      challengeAnswer.focus();
      return;
    }
    game.completed.add(game.current);
    gameFeedback.textContent = challenge.success;
    gameFeedback.className = 'game-feedback is-success';
    gameProgressText.textContent = `${game.completed.size} of 5 challenges complete`;
    gameProgressBar.style.width = `${game.completed.size * 20}%`;
    renderSidebar();
    if (game.completed.size === challenges.length) {
      answerForm.hidden = true;
      showCompletion();
      return;
    }
    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className = 'button button-primary';
    nextButton.style.marginTop = '10px';
    nextButton.innerHTML = 'Proceed to next challenge <span>→</span>';
    nextButton.addEventListener('click', () => {
      game.current += 1;
      renderChallenge();
      document.querySelector('.game-main').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      challengeAnswer.focus();
    }, { once: true });
    const oldNext = document.querySelector('#nextChallengeButton');
    if (oldNext) oldNext.remove();
    nextButton.id = 'nextChallengeButton';
    gameFeedback.after(nextButton);
    challengeAnswer.disabled = true;
    submitAnswer.disabled = true;
  });
  hintButton.addEventListener('click', () => {
    if (game.hintsUsed.has(game.current) || game.finished) return;
    game.hintsUsed.add(game.current);
    game.seconds = Math.max(0, game.seconds - 10);
    updateTimer();
    hintBox.textContent = challenges[game.current].hint;
    hintBox.hidden = false;
    hintButton.disabled = true;
    hintButton.innerHTML = 'Hint used <span>(−10 seconds)</span>';
  });
  resetGame.addEventListener('click', () => {
    clearInterval(game.timerId);
    game.current = 0;
    game.completed = new Set();
    game.hintsUsed = new Set();
    game.seconds = 30 * 60;
    game.finished = false;
    answerForm.hidden = false;
    const nextButton = document.querySelector('#nextChallengeButton');
    if (nextButton) nextButton.remove();
    updateTimer();
    renderChallenge();
    startTimer();
  });
}

// Close the mobile navigation with Escape.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle && mainNav) {
    menuToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
  }
});
