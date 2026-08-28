import { BibleData } from '../types';

export interface DailyVerse {
  dayOfYear?: number;
  book: string;
  chapter: number;
  verse: number;
  title: string;
  theme: string;
  ceb: string;
  en: string;
  doctrineEmphasis?: string;
}

export const DAILY_VERSES: DailyVerse[] = [
  {
    book: "1 Timothy",
    chapter: 3,
    verse: 15,
    title: "The Church of the Living God",
    theme: "The True Church",
    doctrineEmphasis: "The True Church is The Church of God, the pillar and ground of the truth.",
    ceb: "Apan kong ako malangan ug dugay, aron masayran mo kong unsa ang paggawi sa mga tawo sa balay sa Dios, nga mao ang iglesia sa Dios nga buhi, haligi ug patukoranan sa kamatuoran.",
    en: "But if I tarry long, that thou mayest know how thou oughtest to behave thyself in the house of God, which is the church of the living God, the pillar and ground of the truth."
  },
  {
    book: "Matthew",
    chapter: 16,
    verse: 18,
    title: "Built Upon The Rock",
    theme: "Foundation of Christ",
    doctrineEmphasis: "Jesus Christ Himself built His Church, and the gates of hell shall not prevail against it.",
    ceb: "Ug ako nagaingon usab kanimo, nga ikaw mao si Pedro ug sa ibabaw niining bato pagatukoron ko ang akong Iglesia, ug ang mga ganghaan sa Hades dili makadaug kaniya.",
    en: "And I say also unto thee, That thou art Peter, and upon this rock I will build my church; and the gates of hell shall not prevail against it."
  },
  {
    book: "Acts",
    chapter: 20,
    verse: 28,
    title: "Purchased with His Own Blood",
    theme: "The Church of God",
    doctrineEmphasis: "Feed the Church of God which He hath purchased with His own blood.",
    ceb: "Matngoni ninyo ang inyong kaugalingon, ug ang tanang panon nga kanila ang Espiritu Santo naghimo kaninyo nga mga magtatan-aw, aron pasibsibon ninyo ang iglesia sa Dios nga gipalit niya sa iyang kaugalingong dugo.",
    en: "Take heed therefore unto yourselves, and to all the flock, over the which the Holy Ghost hath made you overseers, to feed the church of God, which he hath purchased with his own blood."
  },
  {
    book: "1 Corinthians",
    chapter: 1,
    verse: 2,
    title: "Sanctified in Christ Jesus",
    theme: "The Church of God",
    doctrineEmphasis: "Unto the Church of God which is at Corinth, to them that are sanctified in Christ Jesus.",
    ceb: "Alang sa iglesia sa Dios nga anaa sa Corinto, kanila nga mga ginabalaan kang Cristo Jesus, sa mga ginganlan nga balaan, uban sa tanan nga nanagtawag sa tanang dapit sa ngalan sa atong Ginoong Jesucristo ilang Ginoo ug ato usab:",
    en: "Unto the church of God which is at Corinth, to them that are sanctified in Christ Jesus, called to be saints, with all that in every place call upon the name of Jesus Christ our Lord, both theirs and ours:"
  },
  {
    book: "Ephesians",
    chapter: 2,
    verse: 20,
    title: "The Chief Cornerstone",
    theme: "Apostolic Foundation",
    doctrineEmphasis: "Built upon the foundation of the apostles and prophets, Jesus Christ Himself being the chief corner stone.",
    ceb: "Sa mga tinukod kamo sa ibabaw sa patukoranan sa mga apostoles ug sa mga manalagna, nga si Jesucristo gayud mao ang pangulo nga bato sa pamag-ang,",
    en: "And are built upon the foundation of the apostles and prophets, Jesus Christ himself being the chief corner stone;"
  },
  {
    book: "Psalms",
    chapter: 23,
    verse: 1,
    title: "The Lord is My Shepherd",
    theme: "Faith & Comfort",
    ceb: "Si Jehova mao ang akong magbalantay; Walay makulang kanako.",
    en: "The LORD is my shepherd; I shall not want."
  },
  {
    book: "Proverbs",
    chapter: 3,
    verse: 5,
    title: "Trust in the Lord",
    theme: "Wisdom & Guidance",
    ceb: "Sumalig ka kang Jehova sa bug-os mong kasingkasing, Ug ayaw pagsalig sa imong kaugagalingong salabutan:",
    en: "Trust in the LORD with all thine heart; and lean not unto thine own understanding."
  },
  {
    book: "John",
    chapter: 14,
    verse: 6,
    title: "The Way, Truth, and Life",
    theme: "Salvation in Christ",
    ceb: "Si Jesus miingon kaniya: Ako mao ang dalan, ug ang kamatuoran, ug ang kinabuhi; walay bisan kinsa nga maka-abut sa Amahan kondili pinaagi kanako.",
    en: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me."
  },
  {
    book: "Philippians",
    chapter: 4,
    verse: 13,
    title: "Strength in Christ",
    theme: "Encouragement",
    ceb: "Mahimo ko ang tanang mga butang diha kaniya nga nagapalig-on kanako.",
    en: "I can do all things through Christ which strengtheneth me."
  },
  {
    book: "Isaiah",
    chapter: 40,
    verse: 31,
    title: "Renewed Strength",
    theme: "Hope & Renewal",
    ceb: "Apan kadtong nagabuhat kang Jehova magabag-o sa ilang kusog; sila manlupad pinaagi sa mga pako ingon sa mga agila; sila manalagan, ug dili makapuyan: sila manlakaw, ug dili mangaluya.",
    en: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."
  },
  {
    book: "Jeremiah",
    chapter: 4,
    verse: 2,
    title: "Truth, Justice, Righteousness",
    theme: "COG Pillar Doctrine",
    doctrineEmphasis: "And thou shalt swear, The LORD liveth, in truth, in judgment, and in righteousness.",
    ceb: "Ug ikaw magapanumpa: Ingon nga si Jehova buhi, sa kamatuoran, sa justicia, ug sa pagkamatarung; ug ang mga nasud managpanalangin sa ilang kaugalingon diha kaniya, ug diha kaniya sila managhimaya.",
    en: "And thou shalt swear, The LORD liveth, in truth, in judgment, and in righteousness; and the nations shall bless themselves in him, and in him shall they glory."
  },
  {
    book: "Romans",
    chapter: 8,
    verse: 28,
    title: "All Things Work Together for Good",
    theme: "God's Providence",
    ceb: "Ug hingbaloan nato nga ang tanan nga mga butang masigtabang alang sa ikaayo niadtong mga nahigugma sa Dios, bisan niadtong mga ginatawag sumala sa iyang tuyo.",
    en: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose."
  },
  {
    book: "Revelation",
    chapter: 14,
    verse: 12,
    title: "Patience of the Saints",
    theme: "Commandments of God",
    doctrineEmphasis: "Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus.",
    ceb: "Ania ang pagpailub sa mga balaan, sila nga nagabantay sa mga sugo sa Dios, ug sa kang Jesus nga pagtoo.",
    en: "Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus."
  },
  {
    book: "Joshua",
    chapter: 1,
    verse: 9,
    title: "Be Strong and Courageous",
    theme: "Courage in Faith",
    ceb: "Wala ko ba ikaw sugoa? Magmakusganon ka ug magmaisug: ayaw pagkahadlok ug dili ka magmaluya; kay si Jehova nga imong Dios, magauban kanimo bisan asa ikaw paingon.",
    en: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest."
  },
  {
    book: "Galatians",
    chapter: 1,
    verse: 13,
    title: "The Church of God",
    theme: "Biblical Identity",
    ceb: "Kay hingbatian na ninyo ang taras sa akong kinabuhi kaniadto sa tinohoan sa mga Judio, kong giunsa ko paglutos sa hilabihan gayud ang iglesia sa Dios, ug gilaglag ko kini.",
    en: "For ye have heard of my conversation in time past in the Jews' religion, how that beyond measure I persecuted the church of God, and wasted it:"
  },
  {
    book: "Psalms",
    chapter: 119,
    verse: 105,
    title: "A Lamp Unto My Feet",
    theme: "God's Word",
    ceb: "Ang imong pulong maoy usa ka suga sa akong mga tiil, Ug usa ka kahayag sa akong alagianan.",
    en: "Thy word is a lamp unto my feet, and a light unto my path."
  },
  {
    book: "Proverbs",
    chapter: 16,
    verse: 3,
    title: "Commit Thy Works",
    theme: "Guidance",
    ceb: "Itugyan ang imong mga buhat kang Jehova, Ug ang imong mga tuyo mangatuman.",
    en: "Commit thy works unto the LORD, and thy thoughts shall be established."
  },
  {
    book: "Matthew",
    chapter: 6,
    verse: 33,
    title: "Seek Ye First",
    theme: "Kingdom of God",
    ceb: "Apan maoy unaha ninyo pagpangita ang gingharian sa Dios, ug ang iyang pagkamatarung; ug kining tanan nga mga butang igadugang ra kaninyo.",
    en: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you."
  },
  {
    book: "Romans",
    chapter: 12,
    verse: 2,
    title: "Transformed by Renewing",
    theme: "Spiritual Life",
    ceb: "Ug ayaw kamo pagpahiuyon niining kalibutana: kondili mag-usab kamo pinaagi sa pagbag-o sa inyong hunahuna, aron inyong mapamatud-an kong unsa ang maayo ug nahamut-an ug hingpit nga kabubut-on sa Dios.",
    en: "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God."
  },
  {
    book: "2 Timothy",
    chapter: 3,
    verse: 16,
    title: "All Scripture is Given by Inspiration",
    theme: "Holy Scriptures",
    ceb: "Ang tibook nga Kasulatan gituga sa Dios ug may kapuslanan usab sa pagpanudlo, sa pagpamadlong, sa pagpanadlong, sa pagtudlo nga anaa sa pagkamatarung:",
    en: "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness:"
  }
];

