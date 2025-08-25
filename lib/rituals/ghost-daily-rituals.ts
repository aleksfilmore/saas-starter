/**
 * Ghost (free tier) Daily Rituals - 90 lightweight single-prompt rituals.
 * Deterministic selection: hash(userId + localDate) % 90 => stable per day without DB writes.
 */

export interface GhostRitual {
  id: string;
  title: string;
  prompt: string;
  byteReward: number;
  estMinutes: number;
  tags: string[];
}

function r(i: number, title: string, prompt: string, bytes = 10, est = 5, tags: string[] = []): GhostRitual {
  return { id: `ghost-${i.toString().padStart(3,'0')}`, title, prompt, byteReward: bytes, estMinutes: est, tags };
}

export const GHOST_DAILY_RITUALS: GhostRitual[] = [
  r(1,'System Check-In','Name one feeling, one body sensation, and one need right now.'),
  r(2,'Micro Win Log','Write down the smallest win you had in the last 24h.'),
  r(3,'Trigger Trace','What sparked discomfort today? Label it without judgment.'),
  r(4,'One Kind Thing','Plan (or record) one kind thing you did for yourself.'),
  r(5,'Thought Defrag','Identify a looping thought. Rewrite it in neutral language.'),
  r(6,'Energy Ping','Describe your current energy level 1–10 and why.'),
  r(7,'Boundary Byte','Name one boundary you reinforced or need to reinforce.'),
  r(8,'Release Line','Write one sentence you are ready to release today.'),
  r(9,'Future Snapshot','Describe a tiny detail from a future day where you feel lighter.'),
  r(10,'Grief Pixel','Name a small thing you miss – and what it represented.'),
  r(11,'Breath Log','After 3 slow breaths, note what shifted (if anything).'),
  r(12,'Redirect Plan','What will you do the next time an intrusive memory surfaces?'),
  r(13,'Self-Talk Audit','Last harsh self-message → rewrite compassionately.'),
  r(14,'Somatic Scan','Where is tension in your body? Describe texture / temp.'),
  r(15,'Need Acknowledged','Complete: “Right now I need more ___ and less ___.”'),
  r(16,'Pattern Spot','Name a reaction that felt old or patterned today.'),
  r(17,'Micro Gratitude','List one neutral or comforting object nearby and why.'),
  r(18,'Emotional Alias','Give your current mood a codename; explain it.'),
  r(19,'One Degree Shift','What 1% adjustment could make tomorrow easier?'),
  r(20,'Digital Detox Ping','Note one account/feed you muted or could mute.'),
  r(21,'Sleep Prep','Remove one friction before sleep tonight.'),
  r(22,'Morning Anchor','Pick a 30‑second morning anchor for tomorrow.'),
  r(23,'Hydration Check','How has hydration (or lack) affected you today?'),
  r(24,'Compassion Patch','Write a 10‑word supportive note to earlier-you.'),
  r(25,'Edge Detector','Where did you almost spiral? What buffered you?'),
  r(26,'Body Neutrality','List one function your body performed today.'),
  r(27,'Value Recall','Name a value you upheld (even subtly).'),
  r(28,'Delay Tactic','Phrase you’ll use to delay an urge 5 minutes.'),
  r(29,'Social Battery','One interaction: drain or charge? Why?'),
  r(30,'Comparison Interrupt','Who did you compare to? Reframe one assumption.'),
  r(31,'System Restore','A moment that felt 2% stable—describe it.'),
  r(32,'Emotion Label Upgrade','Replace “bad” with a precise emotion word.'),
  r(33,'Narrative Flip','Catastrophic thought → grounded observation.'),
  r(34,'Craving Map','Log a craving & the need beneath it.'),
  r(35,'Kind Distraction','Name a constructive distraction for tonight.'),
  r(36,'Sensation Anchor','Identify one neutral physical sensation now.'),
  r(37,'Hope Byte','Write one sentence of cautious hope.'),
  r(38,'Regulation Tool','Tool that helped or could have today.'),
  r(39,'Decision Debrief','One decision: what informed it?'),
  r(40,'Exit Script','Draft: “I need to step away for a moment.”'),
  r(41,'Overload Indicator','First signs you were overloaded today.'),
  r(42,'Sleep Debrief','How did sleep quality shape regulation?'),
  r(43,'Movement Micro','Describe any movement (even minimal).'),
  r(44,'Breaking Point','Wall you hit & preceding 15 minutes.'),
  r(45,'Self-Reassurance','Write what you wanted someone to say.'),
  r(46,'Boundary Script','Draft: “I’m not available for ___ right now.”'),
  r(47,'Stimulus Swap','Replace one scroll with a neutral action.'),
  r(48,'Phone Distance','Where can your phone sleep (out of reach)?'),
  r(49,'Nutrition Nudge','Plan a stabilizing snack/meal.'),
  r(50,'No-Contact Anchor','Reason you’re maintaining distance (if applicable).'),
  r(51,'Resentment Leak','Small resentment & boundary that prevents it.'),
  r(52,'Inner Critic Handle','Personify critic; acknowledge then dismiss.'),
  r(53,'Soothe Stack','Stack 3 comforts (sound/texture/scent).'),
  r(54,'Memory Distortion','Idealized memory → add one grounded detail.'),
  r(55,'Catastrophe Cooldown','Worst → likely → one coping step.'),
  r(56,'Alone vs Lonely','Were you alone, lonely, or both?'),
  r(57,'Reclaimed Minute','One minute reclaimed for you.'),
  r(58,'Affirmation Refactor','Rewrite a cheesy affirmation authentically.'),
  r(59,'Doomscroll Pattern','When did doomscrolling start & trigger?'),
  r(60,'Identity Thread','Trait not defined by them / event.'),
  r(61,'Environmental Tweak','Micro change to space for calm.'),
  r(62,'Overfunction Flag','Where did you over-deliver? Why?'),
  r(63,'Permission Grant','Give explicit permission (rest / say no).'),
  r(64,'Grief Permission','Finish: “It’s valid that I feel ___ because ___.”'),
  r(65,'Somatic Exit','How did you know an emotion passed?'),
  r(66,'Sleep Protector','One pre-sleep behavior to drop.'),
  r(67,'Tiny Curiosity','Something you’re mildly curious about.'),
  r(68,'Social Needle','Social input: too much, too little, ok?'),
  r(69,'Trigger Forecast','Predict one trigger + 10s response.'),
  r(70,'Value Micro-Act','Tiny act aligned with a core value.'),
  r(71,'Emotional Lag','Did emotions lag logic? Describe.'),
  r(72,'Name the Absence','Which absence felt loud today?'),
  r(73,'Rumination Interrupt','List 3 grounding objects in sight.'),
  r(74,'Anxiety Scale','Rate anxiety & one lowering factor.'),
  r(75,'Support Gap','Support you wanted but didn’t request.'),
  r(76,'Internal vs External','Distress source more internal/external?'),
  r(77,'Micro Celebration','Behavior you prevented or delayed.'),
  r(78,'Body Request','What is your body requesting now?'),
  r(79,'Emotion Word Stretch','Use an uncommon emotion word.'),
  r(80,'Tomorrow Buffer','Add one 3‑min buffer tomorrow.'),
  r(81,'Kindness Memory','Recent kindness (given/received).'),
  r(82,'System Latency','Task harder than its complexity – why?'),
  r(83,'Self-Neglect Ping','Basic need ignored today.'),
  r(84,'Emotion Gradient','Chart intensity start vs now.'),
  r(85,'Grounding Phrase','Draft phrase for future spike.'),
  r(86,'Internal Weather','One word internal weather.'),
  r(87,'Safety Cue','Cue that signals safety to you.'),
  r(88,'Narrative Lag','Is your story current or outdated?'),
  r(89,'Attention Leak','Where idle attention drained.'),
  r(90,'Gentle Closer','Write a neutral closing line to today.')
];

import { createHash } from 'crypto';

export function selectGhostDailyRitual(userId: string, localDateISO: string): GhostRitual {
  const h = createHash('sha256').update(userId + '::' + localDateISO).digest();
  const idx = (h[0] << 8 | h[1]) % GHOST_DAILY_RITUALS.length;
  return GHOST_DAILY_RITUALS[idx];
}

export function computeLocalDateISO(date: Date, tzOffsetMinutes: number): string {
  const localMs = date.getTime() + tzOffsetMinutes * 60 * 1000;
  const d = new Date(localMs);
  return d.toISOString().split('T')[0];
}
