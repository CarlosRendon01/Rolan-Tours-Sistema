// Keep calendar dates literal: converting ISO midnight to local time can change the day.
export function dateForInput(value) {
  if (!value) return '';
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return '';
    return `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`;
  }
  return String(value).match(/^(\d{4}-\d{2}-\d{2})(?:$|[T ])/u)?.[1] || '';
}

export function displayCalendarDate(value) {
  const date = dateForInput(value);
  return date ? date.split('-').reverse().join('/') : '';
}

export function singleLinePdfText(value) {
  return Array.from(String(value ?? ''), (character) => character.codePointAt(0) < 32 || character.codePointAt(0) === 127 ? ' ' : character).join('');
}

export function wrapPdfText(value, font, size, width) {
  const lines = [];
  for (const paragraph of String(value ?? '').replace(/\r\n?/gu,'\n').split('\n')) {
    let line = '';
    for (const word of singleLinePdfText(paragraph).trim().split(/\s+/u).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate,size) <= width) { line = candidate; continue; }
      if (line) { lines.push(line); line = ''; }
      // Split long tokens as well as wrapping words.
      for (const character of word) {
        if (line && font.widthOfTextAtSize(line+character,size)>width) { lines.push(line); line = ''; }
        line += character;
      }
    }
    lines.push(line);
  }
  return lines;
}
