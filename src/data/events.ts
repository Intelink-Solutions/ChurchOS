export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: number;
  status: string;
  registration: boolean;
  description?: string;
}

export const events: Event[] = [
  { id: 1, title: "Annual Thanksgiving Service", date: "Mar 15, 2024", time: "9:00 AM", location: "Main Auditorium", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=300&fit=crop", attendees: 450, status: "Upcoming", registration: true, description: "Join us for a powerful time of thanksgiving and worship as we celebrate God's faithfulness." },
  { id: 2, title: "Youth Conference 2024", date: "Apr 5–7, 2024", time: "10:00 AM", location: "Youth Center", image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=300&fit=crop", attendees: 200, status: "Upcoming", registration: true, description: "A 3-day conference designed to empower and equip the next generation of leaders." },
  { id: 3, title: "Easter Celebration", date: "Mar 31, 2024", time: "7:00 AM", location: "Main Auditorium", image: "https://images.unsplash.com/photo-1508963493744-76fce69379c0?w=600&h=300&fit=crop", attendees: 800, status: "Upcoming", registration: false, description: "Celebrate the resurrection of our Lord Jesus Christ with us this Easter." },
  { id: 4, title: "Marriage Seminar", date: "Apr 20, 2024", time: "2:00 PM", location: "Conference Hall", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=300&fit=crop", attendees: 120, status: "Open", registration: true, description: "Strengthen your marriage with practical biblical principles and workshops." },
  { id: 5, title: "Children's Day Program", date: "May 27, 2024", time: "10:00 AM", location: "Children's Wing", image: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&h=300&fit=crop", attendees: 150, status: "Planning", registration: false, description: "A fun-filled program celebrating our children with games, prizes, and worship." },
  { id: 6, title: "Worship Night", date: "Mar 22, 2024", time: "6:00 PM", location: "Main Auditorium", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=300&fit=crop", attendees: 350, status: "Upcoming", registration: true, description: "An evening of deep worship and intimate fellowship with God." },
];
