export type DateMemory = {
  id: string;
  title: string;
  description: string;
  location: string | null;
  memoryDate: Date;
  images: string | null;
  likedBy: string;
  createdAt: Date;
  comments: DateMemoryComment[];
};

export type DateMemoryComment = {
  id: string;
  content: string;
  author: string;
  dateMemoryId: string;
  createdAt: Date;
};