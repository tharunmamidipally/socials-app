export interface Space {
  id: string
  name: string
  description: string
  memberCount: number
  icon: string
}

export interface BotMessage {
  id: string
  bot: {
    name: string
    avatar: string
    type: "results" | "jobs" | "events" | "ai"
  }
  content: string
  timestamp: Date
  channel: string
}

export interface Message {
  id: string
  user: {
    name: string
    avatar: string
    role: "student" | "moderator" | "admin"
    id: string
  }
  content: string
  timestamp: Date
  channel: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: Date
  time: string
  category: "academic" | "social" | "sports" | "career"
  attendees: number
  maxAttendees?: number
}

export interface LeaderboardUser {
  id: string
  name: string
  avatar: string
  category: "academic" | "social" | "sports" | "overall"
  score: number
  rank: number
  badge?: string
}

export interface StudentProfile {
  id: string
  name: string
  avatar: string
  role: "student" | "moderator" | "admin"
  email: string
  department: string
  year: string
  bio: string
  stats: {
    messagesCount: number
    eventsAttended: number
    leaderboardRank: number
    joinedDate: string
  }
  achievements: string[]
  interests: string[]
}

export interface InstituteInsight {
  id: string
  name: string
  location: string
  icon: string
  stats: {
    placements: number
    avgPackage: string
    topRecruiter: string
    studentsPlaced: number
  }
  achievements: {
    academicRank: number
    sportsRank: number
    researchPapers: number
  }
  coordinates: [number, number]
}

// Helper function to generate Dicebear avatar with smiley style
const generateAvatar = (seed: string) => `https://api.dicebear.com/7.x/big-smile/svg?seed=${seed}`

// Dummy data with Indian institutes
const dummySpaces: Space[] = [
  {
    id: "iit-delhi",
    name: "IIT Delhi",
    description: "Indian Institute of Technology Delhi",
    memberCount: 2340,
    icon: "🏛️",
  },
  {
    id: "bits-pilani",
    name: "BITS Pilani",
    description: "Birla Institute of Technology and Science",
    memberCount: 1890,
    icon: "🎓",
  },
  {
    id: "nit-trichy",
    name: "NIT Trichy",
    description: "National Institute of Technology Tiruchirappalli",
    memberCount: 1560,
    icon: "🏫",
  },
  {
    id: "iisc-bangalore",
    name: "IISc Bangalore",
    description: "Indian Institute of Science",
    memberCount: 980,
    icon: "🔬",
  },
]

const dummyInstituteInsights: InstituteInsight[] = [
  {
    id: "iit-delhi",
    name: "IIT Delhi",
    location: "New Delhi",
    icon: "🏛️",
    stats: {
      placements: 95,
      avgPackage: "₹18.5 LPA",
      topRecruiter: "Google",
      studentsPlaced: 1200,
    },
    achievements: {
      academicRank: 2,
      sportsRank: 5,
      researchPapers: 2400,
    },
    coordinates: [28.6139, 77.209],
  },
  {
    id: "bits-pilani",
    name: "BITS Pilani",
    location: "Pilani, Rajasthan",
    icon: "🎓",
    stats: {
      placements: 92,
      avgPackage: "₹16.2 LPA",
      topRecruiter: "Microsoft",
      studentsPlaced: 980,
    },
    achievements: {
      academicRank: 8,
      sportsRank: 3,
      researchPapers: 1800,
    },
    coordinates: [28.367, 75.585],
  },
  {
    id: "nit-trichy",
    name: "NIT Trichy",
    location: "Tiruchirappalli, Tamil Nadu",
    icon: "🏫",
    stats: {
      placements: 88,
      avgPackage: "₹14.8 LPA",
      topRecruiter: "Amazon",
      studentsPlaced: 850,
    },
    achievements: {
      academicRank: 12,
      sportsRank: 2,
      researchPapers: 1200,
    },
    coordinates: [10.7905, 78.7047],
  },
  {
    id: "iisc-bangalore",
    name: "IISc Bangalore",
    location: "Bangalore, Karnataka",
    icon: "🔬",
    stats: {
      placements: 98,
      avgPackage: "₹22.4 LPA",
      topRecruiter: "Tesla",
      studentsPlaced: 450,
    },
    achievements: {
      academicRank: 1,
      sportsRank: 8,
      researchPapers: 3200,
    },
    coordinates: [13.0827, 77.5718],
  },
]

