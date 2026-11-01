# Story logic and the approved checkpoint

## Approved visual version

The user accepted Version 3 as a final checkpoint before requesting this logic pass.

- Repository: shkoala/Ghost_and_mummy
- Preserved branch: final-v3
- Exact commit: a316dd5eebd5755279b45b8328b4f2623203dbcd
- The branch preserves the complete game and artwork. Do not move it when updating main.

## Version 6: one new clue at each meeting

| Meeting | Already known | New information and activity | Ribbon after the choice |
| --- | --- | --- | --- |
| Spider | Nothing | Spider gives only “She has got big brown eyes.” Choose the large brown pair from six eye pictures: blue, green, purple, large brown, small brown and grey. No colour or ability clue is given here. | big brown eyes · ? · ? · ? |
| Frog | big brown eyes | Build “Have you got big brown eyes?” and read Frog’s answer. Ask “Are you my mummy?” Frog says “Your mummy is white. I am green.” Choose white from six colour circles. | big brown eyes · white · ? · ? |
| Cat | big brown eyes · white | Cat greets the child with “Hello, little ghost!”. Choose her answers to the eyes and colour questions. The ghost then asks “Are you my mummy?”. Cat replies “No, I’m not. I am a cat. I can’t fly. And your mummy can fly.” Choose fly from swim / fly / jump, without pictures, then go straight to the farewell. | big brown eyes · white · can fly · ? |
| Owl | big brown eyes · white · can fly | Check the three known features. Owl explains “Your mummy hasn’t got any legs.” Choose no legs. | big brown eyes · white · can fly · no legs |

Each new fact comes from the animal in the current scene. Spider introduces herself in her first reply; Frog, Cat and Owl identify themselves near the end of their exchange. All introduce themselves before the ghost uses their name. Frog starts with only “Hello!” and ends her colour reply with “I am green. I am a frog.” Each clue has exactly one unlock point. Incorrect choices leave the ribbon unchanged. Back navigation hides clues from later points even when their answers were previously completed.

## Narrative continuity and layout

| Moment | Correction |
| --- | --- |
| First meeting | Spider says “No, I’m not. I am a spider. But I know your mummy.”, then gives the eye clue in a separate bubble. Frog identifies herself after the colour contrast; Cat in her reply to “Are you my mummy?”; Owl after the legs contrast. Named thanks and farewells follow these introductions. The early answer prompts do not reveal Cat’s name. |
| Cat’s dialogue | Cat’s first line is only “Hello, little ghost!”. She does not say she knows Mummy at the start. The separate Can you fly? question and repeated Oh, you aren’t my mummy / Ha-ha! I am a cat exchange are removed. Choosing fly leads directly to Goodbye, Cat! |
| Full eye answers | Every existing full answer says “I have got big brown eyes.” Frog’s and Owl’s responses both include big; short grammar answers remain Yes, I have. |
| Frog’s dialogue | The little ghost asks only “Are you my mummy?”, without stating Mummy’s colour. The white/green contrast and new colour clue come from Frog. Frog’s bubble is at the top right, alongside the ghost’s bubble, so both eyes remain visible. |
| Owl’s greeting | Owl’s first line is only “Hello, little ghost!”. The extra “I know your mummy” line is removed. She later answers “Where is she?” with “Your mummy is at home.” |
| Route | The ghost follows the path, looks by the gate, then looks by the tree; he does not name the next animal in advance. |
| Going home | Before the answer, only the forest path and the ghost are visible in the story picture. Choosing The house reveals the house with a short fade as it grows and the ghost approaches. Incorrect choices do not reveal it. He remains outside while asking where Mummy is. |
| Entering | After the living room is chosen, he says “Here I come!”, passes through its wall, then appears in the interior view. He does not point to Mummy before seeing her. There is no key or opening door. |
| First sight of the white ghost | In the living room he says “Look! A white ghost!” before the child answers “Where is she?”. She is called Mummy only after the identity answer is chosen. |
| Recognition | The question panel says “Choose her answer” until the identity is confirmed; it does not identify the white ghost as Mummy in advance. |
| Room depth and reunion | Mummy starts farther back beside the sofa, smaller and higher in the scene. After the identity answer, the child glides sideways while Mummy glides forward and towards him, growing smoothly as she reaches the foreground. Their floor shadows move with them. |
| Stable positions | The child’s reached position and Mummy’s rear position match between the location answer and the first recognition question. Their foreground positions match between the reunion and the final recall page. The recall page does not replay the entrance transition. |
| Knowledge ribbon | Only actually chosen clues are shown, and only after the corresponding point in the story. Moving Back does not reveal later clues. |
| Teacher replay | Restarting a selected scene clears it and all following scenes, retaining earlier answers. Old future answers cannot skip the story. |
| Artwork loading | Scene images are loaded and decoded before a page transition; the next scene is preloaded during the current one. |
| Movement completion | Next waits for a trip, entry, approach, owl flight or reunion to finish. Replays start from the animal’s current location. |

