// Credit and source for each quote, by its permanent number (the order of
// the source note). The quote text itself is read from Lexi's note at seed
// time and is not stored in this repo. `lyric: true` rows are created with
// their credit only; Lexi adds the text in /admin.

type SourceType =
  | 'book' | 'poem' | 'video' | 'song' | 'album' | 'tv' | 'anime' | 'film'
  | 'talk' | 'post' | 'conversation' | 'writing' | 'other'

export type QuoteMeta = {
  author?: string
  sourceTitle?: string
  sourceType?: SourceType
  sourceUrl?: string
  lyric?: boolean
}

export const QUOTES_META: Record<number, QuoteMeta> = {
  1: { author: 'exurb1a', sourceTitle: 'You Will Never Do Anything Remarkable', sourceType: 'video' },
  2: { author: 'peter-mckinnon', sourceType: 'video' },
  3: { author: 'seneca', sourceTitle: 'Letters to Lucilius; also the title of a Thrice album', sourceType: 'book' },
  4: { author: 'heraclitus', sourceTitle: 'The river fragment, as interpreted', sourceType: 'book' },
  5: { author: 'exurb1a', sourceTitle: 'Meaning Is a Jumper You Have to Knit Yourself', sourceType: 'video' },
  6: { sourceTitle: 'Proverb, popularised by the 1956 song', sourceType: 'other' },
  7: { author: '10-years', sourceTitle: 'Blood Red Sky', sourceType: 'song', lyric: true },
  8: { author: 'govind-p', sourceType: 'conversation' },
  9: { author: 'brahmadatha', sourceType: 'conversation' },
  10: { author: 'thenx', sourceType: 'post' },
  11: { author: 'bonjoe-tom', sourceType: 'conversation' },
  12: { author: 'bonjoe-tom', sourceType: 'conversation' },
  13: { author: 'hrithik-roshan' },
  14: { author: 'alma-anvar', sourceType: 'conversation' },
  15: { author: 'jerryrigeverything', sourceTitle: 'YouTube sign-off', sourceType: 'video' },
  16: { author: 'mark-manson', sourceType: 'writing' },
  17: { author: 'stanley-kubrick', sourceTitle: 'Playboy interview, 1968', sourceType: 'talk' },
  18: { author: 'andy-bernard', sourceTitle: 'The Office, series finale', sourceType: 'tv' },
  19: { author: 'alejandro-jodorowsky', sourceType: 'writing' },
  20: { author: 'veritasium', sourceTitle: 'The Illusion Only Some People Can See', sourceType: 'video' },
  21: {},
  22: { author: 'foals', sourceTitle: 'Everything Not Saved Will Be Lost', sourceType: 'album' },
  23: {},
  24: {},
  25: { author: 'henri-cartier-bresson', sourceTitle: 'The Decisive Moment', sourceType: 'book' },
  26: { author: 'carl-jung', sourceTitle: 'Popular paraphrase', sourceType: 'writing' },
  27: { author: 'roo-panes', sourceTitle: 'Little Giant', sourceType: 'song', lyric: true },
  28: { author: 'kurzgesagt', sourceTitle: 'What Dinosaurs ACTUALLY Looked Like?', sourceType: 'video' },
  29: { author: 'gabe-newell', sourceTitle: 'Interview, 2011', sourceType: 'talk' },
  30: { author: 'the-weeknd', sourceTitle: 'Phantom Regret by Jim (spoken by Jim Carrey)', sourceType: 'song', lyric: true },
  31: { author: 'socrates', sourceTitle: 'Via Xenophon, Memorabilia', sourceType: 'book' },
  32: { author: 'charles-bukowski', sourceTitle: 'Commonly attributed', sourceType: 'writing' },
  33: { author: 'shawn-james', sourceTitle: 'Curse of the Fold', sourceType: 'song', lyric: true },
  34: { author: 'phil-lober', sourceTitle: 'Alive', sourceType: 'song', lyric: true },
  35: { author: 'sylvia-plath', sourceTitle: 'The Unabridged Journals', sourceType: 'book' },
  36: { author: 'eren-jaeger', sourceTitle: 'Attack on Titan', sourceType: 'anime' },
  37: { author: 'roo-panes', sourceTitle: 'Land of the Living', sourceType: 'song', lyric: true },
  38: { author: 'endeavor', sourceTitle: 'My Hero Academia', sourceType: 'anime' },
  39: { author: 'kneesovertoesguy', sourceType: 'post' },
  40: { author: 'atmosphere', sourceTitle: 'Virgo', sourceType: 'song', lyric: true },
  41: { author: '070-shake', sourceTitle: 'Flight 319', sourceType: 'song', lyric: true },
  42: { author: 'alex-french-guy-cooking', sourceTitle: 'Gourmet salt video', sourceType: 'video' },
  43: { author: 'marianne-williamson', sourceTitle: 'A Return to Love', sourceType: 'book' },
  44: { author: 'karthik-netha', sourceTitle: 'Life of Ram, from the film 96', sourceType: 'song', lyric: true },
  45: { author: 'salt-and-whistles', sourceType: 'post' },
  46: { author: 'pursuit-of-wonder', sourceTitle: "You'd Be Surprised How Closed-Minded You Are (on Jacques Derrida)", sourceType: 'video' },
  47: { author: 'rafael-rolli', sourceType: 'post' },
  48: { author: 'harry-hudson', sourceTitle: 'Chapter 3 Interlude', sourceType: 'song', lyric: true },
  49: {},
  50: { author: 'c-s-lewis', sourceTitle: 'The Problem of Pain', sourceType: 'book' },
  51: { sourceTitle: 'Overlord, season 2 episode 2', sourceType: 'anime' },
  52: { author: 'american-baron', sourceType: 'post' },
  53: { author: 'mayuri-kurotsuchi', sourceTitle: 'Bleach, by Tite Kubo', sourceType: 'anime' },
  54: { author: 'max-planck', sourceTitle: "Planck's principle, from his Scientific Autobiography (paraphrased)", sourceType: 'book' },
  55: {},
  56: { author: 'richard-siken', sourceTitle: 'Crush', sourceType: 'poem' },
  57: {},
  58: {},
  59: { author: 'friedrich-nietzsche', sourceTitle: 'Untimely Meditations', sourceType: 'book' },
  60: {},
  61: { author: 'ram-dass', sourceType: 'talk' },
  62: { author: 'mike-pridgen', sourceType: 'post' },
  63: { author: 'stephen-fry', sourceType: 'talk' },
  64: {},
  65: { author: 'starpark-designs', sourceType: 'post' },
  66: { author: 'lexi', sourceTitle: 'Mistakes, Like a Mother', sourceType: 'writing' },
  67: {},
  68: {},
  69: { sourceTitle: 'Stranger by the Shore', sourceType: 'anime' },
  70: {},
  71: { author: 'marisa-g-franco', sourceTitle: 'Platonic', sourceType: 'book' },
  72: { author: 'american-baron', sourceType: 'post' },
  73: { author: 'george-bernard-shaw', sourceTitle: 'Man and Superman', sourceType: 'book' },
  74: { sourceType: 'other' },
}

// Spelling fixes agreed in docs/quotes-plan.md, applied to the note's text.
export const TEXT_FIXES: [RegExp, string][] = [
  [/Culltivating/g, 'Cultivating'],
  [/fullfill/g, 'fulfill'],
]