// Add bot messages
const dummyBotMessages: BotMessage[] = [
  {
    id: "bot1",
    bot: {
      name: "Results Bot",
      avatar: generateAvatar("results-bot"),
      type: "results",
    },
    content:
      "📊 Semester results for CSE-2024 batch are now available. Average CGPA: 8.2. Top performer: Arjun Sharma (9.8 CGPA). Check your portal for detailed results.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    channel: "results-bot",
  },
  {
    id: "bot2",
    bot: {
      name: "Jobs Bot",
      avatar: generateAvatar("jobs-bot"),
      type: "jobs",
    },
    content:
      "🚀 New placement opportunity: Software Engineer at Flipkart (₹28 LPA). Application deadline: March 20th. Pre-placement talk scheduled for March 15th at 4 PM.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    channel: "jobs-bot",
  },
  {
    id: "bot3",
    bot: {
      name: "Events Bot",
      avatar: generateAvatar("events-bot"),
      type: "events",
    },
    content:
      "📅 Reminder: Tech Fest 'Pragyan 2024' starts tomorrow! Hackathon registrations close in 2 hours. Don't miss out! 🎯",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    channel: "events-bot",
  },
  {
    id: "bot4",
    bot: {
      name: "Ask AI",
      avatar: generateAvatar("ask-ai-bot"),
      type: "ai",
    },
    content:
      "🤖 Namaste! I can help you with course information, campus resources, placement stats, mess menu, and general queries. Just ask me anything in Hindi or English!",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    channel: "ask-ai-bot",
  },
]

