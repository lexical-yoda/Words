// Colour per writing kind, matching the tone-* classes in styles.css.
export const WRITING_TONE: Record<string, string> = {
  story: 'violet',
  essay: 'blue',
  reflection: 'mint',
  poem: 'rose',
  note: 'peach',
}

// Each author kind has its own colour, used on title bars, chips and dots.
export const KIND_TONE: Record<string, string> = {
  public: 'blue',
  creator: 'violet',
  character: 'rose',
  friend: 'peach',
  self: 'mint',
  unknown: 'sand',
}
export const KIND_LABEL: Record<string, string> = {
  public: 'public figure',
  creator: 'creator',
  character: 'character',
  friend: 'friend',
  self: 'me',
  unknown: 'uncredited',
}
