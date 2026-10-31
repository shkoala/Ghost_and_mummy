/* Approved story: dialogue stays in the picture; activities stay on the right. */
window.MUMMY_STORY = (() => {
  const say = (who, text) => ({ who, text });
  const choice = (id, text, extra = {}) => ({ id, text, ...extra });
  const yes = () => [choice('have', 'Yes, I have.'), choice('am', 'Yes, I am.'), choice('can', 'Yes, I can.')];
  const no = () => [choice('have', 'No, I haven’t.'), choice('can', 'No, I can’t.'), choice('am', 'No, I’m not.')];
  const eyes = () => [choice('brown', 'Have you got big brown eyes?'), choice('green', 'Have you got big green eyes?'), choice('blue', 'Have you got big blue eyes?')];
  const colours = () => [choice('green', 'Are you green?'), choice('white', 'Are you white?'), choice('black', 'Are you black?')];
  const abilities = () => [choice('jump', 'Can you jump?'), choice('fly', 'Can you fly?'), choice('swim', 'Can you swim?')];
  return {
    version: 2,
    speakers: {
      ghost: { name: 'Little Ghost', colour: 'lilac' }, spider: { name: 'Spider', colour: 'sage' },
      frog: { name: 'Frog', colour: 'sage' }, cat: { name: 'Cat', colour: 'sage' }, owl: { name: 'Owl', colour: 'sage' },
      mummy: { name: 'Mummy', colour: 'lilac' }, voice: { name: 'Mummy’s voice', colour: 'lilac' }
    },
    clues: [
      { id: 'eyes', icon: 'eyes', text: 'big brown eyes' }, { id: 'white', icon: 'white', text: 'white' },
      { id: 'fly', icon: 'fly', text: 'can fly' }, { id: 'legs', icon: 'no-legs', text: 'no legs' }
    ],
    pages: [
      {
        id: 'beginning', title: 'Little Ghost', place: 'The forest path', scene: 'intro', background: 'forest',
        steps: [{
          before: [say('ghost', 'Hello! I’m a little ghost.\nWhere is my mummy?')],
          prompt: 'Who needs help?', instruction: 'Choose a picture.', mode: 'pictures', correct: ['ghost'],
          choices: [choice('frog', 'The frog', { image: 'frog' }), choice('ghost', 'Little Ghost', { image: 'little-ghost' }), choice('cat', 'The cat', { image: 'cat' })],
          hint: 'Look for the little ghost.', success: 'Let’s help Little Ghost!',
          after: [[say('ghost', 'Let’s find my mummy!')]], motion: 'ghost-leave'
        }]
      },
      {
        id: 'spider', title: 'Meet Spider', place: 'The spider’s web', scene: 'spider', background: 'web', partner: 'spider',
        steps: [{
          opening: [[say('ghost', 'Are you my mummy?'), say('spider', 'No, I’m not.\nBut I know your mummy.')]],
          before: [say('spider', 'She has got big brown eyes.\nShe is white.\nShe can fly.')],
          prompt: 'Choose 3 clues.', instruction: 'Choose three matching pictures.', mode: 'multi', correct: ['eyes', 'white', 'fly'],
          choices: [choice('blue', 'big blue eyes', { icon: 'blue-eyes' }), choice('white', 'white', { icon: 'white' }), choice('swim', 'can swim', { icon: 'swim' }), choice('eyes', 'big brown eyes', { icon: 'eyes' }), choice('fly', 'can fly', { icon: 'fly' }), choice('green', 'green', { icon: 'green' })],
          hint: 'Look at Spider’s clues again.', success: 'Three clues found!', unlock: ['eyes', 'white', 'fly'],
          after: [[say('ghost', 'Thank you, little Spider!')]]
        }]
      },
      {
        id: 'frog', title: 'Meet Frog', place: 'The little pond', scene: 'frog', background: 'pond', partner: 'frog', enter: 'frog-hop',
        steps: [
          {
            before: [say('frog', 'Hello, little ghost!'), say('ghost', 'Hello!')],
            prompt: 'Make the question.', instruction: 'Click the words in order.', mode: 'builder', correct: ['have', 'you', 'got', 'big', 'brown', 'eyes'],
            choices: [choice('brown', 'brown'), choice('got', 'got'), choice('eyes', 'eyes?'), choice('have', 'Have'), choice('big', 'big'), choice('you', 'you')],
            hint: 'Try again. Start with “Have you got…”', success: 'A perfect question!',
            after: [[say('ghost', 'Have you got big brown eyes?'), say('frog', 'Yes, I have.\nI have got brown eyes.')]]
          },
          {
            before: [say('ghost', 'Are you my mummy?')],
            prompt: 'Choose Frog’s answer.', instruction: 'Look at her colour.', mode: 'single', correct: ['no'],
            choices: [choice('yes', 'Yes, I am.'), choice('no', 'No, I’m not.')],
            hint: 'Mummy is white. The frog is green.', success: 'She is a frog!',
            after: [[say('frog', 'No, I’m not. Your mummy is white.\nI am not white. I am green.\nI am a frog.')], [say('ghost', 'Goodbye, Frog!')]], motionAt: { 1: 'frog-hop' }
          }
        ]
      },
      {
        id: 'cat', title: 'Meet Cat', place: 'The forest path', scene: 'cat', background: 'forest', partner: 'cat',
        steps: [
          {
            before: [say('cat', 'Hello, little ghost!'), say('ghost', 'Hello!\nHave you got big brown eyes?')],
            prompt: 'Answer for Cat.', instruction: 'Choose her answer.', mode: 'single', correct: ['have'], choices: yes(),
            hint: 'Have you got…? — Yes, I have.', success: 'Big brown eyes — yes!',
            after: [[say('ghost', 'Have you got big brown eyes?'), say('cat', 'Yes, I have.\nI have got brown eyes.')]]
          },
          {
            before: [say('ghost', 'Are you white?')], prompt: 'Answer for Cat.', instruction: 'Choose her answer.', mode: 'single', correct: ['am'], choices: yes(),
            hint: 'Are you…? — Yes, I am.', success: 'White — yes!',
            after: [[say('ghost', 'Are you white?'), say('cat', 'Yes, I am. I am white.')]]
          },
          {
            before: [say('ghost', 'Can you fly?')], prompt: 'Answer for Cat.', instruction: 'Choose her answer.', mode: 'single', correct: ['can'], choices: no(),
            hint: 'The cat can’t fly. Choose “No, I can’t.”', success: 'Mummy can fly. Cat can’t.',
            after: [[say('ghost', 'Can you fly?'), say('cat', 'No, I can’t.\nI can’t fly.')], [say('ghost', 'Oh, you aren’t my mummy.\nMy mummy can fly.'), say('cat', 'Ha-ha! I am a cat.')], [say('ghost', 'Goodbye, Cat!')]]
          }
        ]
      },
      {
        id: 'owl', title: 'Meet Owl', place: 'The old oak tree', scene: 'owl', background: 'forest', partner: 'owl', enter: 'owl-enter',
        steps: [
          {
            before: [say('owl', 'Hello, little ghost!'), say('ghost', 'Hello!')],
            prompt: 'Ask about her eyes.', instruction: 'Choose the question.', mode: 'single', correct: ['brown'], choices: eyes(),
            hint: 'Mummy has got big brown eyes.', success: 'Big brown eyes — yes!',
            after: [[say('ghost', 'Have you got big brown eyes?'), say('owl', 'Yes, I have.\nI have got brown eyes.')]]
          },
          {
            before: [say('owl', 'I have got brown eyes.')], prompt: 'Ask about her colour.', instruction: 'Choose the question.', mode: 'single', correct: ['white'], choices: colours(),
            hint: 'Mummy is white.', success: 'White — yes!',
            after: [[say('ghost', 'Are you white?'), say('owl', 'Yes, I am. I am white.')]]
          },
          {
            before: [say('owl', 'I am white.')], prompt: 'Ask if she can fly.', instruction: 'Choose the question.', mode: 'single', correct: ['fly'], choices: abilities(),
            hint: 'Mummy can fly.', success: 'Look! She can fly!', motion: 'owl-flight',
            after: [[say('ghost', 'Can you fly?'), say('owl', 'Yes, I can. I can fly.')]]
          },
          {
            before: [say('ghost', 'Are you my mummy?'), say('owl', 'No, I’m not. I have got two legs.\nYour mummy hasn’t got any legs.')],
            prompt: 'Choose the new clue.', instruction: 'My mummy has got…', mode: 'single', correct: ['none'],
            choices: [choice('two', 'two legs', { icon: 'two-legs' }), choice('four', 'four legs', { icon: 'four-legs' }), choice('none', 'no legs', { icon: 'no-legs' })],
            hint: 'Mummy hasn’t got any legs.', success: 'The fourth clue!', unlock: ['legs'],
            after: [[say('ghost', 'My mummy has got no legs!')], [say('owl', 'Your mummy is at home.\nGo home, little ghost!'), say('ghost', 'Thank you, Owl!')]]
          }
        ]
      },
      {
        id: 'homeward', title: 'Let’s go home!', place: 'The way home', scene: 'homeward', background: 'forest',
        steps: [{
          before: [say('ghost', 'Mummy is at home!\nLet’s go home!')], prompt: 'Where is Mummy?', instruction: 'Choose a picture.', mode: 'pictures', correct: ['house'],
          choices: [choice('pond', 'The pond', { image: 'pond' }), choice('house', 'The house', { image: 'house' }), choice('web', 'The web', { image: 'web' })],
          hint: 'Mummy is at home. Look for the house.', success: 'Home, sweet home!', motion: 'ghost-home',
          after: [[say('ghost', 'I’m coming, Mummy!')]]
        }]
      },
      {
        id: 'house', title: 'Choose a room', place: 'The ghost’s house', scene: 'house', background: 'house',
        steps: [{
          before: [say('ghost', 'Mummy! Where are you?'), say('voice', 'I’m in the living room!')], prompt: 'Choose the room.', instruction: 'Where is Mummy?', mode: 'pictures', correct: ['living'],
          choices: [choice('bedroom', 'bedroom', { room: 'bedroom' }), choice('bathroom', 'bathroom', { room: 'bathroom' }), choice('living', 'living room', { room: 'living' }), choice('kitchen', 'kitchen', { room: 'kitchen' })],
          hint: 'The living room has got a sofa.', success: 'The living room!', motion: 'room-glow',
          after: [[say('ghost', 'Here I come!')]]
        }]
      },
      {
        id: 'find-mummy', title: 'In the living room', place: 'The cosy living room', scene: 'find-mummy', background: 'living-room', partner: 'mummy',
        steps: [{
          before: [], prompt: 'Where is she?', instruction: 'Look at the picture.', mode: 'single', correct: ['next'],
          choices: [choice('on', 'On the sofa.'), choice('next', 'Next to the sofa.'), choice('under', 'Under the table.')],
          hint: 'She is next to the sofa.', success: 'Next to the sofa!',
          after: [[say('ghost', 'Let’s ask her!')]], motion: 'ghost-approach'
        }]
      },
      {
        id: 'reunion', title: 'My mummy!', place: 'Home, sweet home', scene: 'reunion', background: 'living-room', partner: 'mummy',
        steps: [
          {
            before: [say('ghost', 'Have you got big brown eyes?')], prompt: 'Answer for Mummy.', instruction: 'Choose her answer.', mode: 'single', correct: ['have'], choices: yes(),
            hint: 'Have you got…? — Yes, I have.', success: 'Big brown eyes — yes!',
            after: [[say('ghost', 'Have you got big brown eyes?'), say('mummy', 'Yes, I have.')]]
          },
          {
            before: [say('ghost', 'Are you white?')], prompt: 'Answer for Mummy.', instruction: 'Choose her answer.', mode: 'single', correct: ['am'], choices: yes(),
            hint: 'Are you…? — Yes, I am.', success: 'White — yes!',
            after: [[say('ghost', 'Are you white?'), say('mummy', 'Yes, I am.')]]
          },
          {
            before: [say('ghost', 'Can you fly?')], prompt: 'Answer for Mummy.', instruction: 'Choose her answer.', mode: 'single', correct: ['can'], choices: yes(),
            hint: 'Can you…? — Yes, I can.', success: 'She can fly!', motion: 'mummy-float',
            after: [[say('ghost', 'Can you fly?'), say('mummy', 'Yes, I can.')]]
          },
          {
            before: [say('ghost', 'Have you got any legs?')], prompt: 'Answer for Mummy.', instruction: 'Choose her answer.', mode: 'single', correct: ['have'], choices: no(),
            hint: 'Have you got…? — No, I haven’t.', success: 'No legs!',
            after: [[say('ghost', 'Have you got any legs?'), say('mummy', 'No, I haven’t.')]]
          },
          {
            before: [say('ghost', 'Are you my mummy?')], prompt: 'Answer for Mummy.', instruction: 'Choose her answer.', mode: 'single', correct: ['yes'],
            choices: [choice('no', 'No, I’m not.'), choice('yes', 'Yes, I am!')],
            hint: 'All four clues match. This is Mummy!', success: 'Together at last!', motion: 'reunite',
            after: [[say('ghost', 'Are you my mummy?'), say('mummy', 'Yes, I am!')], [say('ghost', 'I love you, Mummy!'), say('mummy', 'I love you, too!')]]
          }
        ]
      },
      {
        id: 'ending', title: 'Our adventure', place: 'A happy ending', scene: 'ending', background: 'living-room', partner: 'mummy',
        steps: [{
          before: [say('ghost', 'Thank you for helping me!')], prompt: 'Choose the friends in order.', instruction: 'Who did Little Ghost meet first?', mode: 'order', correct: ['spider', 'frog', 'cat', 'owl'],
          choices: [choice('owl', 'Owl', { image: 'owl-perched' }), choice('cat', 'Cat', { image: 'cat' }), choice('spider', 'Spider', { image: 'spider' }), choice('frog', 'Frog', { image: 'frog' })],
          hint: 'Think about the story. Who came next?', success: 'Well done!', celebrate: true,
          after: [[say('ghost', 'I found my mummy!')]]
        }]
      }
    ]
  };
})();
