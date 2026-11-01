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
    version: 5,
    speakers: {
      ghost: { name: 'Little Ghost', colour: 'lilac' }, spider: { name: 'Spider', colour: 'sage' },
      frog: { name: 'Frog', colour: 'sage' }, cat: { name: 'Cat', colour: 'sage' }, owl: { name: 'Owl', colour: 'sage' },
      mummy: { name: 'Mummy', colour: 'lilac' }, voice: { name: 'Mummy’s voice', colour: 'lilac' }
    },
    clues: [
      { id: 'eyes', icon: 'eyes', text: 'big brown eyes' }, { id: 'white', icon: 'white', text: 'white' },
      { id: 'fly', text: 'can fly' }, { id: 'legs', icon: 'no-legs', text: 'no legs' }
    ],
    pages: [
      {
        id: 'beginning', title: 'Little Ghost', place: 'On the forest path', scene: 'intro', background: 'forest-wide.webp',
        steps: [{
          before: [say('ghost', 'Hello! I’m a little ghost.\nWhere is my mummy?')],
          prompt: 'Who needs help?', instruction: 'Choose a picture.', mode: 'pictures', correct: ['ghost'],
          choices: [choice('frog', 'The frog', { image: 'frog' }), choice('ghost', 'Little Ghost', { image: 'little-ghost' }), choice('cat', 'The cat', { image: 'cat' })],
          hint: 'Look for the little ghost.', success: 'Let’s help Little Ghost!',
          after: [[say('ghost', 'Let’s find my mummy!')]], motion: 'ghost-leave'
        }]
      },
      {
        id: 'spider', title: 'Meet Spider', place: 'Next to the spider’s web', scene: 'spider', background: 'spider-forest.webp', partner: 'spider',
        steps: [{
          before: [say('ghost', 'Are you my mummy?'), say('spider', 'No. I’m a spider. I know your mummy.'), say('spider', 'She has got big brown eyes.')],
          prompt: 'Choose her 👀.', instruction: '', mode: 'single', pictureGrid: true, correct: ['eyes'],
          choices: [choice('blue', 'big blue eyes', { icon: 'blue-eyes', pictureOnly: true }), choice('green', 'big green eyes', { icon: 'green-eyes', pictureOnly: true }), choice('purple', 'big purple eyes', { icon: 'purple-eyes', pictureOnly: true }), choice('eyes', 'big brown eyes', { icon: 'eyes', pictureOnly: true }), choice('small', 'small brown eyes', { icon: 'small-eyes', pictureOnly: true }), choice('grey', 'big grey eyes', { icon: 'grey-eyes', pictureOnly: true })],
          hint: 'She has got big brown eyes.', success: 'The first clue!', unlock: ['eyes'],
          after: [[say('ghost', 'Thank you, little Spider!\nLet’s follow the path.')]]
        }]
      },
      {
        id: 'frog', title: 'Meet Frog', place: 'By the pond', scene: 'frog', background: 'pond-wide.webp', partner: 'frog', enter: 'frog-enter',
        steps: [
          {
            before: [say('frog', 'Hello! I’m a frog.'), say('ghost', 'Hello!')],
            prompt: 'Make the question.', instruction: 'Click the words in order.', mode: 'builder', correct: ['have', 'you', 'got', 'big', 'brown', 'eyes'],
            choices: [choice('brown', 'brown'), choice('got', 'got'), choice('eyes', 'eyes?'), choice('have', 'Have'), choice('big', 'big'), choice('you', 'you')],
            hint: 'Try again. Start with “Have you got…”', success: 'A perfect question!',
            after: [[say('ghost', 'Have you got big brown eyes?'), say('frog', 'Yes, I have.\nI have got brown eyes.')]]
          },
          {
            before: [say('ghost', 'Are you my mummy?'), say('frog', 'No, I’m not.\nYour mummy is white.\nI am green.')],
            prompt: 'Choose Mummy’s colour.', instruction: '', mode: 'single', pictureGrid: true, correct: ['white'],
            choices: [choice('green', 'green', { icon: 'green', pictureOnly: true }), choice('blue', 'blue', { icon: 'blue', pictureOnly: true }), choice('black', 'black', { icon: 'black', pictureOnly: true }), choice('white', 'white', { icon: 'white', pictureOnly: true }), choice('orange', 'orange', { icon: 'orange', pictureOnly: true }), choice('purple', 'purple', { icon: 'purple', pictureOnly: true })],
            hint: 'Your mummy is white. Frog is green.', success: 'The second clue!', unlock: ['white'],
            after: [[say('ghost', 'Thank you, Frog!\nLet’s look by the gate.')]], motion: 'frog-hop'
          }
        ]
      },
      {
        id: 'cat', title: 'Meet Cat', place: 'In the courtyard', scene: 'cat', background: 'courtyard-wide.webp', partner: 'cat',
        steps: [
          {
            before: [say('cat', 'Hello! I’m a cat.\nI know your mummy.'), say('ghost', 'Hello!\nHave you got big brown eyes?')],
            prompt: 'Answer for Cat.', instruction: 'Choose her answer.', mode: 'single', correct: ['have'], choices: yes(),
            hint: 'Have you got…? — Yes, I have.', success: 'Big brown eyes — yes!',
            autoAdvance: true, after: []
          },
          {
            before: [say('ghost', 'Are you white?')], prompt: 'Answer for Cat.', instruction: 'Choose her answer.', mode: 'single', correct: ['am'], choices: yes(),
            hint: 'Are you…? — Yes, I am.', success: 'White — yes!',
            autoAdvance: true, after: []
          },
          {
            before: [say('ghost', 'Can you fly?')], prompt: 'Answer for Cat.', instruction: 'Choose her answer.', mode: 'single', correct: ['can'], choices: no(),
            hint: 'The cat can’t fly. Choose “No, I can’t.”', success: 'Cat can’t fly.',
            autoAdvance: true, after: []
          },
          {
            before: [say('cat', 'Your mummy can fly.\nI can’t fly.')], prompt: 'What can Mummy do?', instruction: '', mode: 'single', correct: ['fly'],
            choices: [choice('swim', 'swim', { wordOnly: true }), choice('fly', 'fly', { wordOnly: true }), choice('jump', 'jump', { wordOnly: true })],
            hint: 'Your mummy can fly.', success: 'The third clue!', unlock: ['fly'],
            after: [[say('ghost', 'Oh, you aren’t my mummy.\nMy mummy can fly.'), say('cat', 'Ha-ha! I am a cat.')], [say('ghost', 'Goodbye, Cat!\nLet’s look by the tree.')]]
          }
        ]
      },
      {
        id: 'owl', title: 'Meet Owl', place: 'Next to the tree', scene: 'owl', background: 'owl-garden.webp', partner: 'owl', enter: 'owl-enter',
        steps: [
          {
            before: [say('owl', 'Hello! I’m an owl.\nI know your mummy.'), say('ghost', 'Hello!')],
            prompt: 'Ask about her 👀.', instruction: 'Choose the question.', mode: 'single', correct: ['brown'], choices: eyes(),
            hint: 'Mummy has got big brown eyes.', success: 'Big brown eyes — yes!',
            after: [[say('ghost', 'Have you got big brown eyes?'), say('owl', 'Yes, I have.\nI have got brown eyes.')]]
          },
          {
            before: [], prompt: 'Ask about her 🎨.', instruction: 'Choose the question.', mode: 'single', correct: ['white'], choices: colours(),
            hint: 'Mummy is white.', success: 'White — yes!',
            after: [[say('ghost', 'Are you white?'), say('owl', 'Yes, I am. I am white.')]]
          },
          {
            before: [], prompt: 'Can she fly?', instruction: 'Choose the question.', mode: 'single', correct: ['fly'], choices: abilities(),
            hint: 'Mummy can fly.', success: 'Look! She can fly!', motion: 'owl-flight',
            after: [[say('ghost', 'Can you fly?'), say('owl', 'Yes, I can. I can fly.')]]
          },
          {
            before: [say('ghost', 'Are you my mummy?'), say('owl', 'No, I’m not. I have got two legs.\nYour mummy hasn’t got any legs.')],
            prompt: 'Choose the new clue.', instruction: 'My mummy has got…', mode: 'single', correct: ['none'],
            choices: [choice('two', 'two legs', { icon: 'two-legs' }), choice('four', 'four legs', { icon: 'four-legs' }), choice('none', 'no legs', { icon: 'no-legs' })],
            hint: 'Mummy hasn’t got any legs.', success: 'The fourth clue!', unlock: ['legs'],
            after: [[say('ghost', 'My mummy has got no legs!\nWhere is she?')], [say('owl', 'I can see her! She is at home.\nGo home, little ghost!'), say('ghost', 'Thank you, Owl!')]]
          }
        ]
      },
      {
        id: 'homeward', title: 'Let’s go home!', place: 'On the way home', scene: 'homeward', background: 'forest-wide.webp',
        steps: [{
          before: [say('ghost', 'Mummy is at home!\nLet’s go home!')], prompt: 'Where is Mummy?', instruction: 'Choose a picture.', mode: 'pictures', correct: ['house'],
          choices: [choice('pond', 'The pond', { image: 'pond-wide.webp' }), choice('house', 'The house', { image: 'house' }), choice('web', 'The web', { image: 'spider-forest.webp' })],
          hint: 'Mummy is at home. Look for the house.', success: 'Home, sweet home!', motion: 'ghost-home',
          after: [[say('ghost', 'I’m coming, Mummy!')]]
        }]
      },
      {
        id: 'house', title: 'Choose a room', place: 'At home', scene: 'house', background: 'house',
        steps: [{
          before: [say('ghost', 'Mummy! Where are you?'), say('voice', 'I’m in the living room!')], prompt: 'Choose the room.', instruction: 'Where is Mummy?', mode: 'pictures', correct: ['living'],
          choices: [choice('bedroom', 'bedroom', { room: 'bedroom' }), choice('bathroom', 'bathroom', { room: 'bathroom' }), choice('living', 'living room', { room: 'living' }), choice('kitchen', 'kitchen', { room: 'kitchen' })],
          hint: 'The living room has got a sofa.', success: 'The living room!', motion: 'room-glow',
          after: [[say('ghost', 'Is that my mummy?\nHere I come!')]]
        }]
      },
      {
        id: 'find-mummy', title: 'In the living room', place: 'In the living room', scene: 'find-mummy', background: 'living-room', partner: 'mummy',
        steps: [{
          before: [], prompt: 'Where is she?', instruction: 'Look at the picture.', mode: 'single', correct: ['next'],
          choices: [choice('on', 'On the sofa.'), choice('next', 'Next to the sofa.'), choice('under', 'Under the table.')],
          hint: 'She is next to the sofa.', success: 'Next to the sofa!',
          after: [[say('ghost', 'Let’s ask her!')]], motion: 'ghost-approach'
        }]
      },
      {
        id: 'reunion', title: 'A white ghost', place: 'In the living room', scene: 'reunion', background: 'living-room', partner: 'mummy',
        steps: [
          {
            before: [say('ghost', 'Have you got big brown eyes?')], prompt: 'Choose her answer.', instruction: '', mode: 'single', correct: ['have'], choices: yes(),
            hint: 'Have you got…? — Yes, I have.', success: 'Big brown eyes — yes!',
            autoAdvance: true, after: []
          },
          {
            before: [say('ghost', 'Are you white?')], prompt: 'Choose her answer.', instruction: '', mode: 'single', correct: ['am'], choices: yes(),
            hint: 'Are you…? — Yes, I am.', success: 'White — yes!',
            autoAdvance: true, after: []
          },
          {
            before: [say('ghost', 'Can you fly?')], prompt: 'Choose her answer.', instruction: '', mode: 'single', correct: ['can'], choices: yes(),
            hint: 'Can you…? — Yes, I can.', success: 'She can fly!', motion: 'mummy-float',
            autoAdvance: true, after: []
          },
          {
            before: [say('ghost', 'Have you got any legs?')], prompt: 'Choose her answer.', instruction: '', mode: 'single', correct: ['have'], choices: no(),
            hint: 'Have you got…? — No, I haven’t.', success: 'No legs!',
            autoAdvance: true, after: []
          },
          {
            before: [say('ghost', 'Are you my mummy?')], prompt: 'Choose her answer.', instruction: '', mode: 'single', correct: ['yes'],
            choices: [choice('no', 'No, I’m not.'), choice('yes', 'Yes, I am!')],
            hint: 'All four clues match. This is Mummy!', success: 'Together at last!', motion: 'reunite',
            after: [[say('ghost', 'I love you, Mummy!'), say('mummy', 'I love you, too!')]]
          }
        ]
      },
      {
        id: 'ending', title: 'Our adventure', place: 'In the living room', scene: 'ending', background: 'living-room', partner: 'mummy',
        steps: [{
          before: [say('ghost', 'Thank you for helping me!')], prompt: 'Choose the friends in order.', instruction: 'Who did Little Ghost meet first?', mode: 'order', correct: ['spider', 'frog', 'cat', 'owl'],
          choices: [choice('owl', 'Owl', { image: 'owl-perched' }), choice('cat', 'Cat', { image: 'cat' }), choice('spider', 'Spider', { image: 'spider-eight.webp' }), choice('frog', 'Frog', { image: 'frog' })],
          hint: 'Think about the story. Who came next?', success: 'Well done!', celebrate: true,
          after: [[say('ghost', 'I found my mummy!')]]
        }]
      }
    ]
  };
})();
