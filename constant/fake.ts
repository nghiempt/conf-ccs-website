const APPS = [
  {
    app_id: 1,
    app_name: "Facebook",
    app_thumbnail: "https://play-lh.googleusercontent.com/KCMTYuiTrKom4Vyf0G4foetVOwhKWzNbHWumV73IXexAIy5TTgZipL52WTt8ICL-oIo=w480-h960-rw",
    app_category: {
      category_id: 1,
      category_name: "Social Network"
    },
    app_developer: "Meta Platforms, Inc.",
    app_store_url: "https://play.google.com/store/apps/details?id=com.facebook.katana&hl=vi&gl=US",
    data_safety: {
      data_shared: [
        "Personal Info",
        "Approximate Location",
      ],
      data_collected: [
        "Audio",
        "Microphone",
      ],
    },
    privacy_policy: {
      data_shared: "We will collect and share your GPS location.",
      data_collected: "We will collect Audio, Mircophone and Contact.",
    },
    status: {
      incorrect: {
        status: true,
        description: "Because Data Safety only mentions collecting Audio and Microphone, but Privacy Policy also mentions Contact.",
      },
      incomplete: {
        status: false,
        description: "We have not detected Incomplete behavior",
      },
      inconsistent: {
        status: true,
        description: "Because Data Safety mentions sharing approximate location, but Privacy Policy says it will share GPS as Precise Location.",
      }
    }
  },
];

const CATEGORIES = [
  {
    id: 1,
    title: 'Part 1',
    category: 'Art & Design'
  },
  {
    id: 2,
    title: 'Part 2',
    category: 'Beauty'
  },
  // {
  //   id: 3,
  //   title: 'Part 3',
  //   category: 'Art & Design'
  // },
  // {
  //   id: 4,
  //   title: 'Part 4',
  //   category: 'Beauty'
  // },
  // {
  //   id: 5,
  //   title: 'Part 5',
  //   category: 'Beauty'
  // },
  // {
  //   id: 6,
  //   title: 'Part 6',
  //   category: 'Beauty'
  // },
  // {
  //   id: 7,
  //   title: 'Part 7',
  //   category: 'Books & Reference'
  // },
  // {
  //   id: 8,
  //   title: 'Part 8',
  //   category: 'Books & Reference'
  // },
  // {
  //   id: 9,
  //   title: 'Part 9',
  //   category: 'Books & Reference'
  // },
  // {
  //   id: 10,
  //   title: 'Part 10',
  //   category: 'Business'
  // },
  // {
  //   id: 11,
  //   title: 'Part 11',
  //   category: 'Business'
  // },
  // {
  //   id: 12,
  //   title: 'Part 12',
  //   category: 'Business'
  // },
  // {
  //   id: 13,
  //   title: 'Part 13',
  //   category: 'Communication'
  // },
  // {
  //   id: 14,
  //   title: 'Part 14',
  //   category: 'Communication'
  // },
  // {
  //   id: 15,
  //   title: 'Part 15',
  //   category: 'Communication'
  // },
  // {
  //   id: 16,
  //   title: 'Part 16',
  //   category: 'Lifestyle'
  // },
  // {
  //   id: 17,
  //   title: 'Part 17',
  //   category: 'Lifestyle'
  // },
  // {
  //   id: 18,
  //   title: 'Part 18',
  //   category: 'Lifestyle'
  // },
  // {
  //   id: 19,
  //   title: 'Part 19',
  //   category: 'Personalization'
  // },
  // {
  //   id: 20,
  //   title: 'Part 20',
  //   category: 'Personalization'
  // },
  // {
  //   id: 21,
  //   title: 'Part 21',
  //   category: 'Personalization'
  // },
  // {
  //   id: 22,
  //   title: 'Part 22',
  //   category: 'Photography'
  // },
  // {
  //   id: 23,
  //   title: 'Part 23',
  //   category: 'Photography'
  // },
  // {
  //   id: 24,
  //   title: 'Part 24',
  //   category: 'Photography'
  // },
  // {
  //   id: 25,
  //   title: 'Part 25',
  //   category: 'Productivity'
  // },
  // {
  //   id: 26,
  //   title: 'Part 26',
  //   category: 'Productivity'
  // },
  // {
  //   id: 27,
  //   title: 'Part 27',
  //   category: 'Productivity'
  // },
  // {
  //   id: 28,
  //   title: 'Part 28',
  //   category: 'Shopping'
  // },
  // {
  //   id: 29,
  //   title: 'Part 29',
  //   category: 'Shopping'
  // },
  // {
  //   id: 30,
  //   title: 'Part 30',
  //   category: 'Shopping'
  // },
  // {
  //   id: 31,
  //   title: 'Part 31',
  //   category: 'Social'
  // },
  // {
  //   id: 32,
  //   title: 'Part 32',
  //   category: 'Social'
  // },
  // {
  //   id: 33,
  //   title: 'Part 33',
  //   category: 'Social'
  // },
  // {
  //   id: 34,
  //   title: 'Part 34',
  //   category: 'Tools'
  // },
  // {
  //   id: 35,
  //   title: 'Part 35',
  //   category: 'Tools'
  // },
  // {
  //   id: 36,
  //   title: 'Part 36',
  //   category: 'Tools'
  // },
];

export const FAKE = {
  APPS,
  CATEGORIES
};
