/* Story content is kept separate so a teacher can easily edit the language. */
window.MUMMY_STORY = (() => {
  const say = (who, text) => ({ who, text });
  const option = (id, text, extra = {}) => ({ id, text, ...extra });
  const eyesQuestion = () => [
    option('eyes', 'Have you got big brown eyes?'),
    option('colour', 'Are you white?'),
    option('fly', 'Can you fly?')
  ];
  return {
    version: 1,
    speakers: {
      ghost: { name: 'Little Ghost', image: 'little-ghost', colour: 'purple' },
      spider: { name: 'Spider', image: 'spider', colour: 'sage' },
      frog: { name: 'Frog', image: 'frog', colour: 'sage' },
      cat: { name: 'Cat', image: 'cat', colour: 'sage' },
      owl: { name: 'Owl', image: 'owl', colour: 'sage' },
      mummy: { name: 'Mummy', image: 'mummy', colour: 'purple' }
    },
    clues: [
      { id: 'eyes', icon: 'eyes', text: 'big brown eyes' },
      { id: 'white', icon: 'white', text: 'white' },
      { id: 'fly', icon: 'wing', text: 'can fly' },
      { id: 'legs', icon: 'ghost', text: 'no legs' }
    ],
    pages: [
      {
        id: 'beginning', title: 'Are you my mummy?', short: 'A little ghost', place: 'The autumn forest', chapter: 'A little adventure', scene: 'intro', background: 'forest', partner: null,
        caption: 'A little ghost. A big adventure.',
        steps: [{
          lines: [say('ghost', 'Hello! I’m a little ghost.\nWhere is my mummy?')],
          prompt: 'Who needs help?', instruction: 'Choose a picture.', mode: 'pictures', correct: ['ghost'],
          choices: [option('frog', 'The frog', { image: 'frog' }), option('ghost', 'The little ghost', { image: 'little-ghost' }), option('cat', 'The cat', { image: 'cat' })],
          wrong: 'Who is looking for Mummy? Look for the little ghost.', success: 'Let’s help the little ghost!',
          after: [say('ghost', 'Look! A spider!')]
        }]
      },
      {
        id: 'spider', title: 'A helpful spider', short: 'Meet Spider', place: 'The spider’s web', chapter: 'The first clues', scene: 'spider', background: 'web', partner: 'spider', caption: '“Are you my mummy?”',
        steps: [{
          lines: [say('ghost', 'Are you my mummy?'), say('spider', 'No, but I know your mummy.\nShe has got big brown eyes.\nShe is white. She can fly.')],
          prompt: 'Choose 3 clues about Mummy.', instruction: 'Click three matching cards.', mode: 'multi', correct: ['eyes', 'white', 'fly'],
          choices: [option('green', 'She is green.', { icon: 'green' }), option('eyes', 'Big brown eyes.', { icon: 'eyes' }), option('swim', 'She can swim.', { icon: 'water' }), option('white', 'She is white.', { icon: 'white' }), option('fly', 'She can fly.', { icon: 'wing' }), option('blue', 'Small blue eyes.', { icon: 'blue-eyes' })],
          wrong: 'Listen to Spider again. Big brown eyes. White. Can fly.', success: 'Three clues! Let’s find Mummy.', unlock: ['eyes', 'white', 'fly'], after: [say('ghost', 'Thank you, Spider!')]
        }]
      },
      {
        id: 'frog', title: 'Is the frog Mummy?', short: 'Meet Frog', place: 'The little pond', chapter: 'A pair of brown eyes', scene: 'frog', background: 'pond', partner: 'frog', caption: 'The little ghost flies to the pond.',
        steps: [
          {
            lines: [say('ghost', 'Hello, Frog!')], prompt: 'Ask about her eyes.', instruction: 'Choose the question.', mode: 'single', correct: ['eyes'], choices: eyesQuestion(),
            wrong: 'Choose the question with “eyes”.', success: 'Yes! Ask about her eyes.', after: [say('ghost', 'Have you got big brown eyes?'), say('frog', 'Yes, I have.')]
          },
          {
            lines: [say('ghost', 'Are you my mummy?')], prompt: 'Choose the frog’s answer.', instruction: 'Look at her colour.', mode: 'single', correct: ['no'],
            choices: [option('yes', 'Yes, I am. I am white.'), option('no', 'No. I am not white. I am green.')], wrong: 'Mummy is white. What colour is the frog?',
            success: 'The frog is green. Keep looking!', after: [say('frog', 'No. Your mummy is white.\nI am not white. I am green.')]
          }
        ]
      },
      {
        id: 'cat', title: 'Is the cat Mummy?', short: 'Meet Cat', place: 'The forest path', chapter: 'White and fluffy', scene: 'cat', background: 'forest', partner: 'cat', caption: 'Look! A white cat!',
        steps: [
          {
            lines: [say('ghost', 'Hello, Cat!')], prompt: 'Ask about her eyes.', instruction: 'Choose the question.', mode: 'single', correct: ['eyes'], choices: eyesQuestion(),
            wrong: 'We need big brown eyes. Which question asks about eyes?', success: 'Big brown eyes — yes!', after: [say('ghost', 'Have you got big brown eyes?'), say('cat', 'Yes, I have.')]
          },
          {
            lines: [say('cat', 'I have got big brown eyes.')], prompt: 'Ask about her colour.', instruction: 'Mummy is white.', mode: 'single', correct: ['white'],
            choices: [option('fly', 'Can you fly?'), option('white', 'Are you white?'), option('eyes', 'Have you got big brown eyes?')], wrong: 'Choose the question about being white.', success: 'White — yes!',
            after: [say('ghost', 'Are you white?'), say('cat', 'Yes, I am.')]
          },
          {
            lines: [say('cat', 'I am white. I have got big brown eyes.')], prompt: 'Ask if she can fly.', instruction: 'Choose the question.', mode: 'single', correct: ['fly'],
            choices: [option('swim', 'Can you swim?'), option('jump', 'Can you jump?'), option('fly', 'Can you fly?')], wrong: 'Mummy can fly. Ask about flying.', success: 'Oh! The cat can’t fly.', after: [say('ghost', 'Can you fly?'), say('cat', 'No, I can’t.')]
          },
          {
            lines: [say('ghost', 'Are you my mummy?')], prompt: 'Is the cat Mummy?', instruction: 'Think about the last answer.', mode: 'single', correct: ['no'],
            choices: [option('no', 'No, she isn’t.'), option('yes', 'Yes, she is.')], wrong: 'The cat can’t fly. Mummy can fly.', success: 'Keep looking, little ghost!',
            after: [say('cat', 'No. Your mummy can fly.\nI can’t fly.')]
          }
        ]
      },
      {
        id: 'owl', title: 'Is the owl Mummy?', short: 'Meet Owl', place: 'The old oak tree', chapter: 'One more clue', scene: 'owl', background: 'forest', partner: 'owl', caption: 'A white owl flies down from a tree.',
        steps: [
          {
            lines: [say('ghost', 'Hello, Owl!')], prompt: 'Ask about her eyes.', instruction: 'Choose the question.', mode: 'single', correct: ['eyes'], choices: eyesQuestion(),
            wrong: 'Choose the question about big brown eyes.', success: 'Big brown eyes — yes!', after: [say('ghost', 'Have you got big brown eyes?'), say('owl', 'Yes, I have.')]
          },
          {
            lines: [say('owl', 'I have got big brown eyes.')], prompt: 'Ask about her colour.', instruction: 'Choose the question.', mode: 'single', correct: ['white'],
            choices: [option('white', 'Are you white?'), option('green', 'Are you green?'), option('blue', 'Are you blue?')], wrong: 'Mummy is white. Ask if the owl is white.', success: 'White — yes!', after: [say('ghost', 'Are you white?'), say('owl', 'Yes, I am.')]
          },
          {
            lines: [say('owl', 'I am white. I have got big brown eyes.')], prompt: 'Ask if she can fly.', instruction: 'Choose the question.', mode: 'single', correct: ['fly'],
            choices: [option('fly', 'Can you fly?'), option('swim', 'Can you swim?'), option('run', 'Can you run?')], wrong: 'Mummy can fly. Choose the flying question.', success: 'She can fly, too!', after: [say('ghost', 'Can you fly?'), say('owl', 'Yes, I can.')]
          },
          {
            lines: [say('ghost', 'Are you my mummy?'), say('owl', 'No. I have got two legs.\nYour mummy hasn’t got any legs.')], prompt: 'Choose the new clue.', instruction: 'How many legs has Mummy got?', mode: 'single', correct: ['none'],
            choices: [option('two', 'Two legs.', { icon: 'two' }), option('none', 'No legs.', { icon: 'ghost' }), option('four', 'Four legs.', { icon: 'four' })], wrong: 'The owl has got two legs. Mummy hasn’t got any legs.', success: 'No legs! Now we know.', unlock: ['legs'], after: [say('owl', 'Your mummy is at home.\nGo home, little ghost!')]
          }
        ]
      },
      {
        id: 'homeward', title: 'Let’s go home!', short: 'The way home', place: 'The way home', chapter: 'Follow the last clue', scene: 'homeward', background: 'forest', partner: null, caption: '“Your mummy is at home.”',
        steps: [{
          lines: [say('ghost', 'Mummy is at home!')], prompt: 'Where is Mummy?', instruction: 'Choose the house.', mode: 'pictures', correct: ['house'],
          choices: [option('web', 'The web', { image: 'web' }), option('house', 'The house', { image: 'house' }), option('pond', 'The pond', { image: 'pond' })], wrong: 'Mummy is at home. Look for a house.', success: 'Yes! Let’s go to the house.', after: [say('ghost', 'I’m coming, Mummy!')]
        }]
      },
      {
        id: 'gate', title: 'A key to home', short: 'Open the gate', place: 'The garden gate', chapter: 'Nearly home', scene: 'gate', background: 'gate', partner: null, caption: 'The key is in the blue box.',
        steps: [{
          lines: [say('ghost', 'Oh! A gate!\nThe key is in the blue box.')], prompt: 'Find the key.', instruction: 'Choose a box in the picture.', mode: 'hotspots', correct: ['blue'],
          choices: [option('red', 'The red box', { x: 72, y: 63, width: 16, height: 20 }), option('blue', 'The blue box', { x: 86, y: 65, width: 20, height: 32 })],
          wrong: 'Look in the blue box, next to the red box.', success: 'You found the key! The gate is open.', after: [say('ghost', 'Let’s go in!')]
        }]
      },
      {
        id: 'house', title: 'Where is Mummy?', short: 'Choose a room', place: 'The ghost’s house', chapter: 'A room for Mummy', scene: 'house', background: 'house', partner: null, caption: 'Mummy is in the living room.',
        steps: [{
          lines: [say('ghost', 'Mummy? Where are you?'), say('mummy', 'I’m in the living room!')], prompt: 'Find the living room.', instruction: 'Choose a room in the house.', mode: 'hotspots', correct: ['living'],
          choices: [option('bedroom', 'Bedroom', { x: 28, y: 38, width: 34, height: 28 }), option('bathroom', 'Bathroom', { x: 76, y: 38, width: 28, height: 28 }), option('living', 'Living room', { x: 28, y: 72, width: 34, height: 30 }), option('kitchen', 'Kitchen', { x: 76, y: 72, width: 28, height: 30 })],
          wrong: 'A living room has got a sofa. Look downstairs.', success: 'The living room! Mummy is here.', after: [say('ghost', 'Mummy, I’m here!')]
        }]
      },
      {
        id: 'find-mummy', title: 'There she is!', short: 'Find Mummy', place: 'The cosy living room', chapter: 'Someone is waiting', scene: 'find-mummy', background: 'room', partner: 'mummy', caption: 'Mummy is next to the sofa.',
        steps: [{
          lines: [say('ghost', 'Mummy is next to the sofa.')], prompt: 'Can you see Mummy?', instruction: 'Choose her in the picture.', mode: 'hotspots', correct: ['mummy'],
          choices: [option('chair', 'The armchair', { x: 87, y: 55, width: 19, height: 45 }), option('bookcase', 'The bookcase', { x: 17, y: 44, width: 20, height: 70 }), option('mummy', 'Mummy', { x: 76, y: 68, width: 26, height: 58 })],
          wrong: 'Look for a white ghost with a purple scarf, next to the sofa.', success: 'There she is! You found her!', after: [say('ghost', 'Mummy!')]
        }]
      },
      {
        id: 'reunion', title: 'My mummy!', short: 'Together at last', place: 'Home, sweet home', chapter: 'Together at last', scene: 'reunion', background: 'room', partner: 'mummy', caption: 'Big brown eyes. White. Can fly. No legs.',
        steps: [{
          lines: [say('ghost', 'You have got big brown eyes.\nYou are white. You can fly.\nYou haven’t got any legs!')], prompt: 'What does Little Ghost ask?', instruction: 'Choose his question.', mode: 'single', correct: ['mummy'],
          choices: [option('cat', 'Are you my cat?'), option('mummy', 'Are you my mummy?'), option('frog', 'Are you my frog?')], wrong: 'He is looking for his mummy. Choose the mummy question.', success: 'Yes! Together at last.',
          after: [say('ghost', 'Are you my mummy?'), say('mummy', 'Yes, I am!'), say('ghost', 'I love you, Mummy!'), say('mummy', 'I love you, too!')]
        }]
      },
      {
        id: 'ending', title: 'You found Mummy!', short: 'A happy ending', place: 'A happy ending', chapter: 'One last choice', scene: 'ending', background: 'forest', partner: 'mummy', caption: 'Everyone helped. And now they are home.',
        steps: [{
          lines: [say('ghost', 'Thank you for helping me!')], prompt: 'Who is my mummy?', instruction: 'Use all four clues. Choose a picture.', mode: 'pictures', correct: ['mummy'],
          choices: [option('owl', 'The owl', { image: 'owl' }), option('cat', 'The cat', { image: 'cat' }), option('mummy', 'The ghost', { image: 'mummy' }), option('frog', 'The frog', { image: 'frog' })],
          wrong: 'Mummy has got big brown eyes. She is white. She can fly. She hasn’t got any legs.', success: 'Well done! You found Mummy!', after: [say('mummy', 'A big thank you from both of us!')], celebrate: true
        }]
      }
    ]
  };
})();
