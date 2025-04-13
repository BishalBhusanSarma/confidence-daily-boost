
// Task categories by profession
export interface TaskData {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  points: number;
  forProfessions: string[];
  ageMin?: number;
  ageMax?: number;
}

export const tasksByProfession: TaskData[] = [
  // Student tasks (age 12-22)
  {
    id: "student-1",
    title: "Participate in Class Discussion",
    description: "Raise your hand and contribute at least one comment or question in your next class.",
    category: "Academic Confidence",
    difficulty: 1,
    points: 15,
    forProfessions: ["student"],
    ageMin: 12,
    ageMax: 22
  },
  {
    id: "student-2",
    title: "Ask a Question",
    description: "Ask a question to your teacher or professor when you don't understand something.",
    category: "Academic Confidence",
    difficulty: 2,
    points: 20,
    forProfessions: ["student"],
    ageMin: 12,
    ageMax: 22
  },
  {
    id: "student-3",
    title: "Study Group Leadership",
    description: "Organize a study group with classmates and lead one session.",
    category: "Leadership",
    difficulty: 3,
    points: 30,
    forProfessions: ["student"],
    ageMin: 15,
    ageMax: 22
  },
  {
    id: "student-4",
    title: "Present to Small Group",
    description: "Practice presenting your ideas to a small group of 2-3 friends before a larger presentation.",
    category: "Public Speaking",
    difficulty: 2,
    points: 25,
    forProfessions: ["student"],
    ageMin: 12,
    ageMax: 22
  },
  {
    id: "student-5",
    title: "Take Initiative on Group Project",
    description: "Volunteer to take on a specific role or responsibility in your next group project.",
    category: "Initiative",
    difficulty: 2,
    points: 25,
    forProfessions: ["student"],
    ageMin: 12,
    ageMax: 22
  },
  
  // Professional tasks
  {
    id: "professional-1",
    title: "Speak Up in Meeting",
    description: "Share at least one idea or opinion in your next team meeting.",
    category: "Public Speaking",
    difficulty: 2,
    points: 20,
    forProfessions: ["professional", "freelancer"]
  },
  {
    id: "professional-2",
    title: "Request Feedback",
    description: "Ask your manager or colleague for specific feedback on a recent project.",
    category: "Self-Improvement",
    difficulty: 2,
    points: 25,
    forProfessions: ["professional"]
  },
  {
    id: "professional-3",
    title: "Propose a Solution",
    description: "Identify a challenge at work and propose a potential solution to your team.",
    category: "Problem-Solving",
    difficulty: 3,
    points: 30,
    forProfessions: ["professional", "freelancer"]
  },
  {
    id: "professional-4",
    title: "Lead a Meeting",
    description: "Volunteer to lead a meeting or a portion of a meeting in your workplace.",
    category: "Leadership",
    difficulty: 3,
    points: 35,
    forProfessions: ["professional"]
  },
  {
    id: "professional-5",
    title: "Network with a Colleague",
    description: "Invite a colleague from a different department for a virtual coffee chat.",
    category: "Networking",
    difficulty: 2,
    points: 20,
    forProfessions: ["professional", "freelancer"]
  },
  
  // Freelancer tasks
  {
    id: "freelancer-1",
    title: "Cold Pitch a Client",
    description: "Reach out to a potential client with a personalized pitch for your services.",
    category: "Sales",
    difficulty: 3,
    points: 35,
    forProfessions: ["freelancer"]
  },
  {
    id: "freelancer-2",
    title: "Raise Your Rates",
    description: "Practice the conversation of raising your rates with a friend, then implement with your next client.",
    category: "Business Confidence",
    difficulty: 3,
    points: 40,
    forProfessions: ["freelancer"]
  },
  {
    id: "freelancer-3",
    title: "Share Your Work",
    description: "Post about your recent work on social media or a professional platform.",
    category: "Self-Promotion",
    difficulty: 2,
    points: 25,
    forProfessions: ["freelancer", "professional"]
  },
  
  // General tasks for all
  {
    id: "general-1",
    title: "Practice Positive Self-Talk",
    description: "Write down three positive affirmations about yourself and repeat them throughout the day.",
    category: "Mindset",
    difficulty: 1,
    points: 10,
    forProfessions: ["student", "professional", "freelancer", "other"]
  },
  {
    id: "general-2",
    title: "Try Something New",
    description: "Do one small thing outside of your comfort zone today.",
    category: "Comfort Zone",
    difficulty: 2,
    points: 20,
    forProfessions: ["student", "professional", "freelancer", "other"]
  },
  {
    id: "general-3",
    title: "Compliment Someone",
    description: "Give a genuine compliment to someone you interact with today.",
    category: "Social Skills",
    difficulty: 1,
    points: 15,
    forProfessions: ["student", "professional", "freelancer", "other"]
  },
  {
    id: "general-4",
    title: "Set a Small Goal",
    description: "Set a specific, achievable goal for today and accomplish it.",
    category: "Goal Setting",
    difficulty: 1,
    points: 15,
    forProfessions: ["student", "professional", "freelancer", "other"]
  },
  {
    id: "general-5",
    title: "Celebrate a Win",
    description: "Acknowledge and celebrate a recent achievement, no matter how small.",
    category: "Self-Recognition",
    difficulty: 1,
    points: 10,
    forProfessions: ["student", "professional", "freelancer", "other"]
  }
];

// Helper function to get tasks appropriate for a user
export const getTasksForUser = (profession: string, age?: number): TaskData[] => {
  return tasksByProfession.filter(task => {
    // Check if task is appropriate for the profession
    const matchesProfession = task.forProfessions.includes(profession) || 
                             task.forProfessions.includes('all');
    
    // Check if task is appropriate for the age (if age is provided and task has age restrictions)
    const matchesAge = !age || !task.ageMin || !task.ageMax || 
                      (age >= task.ageMin && age <= task.ageMax);
    
    return matchesProfession && matchesAge;
  });
};
