import { prisma } from "@/lib/prisma";

import RoomLayout
from "@/components/layout/RoomLayout";

import LetterArchive
from "@/components/letters/LetterArchive";



export default async function LettersPage()
{


const letters =
await prisma.letter.findMany({

orderBy:{
createdAt:"desc"
}

});




return (

<RoomLayout

eyebrow="Study Room"

title="Letters"

description="
Words we wrote when we couldn't say it out loud.
"

>


<LetterArchive

letters={
letters.map(letter=>({

id:letter.id,

title:letter.title,

preview:letter.preview,

category:letter.category,

createdAt:
letter.createdAt.toISOString()

}))

}

/>


</RoomLayout>

);


}