## Verification

### Dialogue audit, 1 November 2026

| Scene | What the dialogue may use at that point |
| --- | --- |
| Forest path | The little ghost identifies himself and asks for help finding Mummy. No clue is known yet. |
| Spider’s web | Spider first says “No, I’m not. I am a spider. But I know your mummy.” The separate clue bubble contains only “She has got big brown eyes.” The ghost then thanks Spider by name. |
| Pond | The ghost asks about the known eyes. Frog gives the new white colour clue, contrasts it with her green colour and says “I am a frog.” “Bye, Frog!” follows. |
| Courtyard | The ghost checks the known eyes and white colour, then asks “Are you my mummy?”. Cat identifies herself, says she cannot fly and gives the new flying clue. The child chooses fly and the ghost says “Goodbye, Cat!”. No flying question or repeated conclusion is inserted. |
| Tree | The ghost checks three known features. Owl gives the new no-legs clue and identifies herself before “Thank you, Owl!”. Her location answer comes before the journey home. |
| Way home | The ghost repeats the location supplied by Owl. The child chooses the house from the three cards; the house appears in the story picture only after the correct choice. |
| House | The ghost asks where Mummy is. Her voice supplies the living room before the room choice and wall entry. |
| Living room | A visible white ghost is introduced as the referent of “she”. The next-to-the-sofa answer follows the picture. |
| Recognition | The four previously learned clues are checked. “Yes, I am!” confirms Mummy before “I love you, Mummy!”. |
| Recall | All four animals have already identified themselves and been met. The child orders Spider → Frog → Cat → Owl; “I found my mummy!” follows the reunion. |

The source audit checks all correct answer IDs, one unlock point per clue, named thanks/farewells after each animal’s own introduction, and every feature or location mentioned by the ghost against information already supplied in the dialogue. V6 has 20 activities: Cat’s redundant flying question is removed, and her fly clue is now cat:2. The saved-progress version is 6 so a completed old cat:2 answer cannot skip the new exchange.

Before the V6 revision, the complete V5 21-activity journey was played from a fresh start at 1280 × 720. It reached “I found my mummy!”, “Well done!” and an enabled Play again button with all four clues. V6’s changed Frog, Cat and Owl exchanges are checked separately for wording, clue order and face clearance. Previous layout and backwards-navigation checks remain listed below.

### V6.2 house reveal check

At 1280 × 720, the house is hidden both visually and from the accessibility tree before the answer. Choosing The pond leaves it hidden and Next disabled. Choosing The house reveals it and starts the existing approach; Next waits until the movement ends. Returning from the room-choice page and reloading a saved correct answer keep the arrived house visible. Restarting the scene from the teacher menu hides it again. This changes only the house visibility and fade; activity IDs and saved-progress version 6 are retained.

### V6.1 staging check

Owl’s revised greeting and Mummy’s rear position were checked in the browser. Room staging was inspected at 1920 × 920, 1280 × 720 and 390 × 844. The reunion was completed on the wide and phone layouts: the child moves sideways, Mummy moves down towards the foreground and increases in size, and Next remains blocked during the movement. Computed positions match exactly across the approach-to-question and reunion-to-recall transitions. Both characters stay inside the phone picture. The reunion uses a 1.8-second transition and a 1.9-second navigation hold; reduced-motion behavior and saved-progress version 6 are retained.

V4’s complete 20-activity journey, replay, backward navigation, travel and wall entry were checked before this change. V5 had 21 activities. Its Spider → Frog → Cat → Owl flow was checked for correct and incorrect choices, automatic answer transitions and the ribbon’s 1 → 2 → 3 → 4 progression. Frog’s question and colour reply were checked at 1920 × 920 and 1280 × 720. Source checks verify answer references, unique unlock points and the absence of later clues in Spider’s dialogue.
