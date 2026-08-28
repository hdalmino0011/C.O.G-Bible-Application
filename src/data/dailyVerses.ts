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
    ceb: "Apan kon malangan man ako, aron ikaw mahibalo kon unsaon nimo sa paggawi diha sa balay sa Dios, nga mao ang iglesya sa Dios nga buhi, ang haligi ug patinduganan sa kamatuoran.",
    en: "But if I tarry long, that thou mayest know how thou oughtest to behave thyself in the house of God, which is the church of the living God, the pillar and ground of the truth."
  },
  {
    book: "Matthew",
    chapter: 16,
    verse: 18,
    title: "Built Upon The Rock",
    theme: "Foundation of Christ",
    doctrineEmphasis: "Jesus Christ Himself built His Church, and the gates of hell shall not prevail against it.",
    ceb: "Ug sultihan ko usab ikaw, nga ikaw mao si Pedro, ug sa ibabaw niining batoha pagatukuron ko ang akong iglesya; ug ang mga ganghaan sa Hades dili makabuntog kaniya.",
    en: "And I say also unto thee, That thou art Peter, and upon this rock I will build my church; and the gates of hell shall not prevail against it."
  },
  {
    book: "Acts",
    chapter: 20,
    verse: 28,
    title: "Purchased with His Own Blood",
    theme: "The Church of God",
    doctrineEmphasis: "Feed the Church of God which He hath purchased with His own blood.",
    ceb: "Bantayi ninyo ang inyong kaugalingon ug ang tibuok panon, diin ang Espiritu Santo naghimo kaninyong mga magtatan-aw, sa pagpakaon sa iglesya sa Dios, nga iyang pinalit pinaagi sa iyang kaugalingong dugo.",
    en: "Take heed therefore unto yourselves, and to all the flock, over the which the Holy Ghost hath made you overseers, to feed the church of God, which he hath purchased with his own blood."
  },
  {
    book: "1 Corinthians",
    chapter: 1,
    verse: 2,
    title: "Sanctified in Christ Jesus",
    theme: "The Church of God",
    doctrineEmphasis: "Unto the Church of God which is at Corinth, to them that are sanctified in Christ Jesus.",
    ceb: "Ngadto sa iglesya sa Dios nga anaa sa Corinto, ngadto sa mga gibalaan diha kang Cristo Jesus, nga gitawag aron mahimong mga balaan, uban sa tanan nga sa bisan diing dapita nagatawag sa ngalan sa atong Ginoong Jesu-Cristo.",
    en: "Unto the church of God which is at Corinth, to them that are sanctified in Christ Jesus, called to be saints, with all that in every place call upon the name of Jesus Christ our Lord."
  },
  {
    book: "Ephesians",
    chapter: 2,
    verse: 20,
    title: "The Chief Cornerstone",
    theme: "Apostolic Foundation",
    doctrineEmphasis: "Built upon the foundation of the apostles and prophets, Jesus Christ Himself being the chief corner stone.",
    ceb: "Nga gipanagtukod sa ibabaw sa patinduganan sa mga apostoles ug sa mga profeta, nga si Jesu-Cristo gayud mao ang pangulong bato sa pamag-ang.",
    en: "And are built upon the foundation of the apostles and prophets, Jesus Christ himself being the chief corner stone."
  },
  {
    book: "Psalms",
    chapter: 23,
    verse: 1,
    title: "The Lord is My Shepherd",
    theme: "Faith & Comfort",
    ceb: "Si Jehova mao ang akong magbalantay; walay makulang kanako.",
    en: "The LORD is my shepherd; I shall not want."
  },
  {
    book: "Proverbs",
    chapter: 3,
    verse: 5,
    title: "Trust in the Lord",
    theme: "Wisdom & Guidance",
    ceb: "Salig kang Jehova sa bug-os mong kasingkasing; ug ayaw pagsalig sa imong kaugalingong pagsabut.",
    en: "Trust in the LORD with all thine heart; and lean not unto thine own understanding."
  },
  {
    book: "John",
    chapter: 14,
    verse: 6,
    title: "The Way, Truth, and Life",
    theme: "Salvation in Christ",
    ceb: "Si Jesus miingon kaniya: Ako mao ang dalan, ug ang kamatuoran, ug ang kinabuhi: walay bisan kinsa nga makaadto sa Amahan, gawas kon pinaagi kanako.",
    en: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me."
  },
  {
    book: "Philippians",
    chapter: 4,
    verse: 13,
    title: "Strength in Christ",
    theme: "Encouragement",
    ceb: "Mahimo ko ang tanang mga butang pinaagi kang Cristo nga nagapalig-on kanako.",
    en: "I can do all things through Christ which strengtheneth me."
  },
  {
    book: "Isaiah",
    chapter: 40,
    verse: 31,
    title: "Renewed Strength",
    theme: "Hope & Renewal",
    ceb: "Apan kadtong nanaghulat kang Jehova magabag-o sa ilang kusog; managsaka sila pinaagi sa mga pako ingon sa mga agila; manalagan sila, ug dili pagakapoyon; manlakaw sila, ug dili mangaluya.",
    en: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."
  },
  {
    book: "Jeremiah",
    chapter: 4,
    verse: 2,
    title: "Truth, Justice, Righteousness",
    theme: "COG Pillar Doctrine",
    doctrineEmphasis: "And thou shalt swear, The LORD liveth, in truth, in judgment, and in righteousness.",
    ceb: "Ug ikaw manumpa: Ingon nga si Jehova buhi, sa kamatuoran, sa justicia, ug sa pagkamatarung; ug ang mga nasud magapanalangin sa ilang kaugalingon diha kaniya, ug diha kaniya sila managhimaya.",
    en: "And thou shalt swear, The LORD liveth, in truth, in judgment, and in righteousness; and the nations shall bless themselves in him, and in him shall they glory."
  },
  {
    book: "Romans",
    chapter: 8,
    verse: 28,
    title: "All Things Work Together for Good",
    theme: "God's Providence",
    ceb: "Ug kita nahibalo nga ang tanang mga butang nagatabang sa kaayohan alang kanila nga nahigugma sa Dios, kanila nga mga tinawag sumala sa iyang katuyoan.",
    en: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose."
  },
  {
    book: "Revelation",
    chapter: 14,
    verse: 12,
    title: "Patience of the Saints",
    theme: "Commandments of God",
    doctrineEmphasis: "Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus.",
    ceb: "Ania dinhi ang pailub sa mga balaan: ania dinhi kadtong nanagbantay sa mga sugo sa Dios, ug sa pagtoo ni Jesus.",
    en: "Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus."
  },
  {
    book: "Joshua",
    chapter: 1,
    verse: 9,
    title: "Be Strong and Courageous",
    theme: "Courage in Faith",
    ceb: "Wala ba ako magsugo kanimo? Magmaisugon ka ug magmadasigon; ayaw kahadlok, ni magmaluya ka: kay si Jehova nga imong Dios magauban kanimo bisan asa ikaw moadto.",
    en: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest."
  },
  {
    book: "Galatians",
    chapter: 1,
    verse: 13,
    title: "The Church of God",
    theme: "Biblical Identity",
    ceb: "Kay inyong nadungog ang akong kagawian sa unang panahon sa tinuhoan sa mga Judio, giunsa ko sa paglutos sa hilabihan gayud ang iglesya sa Dios, ug gigun-ob ko kini.",
    en: "For ye have heard of my conversation in time past in the Jews' religion, how that beyond measure I persecuted the church of God, and wasted it."
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
