import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const songs = [
  { artist: "Adie", title: "Tahanan", url: "https://www.youtube.com/watch?v=51Jn7_lW58o", note: "ikaw yung pahinga ko sa lahat ng gulo" },
  { artist: "Adie", title: "Paraluman", url: "https://www.youtube.com/watch?v=1ozScYqgUgw", note: "parang ang dali mong mahalin kahit tahimik lang" },
  { artist: "Adie", title: "Mahika (feat. Janine Berdin)", url: "https://www.youtube.com/watch?v=9tLglpFAyIg", note: "parang normal na araw nagiging special pag ikaw kasama" },
  { artist: "Arthur Nery", title: "Isa Lang", url: "https://www.youtube.com/watch?v=0dFz10aQ1W8", note: "isa ka lang, walang replacement" },
  { artist: "Arthur Nery", title: "Binhi", url: "https://www.youtube.com/watch?v=flAn0JJTjSI", note: "unti-unti pero sure, ikaw pa rin" },
  { artist: "Arthur Nery", title: "Happy With You", url: "https://www.youtube.com/watch?v=eNwXKop9F6Y", note: "kapag kasama ka, sobrang simple lang ng saya" },
  { artist: "Ben&Ben", title: "Maybe The Night", url: "https://www.youtube.com/watch?v=hJhVURhdLEg", note: "tahimik pero steady yung pagmamahal" },
  { artist: "Zack Tabudlo", title: "Habang Buhay", url: "https://www.youtube.com/watch?v=-4Utb6jdIvY", note: "ikaw na talaga, habang buhay" },
  { artist: "Zack Tabudlo", title: "Give Me Your Forever", url: "https://www.youtube.com/watch?v=5HZ9qeFjhYk", note: "forever? basta ikaw, game" },
  { artist: "TJ Monterde", title: "Ikaw at Ako", url: "https://www.youtube.com/watch?v=mDaVK3frbSU", note: "tayo lang talaga, sapat na" },
  { artist: "Nobita", title: "Ikaw Lang", url: "https://www.youtube.com/watch?v=rxXsdj7EBm4", note: "ikaw lang talaga, kahit saan" },
  { artist: "Nobita", title: "Unang Sayaw", url: "https://www.youtube.com/watch?v=EPIL1ImD_xU", note: "simple moment pero unforgettable" },
  { artist: "Lola Amour", title: "Fallen", url: "https://www.youtube.com/watch?v=S3wytd6ZbXc", note: "nahulog na lang ako sayo, walang warning" },
  { artist: "Bruno Major", title: "Easily", url: "https://www.youtube.com/watch?v=XTKn5fTBGeQ", note: "ang dali mong mahalin, no explanation needed" },
  { artist: "Bruno Major", title: "Nothing", url: "https://www.youtube.com/watch?v=ucRVDoFkcxc", note: "ikaw lang, wala nang iba" },
  { artist: "Bruno Major", title: "Home", url: "https://www.youtube.com/watch?v=hAqhFagMV_0", note: "home is you, not a place" },
  { artist: "LANY", title: "ILYSB", url: "https://www.youtube.com/watch?v=RPvhItA3lIM", note: "sobrang mahal kita, hindi ko na maitago" },
  { artist: "LANY", title: "Thick And Thin", url: "https://www.youtube.com/watch?v=21EfHJrGPEY", note: "kahit ano mangyari, ikaw pa rin" },
  { artist: "Rex Orange County", title: "Loving Is Easy", url: "https://www.youtube.com/watch?v=39IU7ADaXmQ", note: "parang natural lang mahalin ka" },
  { artist: "Rex Orange County", title: "Best Friend", url: "https://www.youtube.com/watch?v=OqBuXQLR4Y8", note: "best friend + love = ikaw" },
  { artist: "NIKI", title: "Every Summertime", url: "https://www.youtube.com/watch?v=OXtZfPZIex4", note: "summer love na ayaw ko matapos" },
  { artist: "NIKI", title: "I Like U", url: "https://www.youtube.com/watch?v=k0ellsn6cKk", note: "simple lang pero ikaw talaga" },
  { artist: "Lauv", title: "I Like Me Better", url: "https://www.youtube.com/watch?v=a7fzkqLozwA", note: "mas okay ako kapag kasama ka" },
  { artist: "Ed Sheeran", title: "Perfect", url: "https://www.youtube.com/watch?v=cNGjD0VG4R8", note: "parang ikaw talaga yung perfect para sakin" },
  { artist: "Ed Sheeran", title: "Tenerife Sea", url: "https://www.youtube.com/watch?v=2tHes1FQfwU", note: "kalma lang, ikaw lang sapat na" },
  { artist: "Ed Sheeran", title: "Lego House", url: "https://www.youtube.com/watch?v=r9nkYIvl1c0", note: "bubuo ako ng mundo ko para sayo" },
];

async function main() {
  console.log("Seeding AppConfig...");

  const configDefaults = [
    { key: "passcode", value: "022426" },
    { key: "admin_passcode", value: "111805" },
    { key: "daily_verse", value: "You are altogether beautiful, my darling; there is no flaw in you. — Song of Solomon 4:7" },
  ];

  for (const cfg of configDefaults) {
    const existing = await prisma.appConfig.findUnique({ where: { key: cfg.key } });
    if (existing) {
      console.log(`  Skipped: ${cfg.key} (already exists)`);
      continue;
    }
    await prisma.appConfig.create({ data: cfg });
    console.log(`  Added config: ${cfg.key}`);
  }

  console.log("");
  console.log("Seeding songs...");

  for (const song of songs) {
    const existing = await prisma.song.findFirst({
      where: { artist: song.artist, title: song.title },
    });
    if (existing) {
      console.log(`  Skipped: ${song.artist} - ${song.title} (already exists)`);
      continue;
    }
    await prisma.song.create({ data: song });
    console.log(`  Added: ${song.artist} - ${song.title}`);
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
