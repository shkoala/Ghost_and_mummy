(() => {
  'use strict';
  const story = window.MUMMY_STORY;
  const STORE = 'shkoala-mummy-story-v1';
  const $ = id => document.getElementById(id);
  const fresh = () => ({ version: story.version, page: 0, steps: {}, solved: [] });
  let progress = load();
  let picked = new Set();
  let toastTimer;
  let speaking = false;
  let lastCelebration = '';

  const paths = {
    listen: '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M17 8a6 6 0 0 1 0 8M20 5a10 10 0 0 1 0 14"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    fullscreen: '<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/>',
    teacher: '<path d="m2 8 10-5 10 5-10 5L2 8Z"/><path d="M6 11v6c3 3 9 3 12 0v-6M22 8v7"/>',
    pointer: '<path d="m8 3 11 11-6 1-3 6L8 3Z"/>'
  };
  const svg = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.pointer}</svg>`;
  const icon = name => {
    const eyes = colour => `<path d="M2 16c5-10 13-10 18 0-5 9-13 9-18 0Zm24 0c5-10 13-10 18 0-5 9-13 9-18 0Z" fill="#fff" stroke="#a48b72" stroke-width="1.5"/><circle cx="11" cy="16" r="5" fill="${colour}"/><circle cx="35" cy="16" r="5" fill="${colour}"/><circle cx="11" cy="16" r="2.6" fill="#342725"/><circle cx="35" cy="16" r="2.6" fill="#342725"/><circle cx="12.5" cy="14.5" r="1.3" fill="#fff"/><circle cx="36.5" cy="14.5" r="1.3" fill="#fff"/>`;
    const items = {
      eyes: eyes('#89502c'), 'blue-eyes': eyes('#5d94cf'),
      white: '<circle cx="23" cy="16" r="11.5" fill="#fff" stroke="#b5a9c5" stroke-width="2"/>',
      green: '<circle cx="23" cy="16" r="11.5" fill="#88b442" stroke="#5e8634" stroke-width="2"/>',
      wing: '<path d="M7 24C8 11 19 3 40 5c-2 3-4 6-8 8l5 1c-3 4-6 5-10 6l3 2c-7 4-16 5-23 2Z" fill="#fdfbf6" stroke="#a29ab3" stroke-width="1.5"/><path d="m9 24 22-13" stroke="#a29ab3" stroke-width="1.5"/>',
      ghost: '<path d="M13 26V15a10 10 0 0 1 20 0v11l-4-3-3 3-3-3-3 3-3-3-4 3Z" fill="#fff" stroke="#aa9abb" stroke-width="1.5"/><circle cx="20" cy="14" r="2" fill="#89502c"/><circle cx="27" cy="14" r="2" fill="#89502c"/>',
      water: '<path d="M3 14q5-7 10 0t10 0t10 0t10 0M3 24q5-7 10 0t10 0t10 0t10 0" fill="none" stroke="#6599b9" stroke-width="3" stroke-linecap="round"/>',
      two: '<path d="M18 7v15h-5m15-15v15h5" stroke="#9e7a51" fill="none" stroke-width="4" stroke-linecap="round"/>',
      four: '<path d="M7 8v15h-3m15-15v15h-3M31 8v15h-3M43 8v15h-3" stroke="#9e7a51" fill="none" stroke-width="3" stroke-linecap="round"/>'
    };
    return `<svg viewBox="0 0 46 32" aria-hidden="true">${items[name] || items.ghost}</svg>`;
  };

  function load() {
    try {
      const value = JSON.parse(localStorage.getItem(STORE));
      if (!value || value.version !== story.version || !Number.isInteger(value.page) || !value.steps || typeof value.steps !== 'object' || Array.isArray(value.steps) || !Array.isArray(value.solved)) return fresh();
      value.page = Math.max(0, Math.min(story.pages.length - 1, value.page));
      value.solved = value.solved.filter(key => typeof key === 'string');
      for (const page of story.pages) {
        const n = value.steps[page.id];
        value.steps[page.id] = Number.isInteger(n) ? Math.max(0, Math.min(page.steps.length - 1, n)) : 0;
      }
      return value;
    } catch (_) { return fresh(); }
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(progress)); } catch (_) { /* Story remains playable when storage is unavailable. */ } }
  function page() { return story.pages[progress.page]; }
  function stepIndex() { return progress.steps[page().id] || 0; }
  function step() { return page().steps[stepIndex()]; }
  function key() { return `${page().id}:${stepIndex()}`; }
  function solved() { return progress.solved.includes(key()); }
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function picture(name, className, alt = '') {
    const img = el('img', className);
    img.src = `assets/${name}.png`;
    img.alt = alt;
    img.draggable = false;
    img.decoding = 'async';
    return img;
  }
  function toast(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    toastTimer = setTimeout(() => { $('toast').textContent = ''; }, 5500);
  }
  function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    speaking = false;
    $('listen').innerHTML = svg('listen');
    $('listen').setAttribute('aria-pressed', 'false');
    $('listen').setAttribute('aria-label', 'Read this page aloud');
  }
  function readPage() {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      toast('Read aloud is not available in this browser. You can read the story together.');
      return;
    }
    if (speaking) { stopSpeech(); return; }
    const lines = solved() && step().after?.length ? step().after : step().lines;
    let text = lines.map(line => `${story.speakers[line.who].name} says: ${line.text}`).join(' ');
    text += ` ${step().prompt} ${step().instruction} `;
    if (!solved()) text += step().choices.map(choice => choice.text).join('. ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.83;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;
    utterance.onend = () => stopSpeech();
    utterance.onerror = event => {
      const interrupted = event.error === 'canceled' || event.error === 'interrupted';
      stopSpeech();
      if (!interrupted) toast('The English voice is unavailable. Please read this page together.');
    };
    speaking = true;
    $('listen').innerHTML = svg('stop');
    $('listen').setAttribute('aria-pressed', 'true');
    $('listen').setAttribute('aria-label', 'Stop reading');
    try { window.speechSynthesis.speak(utterance); } catch (_) { stopSpeech(); toast('The voice is unavailable. Please read this page together.'); }
  }
  function drawScene() {
    const p = page();
    $('scene').className = `scene scene-${p.scene}`;
    const world = el('div', 'world');
    if (p.background === 'room') {
      const room = el('div', 'room-crop');
      room.append(picture('house', 'backdrop', p.place));
      world.append(room);
    } else world.append(picture(p.background, 'backdrop', p.place));
    world.append(picture('little-ghost', 'character ghost', 'Little Ghost'));
    if (p.partner) world.append(picture(p.partner, 'character partner', story.speakers[p.partner]?.name || p.partner));
    $('scene').replaceChildren(world);
    if (p.scene === 'intro') {
      const title = el('div', 'intro-heading');
      title.append(el('span', '', 'A story to play'));
      title.append(document.createTextNode('Are you my mummy?'));
      $('scene').append(title);
    }
    if (step().mode === 'hotspots') {
      step().choices.forEach((choice, i) => world.append(makeChoice(choice, i, true)));
    }
    $('scene-caption').textContent = p.caption;
  }
  function makeChoice(choice, i, hotspot = false) {
    const selected = picked.has(choice.id);
    const button = el('button', `${hotspot ? 'hotspot' : 'choice'}${selected ? ' selected' : ''}`);
    button.type = 'button';
    button.dataset.choice = choice.id;
    button.setAttribute('aria-label', choice.text);
    if (step().mode === 'multi') button.setAttribute('aria-pressed', String(selected));
    button.disabled = solved();
    if (hotspot) {
      button.style.left = `${choice.x}%`;
      button.style.top = `${choice.y}%`;
      button.style.width = `${choice.width}%`;
      button.style.height = `${choice.height}%`;
      button.append(el('span', 'hotspot-label', `${selected ? '✓ ' : ''}${choice.text}`));
    } else {
      const badge = el('span', 'letter', selected ? '✓' : String.fromCharCode(65 + i));
      badge.setAttribute('aria-hidden', 'true');
      if (choice.image) {
        button.append(badge, picture(choice.image, '', ''), el('span', '', choice.text));
      } else if (choice.icon) {
        const graphic = el('span', 'choice-icon');
        graphic.innerHTML = icon(choice.icon);
        button.append(graphic, el('span', '', choice.text));
      } else button.append(badge, el('span', '', choice.text));
    }
    button.addEventListener('click', () => choose(choice.id, button));
    return button;
  }
  function drawDialogue() {
    const lines = solved() && step().after?.length ? step().after : step().lines;
    $('dialogue').replaceChildren(...lines.map(line => {
      const speaker = story.speakers[line.who];
      const speech = el('div', `speech ${speaker.colour}`);
      speech.append(el('span', 'speaker', speaker.name), el('p', '', line.text));
      return speech;
    }));
  }
  function drawClues() {
    const known = new Set();
    story.pages.forEach((p, pi) => p.steps.forEach((s, si) => {
      if (s.unlock && (progress.solved.includes(`${p.id}:${si}`) || pi < progress.page)) s.unlock.forEach(id => known.add(id));
    }));
    $('clues').replaceChildren(...story.clues.map(clue => {
      const chip = el('div', known.has(clue.id) ? 'clue' : 'clue locked');
      if (known.has(clue.id)) {
        const graphic = el('span');
        graphic.innerHTML = icon(clue.icon);
        chip.append(graphic, document.createTextNode(clue.text));
      } else {
        chip.append(el('span', '', '?'));
        chip.setAttribute('aria-label', 'A clue to discover');
      }
      return chip;
    }));
  }
  function render(options = {}) {
    const p = page(), s = step();
    picked = new Set(solved() ? s.correct : []);
    $('chapter').textContent = `Chapter ${progress.page + 1}`;
    $('place').textContent = p.place;
    $('chapter-label').textContent = p.chapter;
    $('page-title').textContent = p.title;
    $('question').textContent = s.prompt;
    $('instruction').textContent = s.instruction;
    $('step-dots').setAttribute('aria-label', `Question ${stepIndex() + 1} of ${p.steps.length}`);
    $('step-dots').replaceChildren(...p.steps.map((_, i) => el('span', i === stepIndex() ? 'current' : progress.solved.includes(`${p.id}:${i}`) ? 'done' : '')));
    drawScene();
    drawDialogue();
    $('choices').className = `choices ${s.mode}${s.choices.length === 4 ? ' four' : ''}`;
    if (s.mode === 'hotspots') {
      const hint = el('div', 'picture-hint');
      hint.innerHTML = svg('pointer');
      hint.append(document.createTextNode('Click on the picture to choose.'));
      $('choices').replaceChildren(hint);
    } else $('choices').replaceChildren(...s.choices.map((choice, i) => makeChoice(choice, i)));
    $('feedback').className = 'feedback';
    $('feedback').textContent = solved() ? s.success : '';
    $('back').disabled = progress.page === 0 && stepIndex() === 0;
    const final = progress.page === story.pages.length - 1;
    $('next').disabled = !solved();
    const nextText = !solved() ? 'Choose an answer' : stepIndex() < p.steps.length - 1 ? 'Next question' : final ? 'Play again' : 'Next page';
    $('next').replaceChildren(document.createTextNode(nextText), el('span', '', final && solved() ? '↻' : '→'));
    $('next').lastElementChild.setAttribute('aria-hidden', 'true');
    $('page-number').textContent = `Page ${progress.page + 1} of ${story.pages.length}`;
    $('progress-bar').style.width = `${((progress.page + (solved() ? 1 : 0.2)) / story.pages.length) * 100}%`;
    drawClues();
    drawMap();
    document.title = `${p.short} · Are you my mummy?`;
    if (options.navigate) {
      document.querySelector('.story-panel').scrollTop = 0;
      $('page-title').focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 760px)').matches) {
        if (options.samePage) $('page-title').scrollIntoView({ block: 'start', behavior: 'smooth' });
        else $('main').scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }
    if (s.celebrate && solved() && lastCelebration !== key()) celebrate();
    if (!s.celebrate) $('celebration').replaceChildren();
    save();
  }
  function choose(id, button) {
    if (solved()) return;
    const s = step();
    if (!s.correct.includes(id)) {
      button.classList.remove('wrong');
      void button.offsetWidth;
      button.classList.add('wrong');
      $('feedback').className = 'feedback hint';
      $('feedback').textContent = s.wrong;
      setTimeout(() => button.classList.remove('wrong'), 1000);
      return;
    }
    if (s.mode === 'multi') {
      if (picked.has(id)) picked.delete(id); else picked.add(id);
      button.classList.toggle('selected', picked.has(id));
      button.setAttribute('aria-pressed', String(picked.has(id)));
      $('feedback').className = 'feedback';
      $('feedback').textContent = `${picked.size} of ${s.correct.length} clues found.`;
      if (picked.size !== s.correct.length) return;
    }
    stopSpeech();
    progress.solved.push(key());
    render();
    $('next').focus({ preventScroll: true });
    if (s.mode === 'hotspots' && window.matchMedia('(max-width: 760px)').matches) $('page-title').scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  function next() {
    if (!solved()) return;
    stopSpeech();
    const currentStep = stepIndex();
    if (currentStep < page().steps.length - 1) {
      progress.steps[page().id] = currentStep + 1;
      render({ navigate: true, samePage: true });
    } else if (progress.page < story.pages.length - 1) {
      progress.page += 1;
      render({ navigate: true });
    } else $('restart-dialog').showModal();
  }
  function back() {
    stopSpeech();
    if (stepIndex() > 0) {
      progress.steps[page().id] = stepIndex() - 1;
      render({ navigate: true, samePage: true });
    } else if (progress.page > 0) {
      progress.page -= 1;
      progress.steps[page().id] = page().steps.length - 1;
      render({ navigate: true });
    }
  }
  function drawMap() {
    $('page-map').replaceChildren(...story.pages.map((p, i) => {
      const button = el('button', i === progress.page ? 'active' : '', `${String(i + 1).padStart(2, '0')}  ${p.short}`);
      button.type = 'button';
      button.addEventListener('click', () => {
        stopSpeech();
        progress.page = i;
        progress.steps[p.id] = 0;
        $('teacher-dialog').close();
        render({ navigate: true });
      });
      return button;
    }));
  }
  function celebrate() {
    lastCelebration = key();
    $('celebration').replaceChildren(...Array.from({ length: 25 }, (_, i) => {
      const star = el('span', '', i % 3 === 0 ? '♥' : '✦');
      star.style.setProperty('--x', `${(i * 37) % 100}%`);
      star.style.setProperty('--s', `${16 + (i % 4) * 7}px`);
      star.style.setProperty('--d', `${(i % 8) * 0.14}s`);
      star.style.setProperty('--c', ['#dba552', '#9d7db8', '#d28b94', '#8da577'][i % 4]);
      return star;
    }));
  }
  $('listen').innerHTML = svg('listen');
  $('fullscreen').innerHTML = svg('fullscreen');
  $('teacher').innerHTML = svg('teacher');
  $('listen').addEventListener('click', readPage);
  $('next').addEventListener('click', next);
  $('back').addEventListener('click', back);
  $('teacher').addEventListener('click', () => { stopSpeech(); $('teacher-dialog').showModal(); });
  $('restart').addEventListener('click', () => { $('teacher-dialog').close(); $('restart-dialog').showModal(); });
  $('confirm-restart').addEventListener('click', () => {
    stopSpeech();
    progress = fresh();
    lastCelebration = '';
    $('restart-dialog').close();
    render({ navigate: true });
  });
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }));
  $('fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else toast('Full screen is unavailable in this browser.');
    } catch (_) { toast('Full screen is unavailable here. You can still play the story.'); }
  });
  document.addEventListener('fullscreenchange', () => $('fullscreen').setAttribute('aria-label', document.fullscreenElement ? 'Exit full screen' : 'Full screen'));
  document.addEventListener('keydown', event => {
    if (document.querySelector('dialog[open]') || event.altKey || event.ctrlKey || event.metaKey || /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(event.target.tagName) || event.target.isContentEditable) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); back(); }
  });
  window.addEventListener('pagehide', stopSpeech);
  render();
  // All paths are relative, so a repository name can be anything on GitHub Pages.
  ['cat', 'mummy', 'frog', 'owl', 'spider', 'little-ghost', 'forest', 'pond', 'web', 'house', 'gate', 'room'].forEach(name => { const img = new Image(); img.src = `assets/${name}.png`; });
})();
