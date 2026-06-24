import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
p.song.findMany({ take: 5, orderBy: { createdAt: "desc" } }).then((r) => {
  r.forEach((s) => console.log(s.title, "->", s.thumbnail ? "HAS thumbnail" : "NO thumbnail"));
  p.$disconnect();
});
