export interface BibleBookInfo {
  name: string;
  cebName: string;
  testament: 'Old' | 'New';
  chapters: number;
  category: string;
}

export const BIBLE_BOOKS: BibleBookInfo[] = [
  // Old Testament - Law / Pentateuch
  { name: "Genesis", cebName: "Genesis", testament: "Old", chapters: 50, category: "Pentateuch" },
  { name: "Exodus", cebName: "Exodo", testament: "Old", chapters: 40, category: "Pentateuch" },
  { name: "Leviticus", cebName: "Levitico", testament: "Old", chapters: 27, category: "Pentateuch" },
  { name: "Numbers", cebName: "Numeros", testament: "Old", chapters: 36, category: "Pentateuch" },
  { name: "Deuteronomy", cebName: "Deuteronomio", testament: "Old", chapters: 34, category: "Pentateuch" },

  // Historical Books
  { name: "Joshua", cebName: "Josue", testament: "Old", chapters: 24, category: "Historical" },
  { name: "Judges", cebName: "Maghuhukom", testament: "Old", chapters: 21, category: "Historical" },
  { name: "Ruth", cebName: "Rut", testament: "Old", chapters: 4, category: "Historical" },
  { name: "1 Samuel", cebName: "1 Samuel", testament: "Old", chapters: 31, category: "Historical" },
  { name: "2 Samuel", cebName: "2 Samuel", testament: "Old", chapters: 24, category: "Historical" },
  { name: "1 Kings", cebName: "1 Mga Hari", testament: "Old", chapters: 22, category: "Historical" },
  { name: "2 Kings", cebName: "2 Mga Hari", testament: "Old", chapters: 25, category: "Historical" },
  { name: "1 Chronicles", cebName: "1 Mga Cronicas", testament: "Old", chapters: 29, category: "Historical" },
  { name: "2 Chronicles", cebName: "2 Mga Cronicas", testament: "Old", chapters: 36, category: "Historical" },
  { name: "Ezra", cebName: "Esdras", testament: "Old", chapters: 10, category: "Historical" },
  { name: "Nehemiah", cebName: "Nehemias", testament: "Old", chapters: 13, category: "Historical" },
  { name: "Esther", cebName: "Ester", testament: "Old", chapters: 10, category: "Historical" },

  // Poetic / Wisdom
  { name: "Job", cebName: "Job", testament: "Old", chapters: 42, category: "Poetry" },
  { name: "Psalms", cebName: "Mga Salmo", testament: "Old", chapters: 150, category: "Poetry" },
  { name: "Proverbs", cebName: "Mga Panultihon", testament: "Old", chapters: 31, category: "Poetry" },
  { name: "Ecclesiastes", cebName: "Manugwali", testament: "Old", chapters: 12, category: "Poetry" },
  { name: "Song of Solomon", cebName: "Awit sa mga Awit", testament: "Old", chapters: 8, category: "Poetry" },

  // Major Prophets
  { name: "Isaiah", cebName: "Isaias", testament: "Old", chapters: 66, category: "Major Prophets" },
  { name: "Jeremiah", cebName: "Jeremias", testament: "Old", chapters: 52, category: "Major Prophets" },
  { name: "Lamentations", cebName: "Mga Bakho", testament: "Old", chapters: 5, category: "Major Prophets" },
  { name: "Ezekiel", cebName: "Ezequiel", testament: "Old", chapters: 48, category: "Major Prophets" },
  { name: "Daniel", cebName: "Daniel", testament: "Old", chapters: 12, category: "Major Prophets" },

  // Minor Prophets
  { name: "Hosea", cebName: "Oseas", testament: "Old", chapters: 14, category: "Minor Prophets" },
  { name: "Joel", cebName: "Joel", testament: "Old", chapters: 3, category: "Minor Prophets" },
  { name: "Amos", cebName: "Amos", testament: "Old", chapters: 9, category: "Minor Prophets" },
  { name: "Obadiah", cebName: "Abdias", testament: "Old", chapters: 1, category: "Minor Prophets" },
  { name: "Jonah", cebName: "Jonas", testament: "Old", chapters: 4, category: "Minor Prophets" },
  { name: "Micah", cebName: "Miqueas", testament: "Old", chapters: 7, category: "Minor Prophets" },
  { name: "Nahum", cebName: "Nahum", testament: "Old", chapters: 3, category: "Minor Prophets" },
  { name: "Habakkuk", cebName: "Habacuc", testament: "Old", chapters: 3, category: "Minor Prophets" },
  { name: "Zephaniah", cebName: "Sofonias", testament: "Old", chapters: 3, category: "Minor Prophets" },
  { name: "Haggai", cebName: "Hageo", testament: "Old", chapters: 2, category: "Minor Prophets" },
  { name: "Zechariah", cebName: "Zacarias", testament: "Old", chapters: 14, category: "Minor Prophets" },
  { name: "Malachi", cebName: "Malaquias", testament: "Old", chapters: 4, category: "Minor Prophets" },

  // New Testament - Gospels & Acts
  { name: "Matthew", cebName: "Mateo", testament: "New", chapters: 28, category: "Gospels" },
  { name: "Mark", cebName: "Marcos", testament: "New", chapters: 16, category: "Gospels" },
  { name: "Luke", cebName: "Lucas", testament: "New", chapters: 24, category: "Gospels" },
  { name: "John", cebName: "Juan", testament: "New", chapters: 21, category: "Gospels" },
  { name: "Acts", cebName: "Mga Buhat", testament: "New", chapters: 28, category: "Acts" },

  // Epistles of Paul
  { name: "Romans", cebName: "Roma", testament: "New", chapters: 16, category: "Pauline Epistles" },
  { name: "1 Corinthians", cebName: "1 Corinto", testament: "New", chapters: 16, category: "Pauline Epistles" },
  { name: "2 Corinthians", cebName: "2 Corinto", testament: "New", chapters: 13, category: "Pauline Epistles" },
  { name: "Galatians", cebName: "Galacia", testament: "New", chapters: 6, category: "Pauline Epistles" },
  { name: "Ephesians", cebName: "Efeso", testament: "New", chapters: 6, category: "Pauline Epistles" },
  { name: "Philippians", cebName: "Filipos", testament: "New", chapters: 4, category: "Pauline Epistles" },
  { name: "Colossians", cebName: "Colosas", testament: "New", chapters: 4, category: "Pauline Epistles" },
  { name: "1 Thessalonians", cebName: "1 Tesalonica", testament: "New", chapters: 5, category: "Pauline Epistles" },
  { name: "2 Thessalonians", cebName: "2 Tesalonica", testament: "New", chapters: 3, category: "Pauline Epistles" },
  { name: "1 Timothy", cebName: "1 Timoteo", testament: "New", chapters: 6, category: "Pauline Epistles" },
  { name: "2 Timothy", cebName: "2 Timoteo", testament: "New", chapters: 4, category: "Pauline Epistles" },
  { name: "Titus", cebName: "Tito", testament: "New", chapters: 3, category: "Pauline Epistles" },
  { name: "Philemon", cebName: "Filemon", testament: "New", chapters: 1, category: "Pauline Epistles" },

  // General Epistles
  { name: "Hebrews", cebName: "Hebreohanon", testament: "New", chapters: 13, category: "General Epistles" },
  { name: "James", cebName: "Santiago", testament: "New", chapters: 5, category: "General Epistles" },
  { name: "1 Peter", cebName: "1 Pedro", testament: "New", chapters: 5, category: "General Epistles" },
  { name: "2 Peter", cebName: "2 Pedro", testament: "New", chapters: 3, category: "General Epistles" },
  { name: "1 John", cebName: "1 Juan", testament: "New", chapters: 5, category: "General Epistles" },
  { name: "2 John", cebName: "2 Juan", testament: "New", chapters: 1, category: "General Epistles" },
  { name: "3 John", cebName: "3 Juan", testament: "New", chapters: 1, category: "General Epistles" },
  { name: "Jude", cebName: "Judas", testament: "New", chapters: 1, category: "General Epistles" },

  // Prophecy
  { name: "Revelation", cebName: "Bugna", testament: "New", chapters: 22, category: "Prophecy" }
];

