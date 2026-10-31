# Story logic and the approved checkpoint

## Approved visual version

The user accepted Version 3 as a final checkpoint before requesting this logic pass.

- Repository: shkoala/Ghost_and_mummy
- Preserved branch: final-v3
- Exact commit: a316dd5eebd5755279b45b8328b4f2623203dbcd
- The branch preserves the complete game and artwork. Do not move it when updating main.

## Version 4: narrative continuity

| Moment | Correction |
| --- | --- |
| First meeting | Spider, Frog, Cat and Owl introduce themselves before the little ghost addresses them by name. |
| Frog’s knowledge | The little ghost says “My mummy is white” before Frog uses that fact. |
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

The 20 activities were completed in the browser. Back navigation was checked from the ending to the early owl questions (no legs remains hidden), then to the beginning (all four clues hidden). Teacher replay was checked for enabled future tasks. The approach and reunion pages use the same ghost position before and after the transition. The house journey and wall entry finish before the next page. The longer spider introduction fits without a scrollbar at 1280 × 720. Source checks verify introductions before named farewells, shared information and valid answer/background references.