const dummyMessages: Message[] = [
  {
    id: "1",
    user: {
      id: "priya-sharma",
      name: "Priya Sharma",
      avatar: generateAvatar("priya-sharma"),
      role: "student",
    },
    content: "Hey everyone! Welcome to our IIT Delhi community! 🙏 Excited to connect with fellow students!",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    channel: "welcome",
  },
  {
    id: "2",
    user: {
      id: "rajesh-kumar",
      name: "Dr. Rajesh Kumar",
      avatar: generateAvatar("rajesh-kumar"),
      role: "moderator",
    },
    content:
      "Thanks for joining! Make sure to check out the #events channel for upcoming tech talks and cultural events.",
    timestamp: new Date(Date.now() - 1000 * 60 * 110),
    channel: "welcome",
  },
  {
    id: "3",
    user: {
      id: "arjun-patel",
      name: "Arjun Patel",
      avatar: generateAvatar("arjun-patel"),
      role: "student",
    },
    content: "This platform looks amazing! Finally a place where we can all connect properly 🚀",
    timestamp: new Date(Date.now() - 1000 * 60 * 100),
    channel: "welcome",
  },
  {
    id: "4",
    user: {
      id: "sneha-gupta",
      name: "Sneha Gupta",
      avatar: generateAvatar("sneha-gupta"),
      role: "student",
    },
    content: "Love the leaderboard feature! Time to compete with my batchmates 😄",
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    channel: "welcome",
  },
  {
    id: "5",
    user: {
      id: "rahul-singh",
      name: "Rahul Singh",
      avatar: generateAvatar("rahul-singh"),
      role: "student",
    },
    content: "The smart bots are so helpful! Just got my placement updates instantly 📱",
    timestamp: new Date(Date.now() - 1000 * 60 * 80),
    channel: "welcome",
  },
  {
    id: "6",
    user: {
      id: "kavya-reddy",
      name: "Kavya Reddy",
      avatar: generateAvatar("kavya-reddy"),
      role: "student",
    },
    content: "Does anyone know when the next study group meets?",
    timestamp: new Date(Date.now() - 1000 * 60 * 70),
    channel: "general",
  },
  {
    id: "7",
    user: {
      id: "vikram-joshi",
      name: "Vikram Joshi",
      avatar: generateAvatar("vikram-joshi"),
      role: "student",
    },
    content: "I think it's this Friday at 6 PM in the library. Check the #events channel for confirmation!",
    timestamp: new Date(Date.now() - 1000 * 60 * 65),
    channel: "general",
  },
  {
    id: "8",
    user: {
      id: "ananya-singh",
      name: "Ananya Singh",
      avatar: generateAvatar("ananya-singh"),
      role: "student",
    },
    content: "Thanks! Also, has anyone started preparing for the upcoming placement season?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    channel: "general",
  },
  {
    id: "9",
    user: {
      id: "rohit-verma",
      name: "Rohit Verma",
      avatar: generateAvatar("rohit-verma"),
      role: "student",
    },
    content: "Yes! I've been practicing DSA problems daily. We should form a study group for placements too.",
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    channel: "general",
  },
  {
    id: "10",
    user: {
      id: "meera-gupta",
      name: "Prof. Meera Gupta",
      avatar: generateAvatar("meera-gupta"),
      role: "admin",
    },
    content:
      "📢 Important: End semester exam schedules have been posted on the academic portal. Best of luck to all students!",
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    channel: "announcements",
  },
  {
    id: "11",
    user: {
      id: "amit-sharma",
      name: "Dr. Amit Sharma",
      avatar: generateAvatar("amit-sharma"),
      role: "admin",
    },
    content: "📚 Library timings have been extended during exam period. Open 24/7 from next week.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    channel: "announcements",
  },
  {
    id: "12",
    user: {
      id: "registrar-office",
      name: "Registrar Office",
      avatar: generateAvatar("registrar-office"),
      role: "admin",
    },
    content: "🎓 Graduation ceremony date announced: May 15th, 2024. More details to follow soon.",
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    channel: "announcements",
  },
]

const dummyEvents: Event[] = [
  {
    id: "1",
    title: "Placement Prep - System Design",
    description: "Weekly preparation session for upcoming placements",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    time: "6:00 PM",
    category: "academic",
    attendees: 45,
    maxAttendees: 60,
  },
  {
    id: "2",
    title: "Diwali Celebration 2024",
    description: "Join us for rangoli competition and cultural performances",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    time: "7:00 PM",
    category: "social",
    attendees: 180,
    maxAttendees: 250,
  },
  {
    id: "3",
    title: "Inter-IIT Cricket Tournament",
    description: "Representing IIT Delhi in the annual cricket championship",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    time: "2:00 PM",
    category: "sports",
    attendees: 22,
    maxAttendees: 25,
  },
  {
    id: "4",
    title: "Campus Placement Drive",
    description: "Meet with top recruiters including TCS, Infosys, and startups",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    time: "10:00 AM",
    category: "career",
    attendees: 320,
    maxAttendees: 400,
  },
]

