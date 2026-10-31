(() => {
  'use strict';
  const story = window.MUMMY_STORY;
  const STORE = 'shkoala-mummy-story-v2';
  const $ = id => document.getElementById(id);
  const fresh = () => ({ version: story.version, page: 0, steps: {}, solved: [], drafts: {}, frames: {}, read: {} });
  let progress = load();
  let mounted = '';
  let motionTimer;
  let toastTimer;
  let speaking = false;
  let speechSession = 0;
  let celebrated = '';
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const paths = {
    listen: '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M17 8a6 6 0 0 1 0 8M20 5a10 10 0 0 1 0 14"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    fullscreen: '<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/>',
    teacher: '<path d="m2 8 10-5 10 5-10 5L2 8Z"/><path d="M6 11v6c3 3 9 3 12 0v-6M22 8v7"/>',
    replay: '<path d="M3 10a9 9 0 1 1 2 9M3 4v6h6"/>'
  };
  const svg = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.replay}</svg>`;
  const node = (tag, cls = '', text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  const markup = text => { const holder = node('div'); holder.innerHTML = text; return holder.firstElementChild; };
  const picture = (name, cls = '', alt = '') => {
    const img = node('img', cls); img.src = `assets/${name}.png`; img.alt = alt; img.draggable = false; img.decoding = 'async'; return img;
  };
  const icon = name => {
    const eyes = colour => `<path d="M2 20C8 4 21 4 27 20c-6 13-19 13-25 0Zm35 0C43 4 56 4 62 20c-6 13-19 13-25 0Z" fill="#fff" stroke="#a78c79" stroke-width="1.5"/><circle cx="14.5" cy="19" r="9" fill="${colour}"/><circle cx="49.5" cy="19" r="9" fill="${colour}"/><circle cx="14.5" cy="19" r="5" fill="#302827"/><circle cx="49.5" cy="19" r="5" fill="#302827"/><circle cx="17" cy="16" r="2.5" fill="#fff"/><circle cx="52" cy="16" r="2.5" fill="#fff"/>`;
    const legs = count => Array.from({ length: count }, (_, i) => `<path d="M${12 + i * (40 / Math.max(1, count - 1))} 8v23h-7" fill="none" stroke="#ad895b" stroke-width="5" stroke-linecap="round"/>`).join('');
    const items = {
      eyes: eyes('#8d5635'), 'blue-eyes': eyes('#7a9fcb'),
      white: '<circle cx="32" cy="20" r="17" fill="#fff" stroke="#ae9dbd" stroke-width="2"/>',
      green: '<circle cx="32" cy="20" r="17" fill="#82ac57" stroke="#638c3e" stroke-width="2"/>',
      'no-legs': '<path d="M17 35V18a15 15 0 0 1 30 0v17l-5-4-5 4-5-4-5 4-5-4-5 4Z" fill="#fff" stroke="#aa99bc" stroke-width="1.8"/><circle cx="27" cy="17" r="3" fill="#885334"/><circle cx="38" cy="17" r="3" fill="#885334"/><path d="M28 25q5 5 10 0" fill="none" stroke="#885334" stroke-width="1.5"/>',
      'two-legs': legs(2), 'four-legs': legs(4),
      water: '<path d="M2 15q6-8 12 0t12 0t12 0t12 0t12 0M2 29q6-8 12 0t12 0t12 0t12 0t12 0" fill="none" stroke="#648da8" stroke-width="3" stroke-linecap="round"/>'
    };
    return `<svg viewBox="0 0 64 40" aria-hidden="true">${items[name] || items['no-legs']}</svg>`;
  };

  function load() {
    try {
      const v = JSON.parse(localStorage.getItem(STORE));
      if (!v || v.version !== story.version || !Number.isInteger(v.page) || !Array.isArray(v.solved)) return fresh();
      for (const field of ['steps', 'drafts', 'frames', 'read']) if (!v[field] || typeof v[field] !== 'object' || Array.isArray(v[field])) v[field] = {};
      v.page = Math.max(0, Math.min(story.pages.length - 1, v.page));
      const keys = [];
      story.pages.forEach(p => {
        v.steps[p.id] = Number.isInteger(v.steps[p.id]) ? Math.max(0, Math.min(p.steps.length - 1, v.steps[p.id])) : 0;
        p.steps.forEach((s, i) => {
          const k = `${p.id}:${i}`; keys.push(k);
          v.read[k] = Number.isInteger(v.read[k]) ? Math.max(0, Math.min(s.opening?.length || 0, v.read[k])) : 0;
          v.frames[k] = Number.isInteger(v.frames[k]) ? Math.max(0, Math.min(s.after.length - 1, v.frames[k])) : 0;
          const ids = s.choices.map(c => c.id);
          v.drafts[k] = Array.isArray(v.drafts[k]) ? [...new Set(v.drafts[k].filter(id => ids.includes(id)))] : [];
          if (s.mode === 'multi') v.drafts[k] = v.drafts[k].filter(id => s.correct.includes(id));
          if (s.mode === 'order' && v.drafts[k].some((id, ix) => id !== s.correct[ix])) v.drafts[k] = [];
        });
      });
      v.solved = [...new Set(v.solved.filter(k => keys.includes(k)))];
      return v;
    } catch (_) { return fresh(); }
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(progress)); } catch (_) {} }
  const page = () => story.pages[progress.page];
  const index = () => progress.steps[page().id] || 0;
  const step = () => page().steps[index()];
  const key = () => `${page().id}:${index()}`;
  const solved = () => progress.solved.includes(key());
  const frame = () => progress.frames[key()] || 0;
  const opening = () => !solved() && (progress.read[key()] || 0) < (step().opening?.length || 0);
  const draft = () => progress.drafts[key()] || [];
  const currentLines = () => opening() ? step().opening[progress.read[key()] || 0] : solved() ? step().after[frame()] : step().before;

  function toast(text) {
    clearTimeout(toastTimer); $('toast').textContent = text;
    toastTimer = setTimeout(() => { $('toast').textContent = ''; }, 5000);
  }
  function stopSpeech() {
    speechSession++;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    speaking = false; $('listen').innerHTML = svg('listen');
    $('listen').setAttribute('aria-pressed', 'false'); $('listen').setAttribute('aria-label', 'Read this page aloud');
  }
  function readPage() {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { toast('The English voice is unavailable. Read the story together.'); return; }
    if (speaking) { stopSpeech(); return; }
    stopSpeech();
    const session = speechSession;
    let text = currentLines().map(l => `${story.speakers[l.who].name} says: ${l.text}`).join(' ');
    if (!opening()) text += ` ${step().prompt} ${step().instruction} ${solved() ? '' : step().choices.map(c => c.text).join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-GB'; utterance.rate = .83;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;
    utterance.onend = () => { if (session === speechSession) stopSpeech(); };
    utterance.onerror = e => {
      if (session !== speechSession) return;
      stopSpeech();
      if (!['canceled', 'interrupted'].includes(e.error)) toast('The English voice is unavailable. Read the story together.');
    };
    speaking = true; $('listen').innerHTML = svg('stop'); $('listen').setAttribute('aria-pressed', 'true'); $('listen').setAttribute('aria-label', 'Stop reading');
    try { window.speechSynthesis.speak(utterance); } catch (_) { stopSpeech(); toast('The English voice is unavailable. Read the story together.'); }
  }

  function catPuppet() {
    return markup('<svg viewBox="0 0 1142 1378" role="img" aria-label="White cat with brown eyes and a moving tail"><defs><clipPath id="tail-mask"><path d="M822 575H1142V1280H660L650 1170 782 1105 868 930 792 840Z"/></clipPath></defs><g class="cat-tail"><image href="assets/cat.png" width="1142" height="1378" clip-path="url(#tail-mask)"/></g><image href="assets/cat-body.png" width="1142" height="1378" preserveAspectRatio="none"/></svg>');
  }
  function owlPuppet() {
    return markup('<svg class="owl-flyer" viewBox="0 0 1312 1199" aria-hidden="true"><defs><clipPath id="owl-left-mask"><path d="M0 0H430L630 650 550 840 330 920 0 800Z"/></clipPath><clipPath id="owl-right-mask"><path d="M840 570 1050 0H1312V930L1000 930 830 790Z"/></clipPath><clipPath id="owl-body-mask"><path d="M460 310H920L1030 820 960 1199H380L330 850Z"/></clipPath></defs><g class="owl-left-wing"><image href="assets/owl.png" width="1312" height="1199" clip-path="url(#owl-left-mask)"/></g><g class="owl-right-wing"><image href="assets/owl.png" width="1312" height="1199" clip-path="url(#owl-right-mask)"/></g><image href="assets/owl.png" width="1312" height="1199" clip-path="url(#owl-body-mask)"/></svg>');
  }
  function actor(name) {
    const a = node('div', `actor actor-${name}`); a.dataset.character = name;
    if (name === 'cat') a.append(catPuppet());
    else if (name === 'owl') a.append(picture('owl-perched', 'owl-rest', 'White owl with two legs'), owlPuppet());
    else if (name === 'frog') a.append(picture('frog', 'frog-idle', 'Frog'), picture('frog-jump', 'frog-air', ''));
    else a.append(picture(name === 'ghost' ? 'little-ghost' : name, '', story.speakers[name]?.name || name));
    return a;
  }
  function drawScene() {
    clearTimeout(motionTimer);
    const p = page(), scene = $('scene');
    scene.closest('.illustration').style.setProperty('--scene-bg', `url("assets/${p.background}.png")`);
    scene.closest('.illustration').dataset.scene = p.scene;
    scene.className = `scene scene-${p.scene}`;
    const world = node('div', 'world');
    world.append(picture(p.background, 'environment', p.place));
    if (p.scene === 'homeward') world.append(picture('house', 'home-house', 'The ghost’s house'));
    if (p.scene === 'house') world.append(node('div', 'room-highlight'));
    world.append(node('div', 'ground-shadow ghost-shadow'), actor('ghost'));
    if (p.partner) {
      if (['frog', 'cat', 'mummy'].includes(p.partner)) world.append(node('div', `ground-shadow ${p.partner}-shadow`));
      if (p.partner === 'owl') world.append(markup('<svg class="owl-branch" viewBox="0 0 400 70" aria-hidden="true"><path d="M400 42C280 36 200 37 13 28" stroke="#8e7964" stroke-width="18"/><path d="M400 39C280 32 200 33 13 24" stroke="#b69a78" stroke-width="8"/><path d="m325 36 21-28m-70 27-16-16" stroke="#8e7964" stroke-width="9"/></svg>'));
      world.append(actor(p.partner));
    }
    if (['reunion', 'ending'].includes(p.scene)) for (let i = 0; i < 3; i++) world.append(node('span', 'love-heart', '♥'));
    const replay = node('button', 'replay-motion'); replay.type = 'button'; replay.id = 'replay-motion'; replay.title = 'Replay movement'; replay.setAttribute('aria-label', 'Replay movement'); replay.innerHTML = svg('replay');
    replay.addEventListener('click', () => playMotion(p.partner === 'cat' ? 'cat-tail' : p.enter || (p.partner === 'mummy' ? 'mummy-float' : 'ghost-leave')));
    scene.replaceChildren(world, replay);
    mounted = p.id;
    if (p.scene === 'ending') scene.classList.add('is-reunited');
    if (p.enter) requestAnimationFrame(() => { if (page().id === p.id) playMotion(p.enter); });
  }
  function playMotion(name) {
    const scene = $('scene');
    clearTimeout(motionTimer);
    scene.classList.remove('is-hopping');
    const frog = scene.querySelector('.actor-frog'), owl = scene.querySelector('.actor-owl'), ghost = scene.querySelector('.actor-ghost'), mummy = scene.querySelector('.actor-mummy');
    owl?.classList.remove('is-flying', 'fly-enter', 'fly-circle');
    ghost?.classList.remove('leaving', 'going-home', 'approaching'); mummy?.classList.remove('rising');
    scene.dataset.motion = name || '';
    if (reduced()) {
      if (name === 'reunite') scene.classList.add('is-reunited');
      if (name === 'ghost-home') scene.classList.add('home-arrival', 'house-passed');
      if (name === 'room-glow') scene.classList.add('room-chosen');
      return;
    }
    void scene.offsetWidth;
    let duration = 1600;
    if (name === 'frog-hop' && frog) { scene.classList.add('is-hopping'); duration = 1100; }
    else if (name === 'owl-enter' || name === 'owl-flight') { owl?.classList.add('is-flying', name === 'owl-enter' ? 'fly-enter' : 'fly-circle'); duration = name === 'owl-enter' ? 2150 : 2650; }
    else if (name === 'cat-tail') {
      const tail = scene.querySelector('.cat-tail');
      if (tail) { tail.style.animation = 'none'; void tail.getBoundingClientRect(); tail.style.animation = ''; }
    } else if (name === 'ghost-leave') ghost?.classList.add('leaving');
    else if (name === 'ghost-home') { scene.classList.remove('house-passed'); scene.classList.add('home-arrival'); ghost?.classList.add('going-home'); duration = 2150; }
    else if (name === 'ghost-approach') ghost?.classList.add('approaching');
    else if (name === 'mummy-float') { mummy?.classList.add('rising'); duration = 1850; }
    else if (name === 'room-glow') scene.classList.add('room-chosen');
    else if (name === 'reunite') scene.classList.add('is-reunited');
    motionTimer = setTimeout(() => {
      scene.classList.remove('is-hopping'); owl?.classList.remove('is-flying', 'fly-enter', 'fly-circle'); mummy?.classList.remove('rising');
      if (name === 'ghost-home') scene.classList.add('house-passed');
      scene.dataset.motion = '';
    }, duration);
  }
  function drawDialogue() {
    const lines = currentLines();
    $('dialogue').className = `dialogue${lines.length ? '' : ' is-empty'}`;
    $('dialogue').replaceChildren(...lines.map(line => {
      const speaker = story.speakers[line.who];
      const bubble = node('div', `speech ${speaker.colour} ${line.who}${line.text.length > 90 ? ' long' : ''}`);
      bubble.append(node('span', 'speaker', speaker.name), node('p', '', line.text));
      return bubble;
    }));
  }
  function graphic(name, cls = 'choice-graphic') {
    const box = node('span', cls); box.setAttribute('aria-hidden', 'true');
    if (name === 'fly') box.append(picture('owl'));
    else if (name === 'swim') {
      box.classList.add('swim-graphic'); box.append(picture('frog', 'swimmer'), markup(icon('water'))); box.lastChild.classList.add('waterline');
    } else box.innerHTML = icon(name);
    return box;
  }
  function roomPicture(room) {
    const regions = { bedroom: '110 240 600 285', bathroom: '960 240 485 285', living: '100 545 610 345', kitchen: '970 550 495 345' };
    const box = node('span', 'room-picture'); box.setAttribute('aria-hidden', 'true');
    box.append(markup(`<svg viewBox="${regions[room]}" preserveAspectRatio="xMidYMid slice"><image href="assets/house.png" width="1536" height="1024"/></svg>`));
    return box;
  }
  function selectedIds() { return solved() ? step().correct : draft(); }
  function choiceButton(c, i) {
    const selected = selectedIds().includes(c.id);
    const b = node('button', `choice${selected ? ' selected' : ''}`); b.type = 'button'; b.dataset.choice = c.id; b.setAttribute('aria-label', c.text);
    b.disabled = opening() || solved() || (step().mode === 'order' && selected);
    if (step().mode === 'multi') b.setAttribute('aria-pressed', String(selected));
    if (c.image || c.room) {
      const badge = node('span', 'letter', selected ? '✓' : String.fromCharCode(65 + i)); badge.setAttribute('aria-hidden', 'true');
      b.append(badge, c.room ? roomPicture(c.room) : picture(c.image), node('span', '', c.text));
    } else if (c.icon) b.append(graphic(c.icon), node('span', '', `${selected ? '✓ ' : ''}${c.text}`));
    else {
      const badge = node('span', 'letter', selected ? '✓' : String.fromCharCode(65 + i)); badge.setAttribute('aria-hidden', 'true');
      b.append(badge, node('span', '', c.text));
    }
    b.addEventListener('click', () => choose(c.id, b));
    return b;
  }
  function drawBuilder() {
    const area = node('div', 'answer-area'); area.id = 'answer-area'; area.setAttribute('aria-label', 'Your question');
    const ids = selectedIds();
    ids.forEach(id => {
      const c = step().choices.find(c => c.id === id);
      const token = node('button', 'word-token', c.text); token.type = 'button'; token.dataset.answer = id; token.disabled = solved(); token.setAttribute('aria-label', `Remove ${c.text}`);
      token.addEventListener('click', () => { progress.drafts[key()] = draft().filter(x => x !== id); activityChanged(); }); area.append(token);
    });
    const bank = node('div', 'word-bank');
    step().choices.forEach(c => {
      const token = node('button', 'word-token', c.text); token.type = 'button'; token.dataset.word = c.id; token.disabled = solved() || ids.includes(c.id);
      token.addEventListener('click', () => {
        progress.drafts[key()] = [...draft(), c.id]; activityChanged();
        const target = draft().length === step().choices.length ? $('check-question') : $('choices').querySelector('[data-word]:not(:disabled)'); target?.focus({ preventScroll: true });
      }); bank.append(token);
    });
    const controls = node('div', 'builder-controls');
    const clear = node('button', 'clear-button', 'Clear'); clear.type = 'button'; clear.disabled = solved() || !ids.length;
    clear.addEventListener('click', () => { progress.drafts[key()] = []; activityChanged(); });
    const check = node('button', 'check-button', 'Check'); check.type = 'button'; check.id = 'check-question'; check.disabled = solved() || ids.length !== step().choices.length;
    check.addEventListener('click', () => {
      if (draft().every((id, i) => id === step().correct[i])) complete();
      else { $('answer-area').classList.add('invalid'); showHint(step().hint); }
    });
    controls.append(clear, check); $('choices').replaceChildren(area, bank, controls);
  }
  function drawActivity() {
    const s = step();
    $('choices').className = `choices ${s.mode === 'multi' ? 'clue-pictures' : s.mode === 'order' ? 'pictures order-pictures' : s.mode}${s.choices.length === 4 ? ' four' : ''}`;
    if (s.mode === 'builder') drawBuilder();
    else {
      const buttons = s.choices.map(choiceButton);
      if (s.mode === 'order') {
        const sequence = node('div', 'sequence'); sequence.setAttribute('aria-label', 'The friends in story order');
        selectedIds().concat(Array(s.correct.length - selectedIds().length).fill(null)).forEach((id, i) => {
          const slot = node('div', `sequence-slot${id ? ' filled' : ''}`);
          if (id) { const c = s.choices.find(c => c.id === id); slot.append(picture(c.image, '', c.text), node('span', 'order-number', String(i + 1))); }
          else slot.textContent = String(i + 1);
          sequence.append(slot);
        });
        $('choices').replaceChildren(...buttons); $('choices').before(sequence);
      } else $('choices').replaceChildren(...buttons);
    }
  }
  function activityChanged() {
    document.querySelector('.sequence')?.remove(); drawActivity(); drawClues(); save();
    $('feedback').className = 'feedback'; $('feedback').textContent = '';
  }
  function drawClues() {
    const known = new Set(progress.drafts['spider:0'] || []);
    story.pages.forEach((p, pi) => p.steps.forEach((s, si) => { if (s.unlock && (progress.solved.includes(`${p.id}:${si}`) || pi < progress.page)) s.unlock.forEach(id => known.add(id)); }));
    $('clues').replaceChildren(...story.clues.map(c => {
      const chip = node('div', known.has(c.id) ? 'clue' : 'clue locked');
      if (known.has(c.id)) chip.append(graphic(c.icon, 'mini-icon'), document.createTextNode(c.text));
      else { chip.textContent = '?'; chip.setAttribute('aria-label', 'A clue to discover'); }
      return chip;
    }));
  }
  function updateNav() {
    const moreLines = solved() && frame() < step().after.length - 1;
    const final = progress.page === story.pages.length - 1 && index() === page().steps.length - 1;
    const text = opening() || moreLines ? 'Read on' : !solved() ? 'Choose an answer' : index() < page().steps.length - 1 ? 'Next question' : final ? 'Play again' : 'Next scene';
    $('next').disabled = !opening() && !solved();
    $('next').replaceChildren(document.createTextNode(text), node('span', '', final && solved() ? '↻' : '→')); $('next').lastChild.setAttribute('aria-hidden', 'true');
    $('back').disabled = progress.page === 0 && index() === 0 && !frame();
  }
  function render(options = {}) {
    const p = page(), s = step();
    const sceneChanged = mounted !== p.id;
    if (sceneChanged) drawScene();
    $('scene').dataset.step = String(index()); $('scene').dataset.phase = opening() ? 'opening' : solved() ? 'after' : 'question';
    if (p.scene === 'homeward' && solved()) $('scene').classList.add('home-arrival', 'house-passed');
    if (p.scene === 'house') $('scene').classList.toggle('room-chosen', solved());
    if (p.scene === 'reunion') $('scene').classList.toggle('is-reunited', progress.solved.includes('reunion:4'));
    $('chapter').textContent = `Scene ${progress.page + 1}`; $('place').textContent = p.place;
    $('chapter-label').textContent = `${progress.page + 1} / ${story.pages.length}`; $('page-title').textContent = p.title;
    $('step-dots').replaceChildren(...p.steps.map((_, i) => node('span', i === index() ? 'current' : progress.solved.includes(`${p.id}:${i}`) ? 'done' : '')));
    $('step-dots').setAttribute('aria-label', `Question ${index() + 1} of ${p.steps.length}`);
    $('question').textContent = s.prompt; $('instruction').textContent = s.instruction;
    drawDialogue(); document.querySelector('.sequence')?.remove(); document.querySelector('.opening-note')?.remove(); drawActivity();
    if (opening()) $('choices').before(node('div', 'opening-note', 'Read on to hear the clues.'));
    $('feedback').className = 'feedback'; $('feedback').textContent = solved() ? s.success : '';
    drawClues(); updateNav(); drawMap();
    $('page-number').textContent = `Scene ${progress.page + 1} of ${story.pages.length}`;
    $('progress-bar').style.width = `${((progress.page + (solved() ? 1 : .15)) / story.pages.length) * 100}%`;
    document.title = `${p.title} · Are you my mummy?`;
    if (options.navigate) {
      document.querySelector('.story-panel').scrollTop = 0; $('question').focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 760px)').matches) $('main').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (s.celebrate && solved() && celebrated !== key()) celebrate();
    if (!s.celebrate) $('celebration').replaceChildren();
    save();
  }
  function showHint(text, button) {
    if (button) { button.classList.remove('wrong'); void button.offsetWidth; button.classList.add('wrong'); setTimeout(() => button.classList.remove('wrong'), 1100); }
    $('feedback').className = 'feedback hint'; $('feedback').textContent = text;
  }
  function choose(id, button) {
    if (opening() || solved()) return;
    const s = step();
    if (s.mode === 'order') {
      if (id !== s.correct[draft().length]) { showHint(s.hint, button); return; }
      progress.drafts[key()] = [...draft(), id];
      if (draft().length === s.correct.length) complete();
      else { activityChanged(); $('feedback').textContent = `${draft().length} of ${s.correct.length} friends.`; }
      return;
    }
    if (!s.correct.includes(id)) { showHint(s.hint, button); return; }
    if (s.mode === 'multi') {
      progress.drafts[key()] = draft().includes(id) ? draft().filter(x => x !== id) : [...draft(), id];
      if (draft().length !== s.correct.length) {
        activityChanged(); $('feedback').textContent = `${draft().length} of ${s.correct.length} clues found.`;
        $('choices').querySelector(`[data-choice="${id}"]`)?.focus({ preventScroll: true }); return;
      }
    }
    complete();
  }
  function complete() {
    stopSpeech(); const s = step();
    if (!solved()) progress.solved.push(key());
    progress.frames[key()] = 0;
    render(); $('next').focus({ preventScroll: true });
    if (window.matchMedia('(max-width: 760px)').matches) $('main').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (s.motion || s.motionAt?.[0]) playMotion(s.motion || s.motionAt[0]);
  }
  function next() {
    stopSpeech();
    if (opening()) { progress.read[key()] = (progress.read[key()] || 0) + 1; render(); return; }
    if (!solved()) return;
    if (frame() < step().after.length - 1) {
      progress.frames[key()] = frame() + 1; render();
      if (step().motionAt?.[frame()]) playMotion(step().motionAt[frame()]); return;
    }
    if (index() < page().steps.length - 1) progress.steps[page().id] = index() + 1;
    else if (progress.page < story.pages.length - 1) progress.page++;
    else { $('restart-dialog').showModal(); return; }
    render({ navigate: true });
  }
  function back() {
    stopSpeech();
    if (solved() && frame() > 0) { progress.frames[key()] = frame() - 1; render(); return; }
    if (!solved() && (progress.read[key()] || 0) > 0) { progress.read[key()]--; render(); return; }
    if (index() > 0) progress.steps[page().id] = index() - 1;
    else if (progress.page > 0) { progress.page--; progress.steps[page().id] = page().steps.length - 1; }
    render({ navigate: true });
  }
  function drawMap() {
    $('page-map').replaceChildren(...story.pages.map((p, i) => {
      const b = node('button', i === progress.page ? 'active' : '', `${String(i + 1).padStart(2, '0')}  ${p.title}`); b.type = 'button';
      b.addEventListener('click', () => {
        stopSpeech(); progress.page = i; progress.steps[p.id] = 0;
        progress.solved = progress.solved.filter(k => !k.startsWith(`${p.id}:`));
        for (const field of ['drafts', 'frames', 'read']) Object.keys(progress[field]).filter(k => k.startsWith(`${p.id}:`)).forEach(k => delete progress[field][k]);
        mounted = ''; $('teacher-dialog').close(); render({ navigate: true });
      }); return b;
    }));
  }
  function celebrate() {
    celebrated = key();
    $('celebration').replaceChildren(...Array.from({ length: 22 }, (_, i) => {
      const star = node('span', '', i % 4 ? '✦' : '♥');
      star.style.setProperty('--x', `${(i * 37) % 100}%`); star.style.setProperty('--s', `${16 + i % 4 * 7}px`); star.style.setProperty('--d', `${i % 8 * .13}s`); star.style.setProperty('--c', ['#b99d6c', '#9b85ac', '#ba8f99', '#93a686'][i % 4]); return star;
    }));
  }
  $('listen').innerHTML = svg('listen'); $('fullscreen').innerHTML = svg('fullscreen'); $('teacher').innerHTML = svg('teacher');
  $('listen').addEventListener('click', readPage); $('next').addEventListener('click', next); $('back').addEventListener('click', back);
  $('teacher').addEventListener('click', () => { stopSpeech(); $('teacher-dialog').showModal(); });
  $('restart').addEventListener('click', () => { $('teacher-dialog').close(); $('restart-dialog').showModal(); });
  $('confirm-restart').addEventListener('click', () => { stopSpeech(); progress = fresh(); mounted = ''; celebrated = ''; $('restart-dialog').close(); render({ navigate: true }); });
  document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { if (e.target !== d) return; const r = d.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close(); }));
  $('fullscreen').addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); else toast('Full screen is unavailable in this browser.'); }
    catch (_) { toast('Full screen is unavailable here. You can still play the story.'); }
  });
  document.addEventListener('fullscreenchange', () => $('fullscreen').setAttribute('aria-label', document.fullscreenElement ? 'Exit full screen' : 'Full screen'));
  document.addEventListener('keydown', e => {
    if (document.querySelector('dialog[open]') || e.altKey || e.ctrlKey || e.metaKey || /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(e.target.tagName) || e.target.isContentEditable) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); back(); }
  });
  window.addEventListener('pagehide', stopSpeech);
  render();
  ['cat', 'cat-body', 'frog', 'frog-jump', 'owl', 'owl-perched', 'mummy', 'little-ghost', 'spider', 'forest', 'pond', 'web', 'house', 'living-room'].forEach(name => { const img = new Image(); img.src = `assets/${name}.png`; });
})();
