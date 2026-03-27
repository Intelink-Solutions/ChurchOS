export interface Sermon {
  id: number;
  title: string;
  preacher: string;
  date: string;
  bibleText: string;
  duration: string;
  hasAudio: boolean;
  hasVideo: boolean;
  thumbnail: string;
}

export const sermons: Sermon[] = [
  { id: 1, title: "Walking in God's Purpose", preacher: "Pastor James Adeyemi", date: "Jan 14, 2024", bibleText: "Jeremiah 29:11", duration: "45 min", hasAudio: true, hasVideo: true, thumbnail: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=250&fit=crop" },
  { id: 2, title: "The Power of Prayer", preacher: "Pastor Grace Okafor", date: "Jan 7, 2024", bibleText: "Philippians 4:6-7", duration: "38 min", hasAudio: true, hasVideo: false, thumbnail: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=250&fit=crop" },
  { id: 3, title: "Faith Over Fear", preacher: "Pastor James Adeyemi", date: "Dec 31, 2023", bibleText: "Isaiah 41:10", duration: "52 min", hasAudio: true, hasVideo: true, thumbnail: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=250&fit=crop" },
  { id: 4, title: "Building Strong Families", preacher: "Minister Ruth Balogun", date: "Dec 24, 2023", bibleText: "Proverbs 22:6", duration: "40 min", hasAudio: true, hasVideo: true, thumbnail: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&h=250&fit=crop" },
  { id: 5, title: "Grace for the Journey", preacher: "Pastor James Adeyemi", date: "Dec 17, 2023", bibleText: "2 Corinthians 12:9", duration: "42 min", hasAudio: true, hasVideo: false, thumbnail: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=400&h=250&fit=crop" },
  { id: 6, title: "Stewardship & Generosity", preacher: "Pastor Grace Okafor", date: "Dec 10, 2023", bibleText: "Luke 6:38", duration: "35 min", hasAudio: true, hasVideo: true, thumbnail: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=250&fit=crop" },
];