const dummyLeaderboard: LeaderboardUser[] = [
  {
    id: "ananya-singh",
    name: "Ananya Singh",
    avatar: generateAvatar("ananya-singh"),
    category: "academic",
    score: 2450,
    rank: 1,
    badge: "🏆",
  },
  {
    id: "rohit-verma",
    name: "Rohit Verma",
    avatar: generateAvatar("rohit-verma"),
    category: "social",
    score: 2380,
    rank: 2,
    badge: "🥈",
  },
  {
    id: "kavya-reddy",
    name: "Kavya Reddy",
    avatar: generateAvatar("kavya-reddy"),
    category: "sports",
    score: 2290,
    rank: 3,
    badge: "🥉",
  },
  {
    id: "vikram-joshi",
    name: "Vikram Joshi",
    avatar: generateAvatar("vikram-joshi"),
    category: "overall",
    score: 2150,
    rank: 4,
  },
  {
    id: "sneha-agarwal",
    name: "Sneha Agarwal",
    avatar: generateAvatar("sneha-agarwal"),
    category: "academic",
    score: 2050,
    rank: 5,
  },
  {
    id: "arjun-mehta",
    name: "Arjun Mehta",
    avatar: generateAvatar("arjun-mehta"),
    category: "sports",
    score: 1980,
    rank: 6,
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    avatar: generateAvatar("priya-nair"),
    category: "social",
    score: 1920,
    rank: 7,
  },
  {
    id: "karan-singh",
    name: "Karan Singh",
    avatar: generateAvatar("karan-singh"),
    category: "overall",
    score: 1850,
    rank: 8,
  },
]

const dummyStudentProfiles: StudentProfile[] = [
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    avatar: generateAvatar("priya-sharma"),
    role: "student",
    email: "priya.sharma@iitd.ac.in",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    bio: "Passionate about AI/ML and full-stack development. Love participating in hackathons and coding competitions. Always excited to learn new technologies!",
    stats: {
      messagesCount: 156,
      eventsAttended: 12,
      leaderboardRank: 8,
      joinedDate: "September 2023",
    },
    achievements: ["🏆 Winner - TechFest 2024", "🥇 First Place - Coding Competition", "📚 Academic Excellence Award"],
    interests: ["Machine Learning", "Web Development", "Competitive Programming", "Photography"],
  },
  {
    id: "arjun-patel",
    name: "Arjun Patel",
    avatar: generateAvatar("arjun-patel"),
    role: "student",
    email: "arjun.patel@iitd.ac.in",
    department: "Electrical Engineering",
    year: "2nd Year",
    bio: "Electronics enthusiast with a keen interest in robotics and IoT. Member of the Robotics Club and actively involved in various technical projects.",
    stats: {
      messagesCount: 89,
      eventsAttended: 8,
      leaderboardRank: 15,
      joinedDate: "October 2023",
    },
    achievements: ["🤖 Best Project - Robotics Fair", "⚡ Innovation Award", "🎯 Active Contributor"],
    interests: ["Robotics", "IoT", "Circuit Design", "Arduino Projects"],
  },
  {
    id: "kavya-reddy",
    name: "Kavya Reddy",
    avatar: generateAvatar("kavya-reddy"),
    role: "student",
    email: "kavya.reddy@iitd.ac.in",
    department: "Mechanical Engineering",
    year: "4th Year",
    bio: "Mechanical engineering student with expertise in CAD design and manufacturing. Captain of the college basketball team and sports enthusiast.",
    stats: {
      messagesCount: 234,
      eventsAttended: 25,
      leaderboardRank: 3,
      joinedDate: "August 2023",
    },
    achievements: ["🏀 Basketball Team Captain", "🏆 Sports Excellence Award", "🔧 Best Design Project"],
    interests: ["CAD Design", "Basketball", "Manufacturing", "3D Printing"],
  },
]

// API functions
export const fetchMessages = async (channel: string): Promise<Message[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return dummyMessages.filter((msg) => msg.channel === channel)
}

export const fetchEvents = async (): Promise<Event[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return dummyEvents
}

export const fetchLeaderboard = async (): Promise<LeaderboardUser[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return dummyLeaderboard
}

export const fetchSpaces = async (): Promise<Space[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return dummySpaces
}

export const fetchBotMessages = async (channel: string): Promise<BotMessage[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return dummyBotMessages.filter((msg) => msg.channel === channel)
}

export const fetchInstituteInsights = async (): Promise<InstituteInsight[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return dummyInstituteInsights
}

export const fetchStudentProfile = async (studentId: string): Promise<StudentProfile | null> => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return dummyStudentProfiles.find((profile) => profile.id === studentId) || null
}
