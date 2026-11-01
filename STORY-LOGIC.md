# Story logic and the approved checkpoint

## Approved visual version

The user accepted Version 3 as a final checkpoint before requesting this logic pass.

- Repository: shkoala/Ghost_and_mummy
- Preserved branch: final-v3
- Exact commit: a316dd5eebd5755279b45b8328b4f2623203dbcd
- The branch preserves the complete game and artwork. Do not move it when updating main.

## Version 5: one new clue at each meeting

| Meeting | Already known | New information and activity | Ribbon after the choice |
| --- | --- | --- | --- |
| Spider | Nothing | Spider gives only “She has got big brown eyes.” Choose the large brown pair from six eye pictures: blue, green, purple, large brown, small brown and grey. No colour or ability clue is given here. | big brown eyes · ? · ? · ? |
| Frog | big brown eyes | Build “Have you got big brown eyes?” and read Frog’s answer. Ask “Are you my mummy?” Frog says “Your mummy is white. I am green.” Choose white from six colour circles. | big brown eyes · white · ? · ? |
| Cat | big brown eyes · white | Choose Cat’s answers to the eyes, colour and flying questions. Cat gives “Your mummy can fly. I can’t fly.” Choose the word fly from swim / fly / jump, without pictures. Only then does the ghost say “My mummy can fly.” | big brown eyes · white · can fly · ? |
| Owl | big brown eyes · white · can fly | Check the three known features. Owl explains “Your mummy hasn’t got any legs.” Choose no legs. | big brown eyes · white · can fly · no legs |

Each new fact comes from the animal in the current scene. Animals state who they are near the end of their exchange, before the ghost uses their name. Frog starts with only “Hello!” and ends her colour reply with “I am green. I am a frog.” Each clue has exactly one unlock point. Incorrect choices leave the ribbon unchanged. Back navigation hides clues from later points even when their answers were previously completed.

## Narrative continuity and layout

| Moment | Correction |
| --- | --- |
| First meeting | Spider identifies herself after the eye clue; Frog after the colour contrast; Cat after the flying clue; Owl after the legs contrast. Named thanks and farewells follow these introductions. The early answer prompts do not reveal Cat’s name. |
| Frog’s dialogue | The little ghost asks only “Are you my mummy?”, without stating Mummy’s colour. The white/green contrast and new colour clue come from Frog. Frog’s bubble is at the top right, alongside the ghost’s bubble, so both eyes remain visible. |
| Owl’s knowledge | Owl says she knows Mummy, then answers “Where is she?” with “I can see her! She is at home.” The orchard background contains a distant house. |
| Route | The ghost follows the path, looks by the gate, then looks by the tree; he does not name the next animal in advance. |
| Going home | The house is visible as a distant landmark before the answer, then grows as the ghost approaches. He remains outside while asking where Mummy is. |
| Entering | After the living room is chosen, he passes through its wall, then appears in the interior view. There is no key or opening door. |
| Recognition | The question panel says “Choose her answer” until the identity is confirmed; it does not identify the white ghost as Mummy in advance. |
| Stable positions | The little ghost keeps his reached position when a movement is replayed, the next question appears or the page is restored. |
| Knowledge ribbon | Only actually chosen clues are shown, and only after the corresponding point in the story. Moving Back does not reveal later clues. |
| Teacher replay | Restarting a selected scene clears it and all following scenes, retaining earlier answers. Old future answers cannot skip the story. |
| Artwork loading | Scene images are loaded and decoded before a page transition; the next scene is preloaded during the current one. |
| Movement completion | Next waits for a trip, entry, approach, owl flight or reunion to finish. Replays start from the animal’s current location. |

## Verification

V4’s complete 20-activity journey, replay, backward navigation, travel and wall entry were checked before this change. V5 has 21 activities: Cat’s new word choice adds the third clue. The changed Spider → Frog → Cat → Owl flow is checked in the browser for correct and incorrect choices, automatic answer transitions and the ribbon’s 1 → 2 → 3 → 4 progression. Frog’s question and colour reply are checked at 1920 × 920 and 1280 × 720; both eyes remain clear, and the question panel fits without scrolling. Source checks verify answer references, unique unlock points and the absence of later clues in Spider’s dialogue.