export function getTodayVerse(): DailyVerse {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = dayOfYear % DAILY_VERSES.length;
  return DAILY_VERSES[index];
}

export function getRandomDailyVerse(bibleData?: BibleData): DailyVerse {
  // If bibleData has loaded books with verses, pick a random verse from any loaded book
  if (bibleData) {
    const availableBooks = Object.keys(bibleData).filter(b => bibleData[b] && Object.keys(bibleData[b]).length > 0);
    if (availableBooks.length > 0) {
      const randomBook = availableBooks[Math.floor(Math.random() * availableBooks.length)];
      const bookObj = bibleData[randomBook];
      const chapters = Object.keys(bookObj);
      if (chapters.length > 0) {
        const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
        const verses = bookObj[randomChapter];
        if (verses && verses.length > 0) {
          const randomVerse = verses[Math.floor(Math.random() * verses.length)];
          if (randomVerse.ceb || randomVerse.en) {
            return {
              book: randomBook,
              chapter: parseInt(randomChapter, 10),
              verse: randomVerse.v,
              title: `${randomBook} ${randomChapter}:${randomVerse.v}`,
              theme: "Daily Scripture",
              ceb: randomVerse.ceb || randomVerse.en,
              en: randomVerse.en || randomVerse.ceb
            };
          }
        }
      }
    }
  }

  // Fallback to random pick from the curated list of exact Bible verses
  const randomIndex = Math.floor(Math.random() * DAILY_VERSES.length);
  return DAILY_VERSES[randomIndex];
}
