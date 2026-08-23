import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ================= OLD TESTAMENT =================
  {
    id: 'ot-1',
    category: 'old',
    categoryLabel: 'Old Testament',
    q: 'Who led the children of Israel out of Egyptian bondage across the Red Sea?',
    options: ['Moses', 'Joshua', 'Aaron', 'Abraham'],
    answer: 0,
    explanation: 'God called Moses at the burning bush and sent him to Pharaoh to lead Israel out of Egypt.',
    reference: 'Exodus 3:10, Exodus 14:21-22'
  },
  {
    id: 'ot-2',
    category: 'old',
    categoryLabel: 'Old Testament',
    q: 'What is Baal consistently identified as in the Holy Scriptures?',
    options: ['A false god and pagan idol', 'A true divine deity', 'An archangel of God', 'An ancient high priest'],
    answer: 0,
    explanation: 'Baal is a false god and powerless Canaanite idol whose worship was strongly forbidden and condemned by God.',
    reference: 'Judges 2:11-13, 1 Kings 18:21-40'
  },
  {
    id: 'ot-3',
    category: 'old',
    categoryLabel: 'Old Testament',
    q: 'How many days did it take God to create the heavens, earth, and all life before resting on the seventh day?',
    options: ['5 days', '6 days', '7 days', '10 days'],
    answer: 1,
    explanation: 'God completed His creation work in 6 days and rested on the 7th day, blessing and sanctifying the Sabbath.',
    reference: 'Genesis 1:31, Genesis 2:1-3, Exodus 20:11'
  },
  {
    id: 'ot-4',
    category: 'old',
    categoryLabel: 'Old Testament',
    q: 'Which prophet challenged and exposed the 450 prophets of the false god Baal on Mount Carmel?',
    options: ['Elijah', 'Elisha', 'Isaiah', 'Jeremiah'],
    answer: 0,
    explanation: 'Elijah called down fire from heaven to prove that YHWH is God and that Baal was a lifeless false god.',
    reference: '1 Kings 18:21-39'
  },
  {
    id: 'ot-5',
    category: 'old',
    categoryLabel: 'Old Testament',
    q: 'Who was protected by God when thrown into the lions\' den for praying only to the True God?',
    options: ['David', 'Daniel', 'Samuel', 'Joseph'],
    answer: 1,
    explanation: 'God sent His angel and shut the lions\' mouths because Daniel was found innocent before God.',
    reference: 'Daniel 6:16-23'
  },
  {
    id: 'ot-6',
    category: 'old',
    categoryLabel: 'Old Testament',
    q: 'Who built the ark of gopher wood at God\'s command to preserve life through the great flood?',
    options: ['Noah', 'Abraham', 'Job', 'Enoch'],
    answer: 0,
    explanation: 'Noah found grace in the eyes of the LORD and obeyed all that God commanded him.',
    reference: 'Genesis 6:8-14, Genesis 7:1'
  },
  {
    id: 'ot-7',
    category: 'old',
    categoryLabel: 'Old Testament',
    q: 'Which king of Israel asked God for an understanding heart and wisdom to govern His people?',
    options: ['Saul', 'David', 'Solomon', 'Hezekiah'],
    answer: 2,
    explanation: 'God gave Solomon unmatched wisdom and knowledge because he asked for discernment rather than long life or riches.',
    reference: '1 Kings 3:9-12'
  },
  {
    id: 'ot-8',
    category: 'old',
    categoryLabel: 'Old Testament',
    q: 'What were the two stone tablets containing the Ten Commandments placed inside?',
    options: ['The Ark of the Covenant', 'The Table of Showbread', 'The Altar of Incense', 'The Golden Candlestick'],
    answer: 0,
    explanation: 'The tablets of testimony were placed inside the Ark of the Covenant in the Most Holy Place.',
    reference: 'Exodus 25:16, Deuteronomy 10:5'
  },

  // ================= NEW TESTAMENT =================
  {
    id: 'nt-1',
    category: 'new',
    categoryLabel: 'New Testament',
    q: 'In which town in Judea was Jesus Christ born according to Old Testament prophecy?',
    options: ['Nazareth', 'Jerusalem', 'Bethlehem', 'Capernaum'],
    answer: 2,
    explanation: 'Jesus was born in Bethlehem of Judea, fulfilling the prophecy in Micah 5:2.',
    reference: 'Micah 5:2, Matthew 2:1, Luke 2:4-7'
  },
  {
    id: 'nt-2',
    category: 'new',
    categoryLabel: 'New Testament',
    q: 'According to 1 Timothy 3:15, what is called "the house of God, the pillar and ground of the truth"?',
    options: ['The Church of the living God', 'The Roman Empire', 'The temple in Athens', 'The Sanhedrin'],
    answer: 0,
    explanation: 'Paul writes to Timothy that the church of the living God is the pillar and ground of the truth.',
    reference: '1 Timothy 3:15'
  },
  {
    id: 'nt-3',
    category: 'new',
    categoryLabel: 'New Testament',
    q: 'How many apostles did Jesus specifically choose and appoint during His earthly ministry?',
    options: ['10', '12', '7', '14'],
    answer: 1,
    explanation: 'Jesus appointed twelve disciples that they should be with Him and that He might send them forth to preach.',
    reference: 'Matthew 10:1-4, Mark 3:14'
  },
  {
    id: 'nt-4',
    category: 'new',
    categoryLabel: 'New Testament',
    q: 'Who prepared the way of the Lord and baptized Jesus in the Jordan River?',
    options: ['Peter', 'John the Baptist', 'Andrew', 'Philip'],
    answer: 1,
    explanation: 'John the Baptist baptized Jesus in the Jordan, where the Holy Spirit descended like a dove.',
    reference: 'Matthew 3:13-17'
  },
  {
    id: 'nt-5',
    category: 'new',
    categoryLabel: 'New Testament',
    q: 'Which disciple denied knowing Jesus three times before the rooster crowed, and later wept bitterly?',
    options: ['Judas', 'Thomas', 'Peter', 'John'],
    answer: 2,
    explanation: 'Peter denied the Lord three times as foretold, but later repented and was restored.',
    reference: 'Matthew 26:69-75, John 21:15-17'
  },
  {
    id: 'nt-6',
    category: 'new',
    categoryLabel: 'New Testament',
    q: 'On the road to which city did Saul (Paul) encounter a blinding light and the voice of Jesus?',
    options: ['Damascus', 'Rome', 'Corinth', 'Ephesus'],
    answer: 0,
    explanation: 'While travelling to Damascus to persecute believers, the Lord Jesus appeared to Saul in a glorious light.',
    reference: 'Acts 9:1-6'
  },
  {
    id: 'nt-7',
    category: 'new',
    categoryLabel: 'New Testament',
    q: 'What is the fruit of the Spirit listed by the Apostle Paul in Galatians 5:22-23?',
    options: [
      'Love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance',
      'Power, wealth, popularity, political office',
      'Knowledge of philosophy, eloquence, debate',
      'Fasting only without charity'
    ],
    answer: 0,
    explanation: 'The fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance.',
    reference: 'Galatians 5:22-23'
  },

  // ================= ALL / DOCTRINE =================
  {
    id: 'all-1',
    category: 'all',
    categoryLabel: 'All Books',
    q: 'What are the three cornerstone principles in the official name of The Church of God (T.J.R)?',
    options: [
      'Truth, Justice, and Righteousness',
      'Tradition, Judgment, and Religion',
      'Thought, Joy, and Recreation',
      'Trust, Journey, and Restoration'
    ],
    answer: 0,
    explanation: 'The Church of God stands for Truth, Justice, and Righteousness founded upon the Word of God.',
    reference: '1 Timothy 3:15, Psalm 89:14'
  },
  {
    id: 'all-2',
    category: 'all',
    categoryLabel: 'All Books',
    q: 'Which psalm begins with the beloved phrase "The LORD is my shepherd; I shall not want"?',
    options: ['Psalm 23', 'Psalm 91', 'Psalm 119', 'Psalm 150'],
    answer: 0,
    explanation: 'Psalm 23 is David\'s famous Psalm of trust in the LORD as the Good Shepherd.',
    reference: 'Psalm 23:1'
  },
  {
    id: 'all-3',
    category: 'all',
    categoryLabel: 'All Books',
    q: 'What is the last book in the Holy Bible?',
    options: ['Revelation (Pinadayag)', 'Jude', 'Malachi', 'Hebrews'],
    answer: 0,
    explanation: 'The Revelation of Jesus Christ written by the Apostle John is the final prophetic book of the New Testament.',
    reference: 'Revelation 1:1, Revelation 22:20-21'
  }
];
