interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: string;
  total_copies: string;
  available_copies: string;
  description: string;
  color: string;
  cover: string;
  video: string;
  summary: string;
  isLoanedBook?: boolean;
}

interface AuthCredintials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}