export const OLD_TESTAMENT_BOOKS = BIBLE_BOOKS.filter(b => b.testament === 'Old').map(b => b.name);
export const NEW_TESTAMENT_BOOKS = BIBLE_BOOKS.filter(b => b.testament === 'New').map(b => b.name);
export const ALL_BOOK_NAMES = BIBLE_BOOKS.map(b => b.name);

export function getBookInfo(bookName: string): BibleBookInfo | undefined {
  const clean = bookName.trim().toLowerCase();
  return BIBLE_BOOKS.find(b =>
    b.name.toLowerCase() === clean ||
    b.cebName.toLowerCase() === clean
  );
}

// Comprehensive aliases mapping for Cebuano and English search inputs
const BOOK_ALIASES: Record<string, string> = {
  // Revelation / Bugna
  'bugna': 'Revelation',
  'ang bugna': 'Revelation',
  'revelation': 'Revelation',
  'revelations': 'Revelation',
  'rev': 'Revelation',
  'apocalipsis': 'Revelation',
  'apoc': 'Revelation',

  // Gospels & Acts
  'mateo': 'Matthew',
  'matthew': 'Matthew',
  'matt': 'Matthew',
  'mat': 'Matthew',
  'mt': 'Matthew',
  'marcos': 'Mark',
  'mark': 'Mark',
  'mrk': 'Mark',
  'mk': 'Mark',
  'lucas': 'Luke',
  'luke': 'Luke',
  'luk': 'Luke',
  'lk': 'Luke',
  'juan': 'John',
  'san juan': 'John',
  'john': 'John',
  'jhn': 'John',
  'jn': 'John',
  'mga buhat': 'Acts',
  'buhat': 'Acts',
  'acts': 'Acts',
  'act': 'Acts',

  // Paul's Epistles
  'mga taga-roma': 'Romans',
  'taga-roma': 'Romans',
  'taga roma': 'Romans',
  'roma': 'Romans',
  'romans': 'Romans',
  'rom': 'Romans',
  'rm': 'Romans',
  '1 mga taga-corinto': '1 Corinthians',
  '1 taga-corinto': '1 Corinthians',
  '1 corinto': '1 Corinthians',
  '1 corinthians': '1 Corinthians',
  '1 cor': '1 Corinthians',
  '1cor': '1 Corinthians',
  '2 mga taga-corinto': '2 Corinthians',
  '2 taga-corinto': '2 Corinthians',
  '2 corinto': '2 Corinthians',
  '2 corinthians': '2 Corinthians',
  '2 cor': '2 Corinthians',
  '2cor': '2 Corinthians',
  'mga taga-galacia': 'Galatians',
  'taga-galacia': 'Galatians',
  'galacia': 'Galatians',
  'galatians': 'Galatians',
  'gal': 'Galatians',
  'mga taga-efeso': 'Ephesians',
  'taga-efeso': 'Ephesians',
  'efeso': 'Ephesians',
  'ephesians': 'Ephesians',
  'eph': 'Ephesians',
  'mga taga-filipos': 'Philippians',
  'taga-filipos': 'Philippians',
  'filipos': 'Philippians',
  'philippians': 'Philippians',
  'phil': 'Philippians',
  'php': 'Philippians',
  'mga taga-colosas': 'Colossians',
  'taga-colosas': 'Colossians',
  'colosas': 'Colossians',
  'colossians': 'Colossians',
  'col': 'Colossians',
  '1 mga taga-tesalonica': '1 Thessalonians',
  '1 taga-tesalonica': '1 Thessalonians',
  '1 tesalonica': '1 Thessalonians',
  '1 thessalonians': '1 Thessalonians',
  '1 thess': '1 Thessalonians',
  '1thess': '1 Thessalonians',
  '1 th': '1 Thessalonians',
  '2 mga taga-tesalonica': '2 Thessalonians',
  '2 taga-tesalonica': '2 Thessalonians',
  '2 tesalonica': '2 Thessalonians',
  '2 thessalonians': '2 Thessalonians',
  '2 thess': '2 Thessalonians',
  '2thess': '2 Thessalonians',
  '2 th': '2 Thessalonians',
  '1 timoteo': '1 Timothy',
  '1 timothy': '1 Timothy',
  '1 tim': '1 Timothy',
  '1tim': '1 Timothy',
  '1 ti': '1 Timothy',
  '2 timoteo': '2 Timothy',
  '2 timothy': '2 Timothy',
  '2 tim': '2 Timothy',
  '2tim': '2 Timothy',
  '2 ti': '2 Timothy',
  'tito': 'Titus',
  'titus': 'Titus',
  'tit': 'Titus',
  'filemon': 'Philemon',
  'philemon': 'Philemon',
  'phlm': 'Philemon',
  'phm': 'Philemon',

  // General Epistles
  'mga hebreohanon': 'Hebrews',
  'hebreohanon': 'Hebrews',
  'hebreo': 'Hebrews',
  'hebrews': 'Hebrews',
  'heb': 'Hebrews',
  'santiago': 'James',
  'james': 'James',
  'jas': 'James',
  'jm': 'James',
  '1 pedro': '1 Peter',
  '1 peter': '1 Peter',
  '1 pet': '1 Peter',
  '1pet': '1 Peter',
  '1 pe': '1 Peter',
  '2 pedro': '2 Peter',
  '2 peter': '2 Peter',
  '2 pet': '2 Peter',
  '2pet': '2 Peter',
  '2 pe': '2 Peter',
  '1 juan': '1 John',
  '1 john': '1 John',
  '1 jhn': '1 John',
  '1jn': '1 John',
  '2 juan': '2 John',
  '2 john': '2 John',
  '2 jhn': '2 John',
  '2jn': '2 John',
  '3 juan': '3 John',
  '3 john': '3 John',
  '3 jhn': '3 John',
  '3jn': '3 John',
  'judas': 'Jude',
  'jude': 'Jude',
  'jud': 'Jude',

  // Old Testament - Pentateuch
  'genesis': 'Genesis',
  'gen': 'Genesis',
  'exodo': 'Exodus',
  'exodus': 'Exodus',
  'exo': 'Exodus',
  'ex': 'Exodus',
  'levitico': 'Leviticus',
  'leviticus': 'Leviticus',
  'lev': 'Leviticus',
  'numeros': 'Numbers',
  'numbers': 'Numbers',
  'num': 'Numbers',
  'deuteronomio': 'Deuteronomy',
  'deuteronomy': 'Deuteronomy',
  'deut': 'Deuteronomy',
  'deu': 'Deuteronomy',
  'dt': 'Deuteronomy',

  // Historical
  'josue': 'Joshua',
  'joshua': 'Joshua',
  'jos': 'Joshua',
  'josh': 'Joshua',
  'maghuhukom': 'Judges',
  'hukom': 'Judges',
  'judges': 'Judges',
  'judg': 'Judges',
  'jdg': 'Judges',
  'rut': 'Ruth',
  'ruth': 'Ruth',
  'rth': 'Ruth',
  '1 samuel': '1 Samuel',
  '1 sam': '1 Samuel',
  '1sam': '1 Samuel',
  '2 samuel': '2 Samuel',
  '2 sam': '2 Samuel',
  '2sam': '2 Samuel',
  '1 mga hari': '1 Kings',
  '1 hari': '1 Kings',
  '1 kings': '1 Kings',
  '1 kgs': '1 Kings',
  '1kings': '1 Kings',
  '2 mga hari': '2 Kings',
  '2 hari': '2 Kings',
  '2 kings': '2 Kings',
  '2 kgs': '2 Kings',
  '2kings': '2 Kings',
  '1 mga cronicas': '1 Chronicles',
  '1 cronicas': '1 Chronicles',
  '1 chronicles': '1 Chronicles',
  '1 chron': '1 Chronicles',
  '1 chr': '1 Chronicles',
  '1chr': '1 Chronicles',
  '2 mga cronicas': '2 Chronicles',
  '2 cronicas': '2 Chronicles',
  '2 chronicles': '2 Chronicles',
  '2 chron': '2 Chronicles',
  '2 chr': '2 Chronicles',
  '2chr': '2 Chronicles',
  'esdras': 'Ezra',
  'ezra': 'Ezra',
  'ezr': 'Ezra',
  'nehemias': 'Nehemiah',
  'nehemiah': 'Nehemiah',
  'neh': 'Nehemiah',
  'ester': 'Esther',
  'esther': 'Esther',
  'est': 'Esther',

  // Poetry / Wisdom
  'job': 'Job',
  'mga salmo': 'Psalms',
  'salmo': 'Psalms',
  'salmos': 'Psalms',
  'psalms': 'Psalms',
  'psalm': 'Psalms',
  'psa': 'Psalms',
  'ps': 'Psalms',
  'mga panultihon': 'Proverbs',
  'panultihon': 'Proverbs',
  'proverbs': 'Proverbs',
  'proverb': 'Proverbs',
  'prov': 'Proverbs',
  'pro': 'Proverbs',
  'manugwali': 'Ecclesiastes',
  'ecclesiastes': 'Ecclesiastes',
  'eccl': 'Ecclesiastes',
  'ecc': 'Ecclesiastes',
  'awit sa mga awit': 'Song of Solomon',
  'awit': 'Song of Solomon',
  'song of solomon': 'Song of Solomon',
  'song of songs': 'Song of Solomon',
  'cantares': 'Song of Solomon',
  'song': 'Song of Solomon',
  'sos': 'Song of Solomon',

  // Major Prophets
  'isaias': 'Isaiah',
  'isaiah': 'Isaiah',
  'isa': 'Isaiah',
  'jeremias': 'Jeremiah',
  'jeremiah': 'Jeremiah',
  'jer': 'Jeremiah',
  'mga bakho': 'Lamentations',
  'bakho': 'Lamentations',
  'lamentations': 'Lamentations',
  'lam': 'Lamentations',
  'ezequiel': 'Ezekiel',
  'ezekiel': 'Ezekiel',
  'ezek': 'Ezekiel',
  'eze': 'Ezekiel',
  'daniel': 'Daniel',
  'dan': 'Daniel',

  // Minor Prophets
  'oseas': 'Hosea',
  'hosea': 'Hosea',
  'hos': 'Hosea',
  'joel': 'Joel',
  'joe': 'Joel',
  'amos': 'Amos',
  'am': 'Amos',
  'abdias': 'Obadiah',
  'obadiah': 'Obadiah',
  'obad': 'Obadiah',
  'ob': 'Obadiah',
  'jonas': 'Jonah',
  'jonah': 'Jonah',
  'jon': 'Jonah',
  'miqueas': 'Micah',
  'micah': 'Micah',
  'mic': 'Micah',
  'nahum': 'Nahum',
  'nah': 'Nahum',
  'habacuc': 'Habakkuk',
  'habakkuk': 'Habakkuk',
  'hab': 'Habakkuk',
  'sofonias': 'Zephaniah',
  'zephaniah': 'Zephaniah',
  'zeph': 'Zephaniah',
  'zep': 'Zephaniah',
  'hageo': 'Haggai',
  'haggai': 'Haggai',
  'hag': 'Haggai',
  'zacarias': 'Zechariah',
  'zechariah': 'Zechariah',
  'zech': 'Zechariah',
  'zec': 'Zechariah',
  'malaquias': 'Malachi',
  'malachi': 'Malachi',
  'mal': 'Malachi'
};

export function normalizeBookName(input: string): string | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.\-]/g, ' ').trim();
  const rawClean = input.trim().toLowerCase().replace(/\s+/g, ' ');

  // Direct alias dictionary lookup
  if (BOOK_ALIASES[rawClean]) return BOOK_ALIASES[rawClean];
  if (BOOK_ALIASES[clean]) return BOOK_ALIASES[clean];

  // Normalized without spaces (e.g. "1timothy" -> "1 Timothy")
  const compact = rawClean.replace(/\s+/g, '');
  if (BOOK_ALIASES[compact]) return BOOK_ALIASES[compact];

  // Standard book list check
  const found = BIBLE_BOOKS.find(b =>
    b.name.toLowerCase() === rawClean ||
    b.cebName.toLowerCase() === rawClean ||
    b.name.toLowerCase() === clean ||
    b.cebName.toLowerCase() === clean ||
    b.name.toLowerCase().replace(/\s+/g, '') === compact ||
    b.cebName.toLowerCase().replace(/\s+/g, '') === compact
  );

  return found ? found.name : null;
}
