import {
  prisma,
} from "@/lib/prisma";


import RoomLayout
from "@/components/layout/RoomLayout";


import ComfortRoom
from "@/components/comfort/ComfortRoom";



export default async function WhenYouNeedMePage()
:Promise<React.JSX.Element>{


const messages =
await prisma.comfortMessage.findMany({

orderBy:{
createdAt:
"desc"
}

});



return (

<RoomLayout

eyebrow="A safe place"

title="Living Room"

description="
A quiet room whenever your heart needs
a little reminder that you are loved.
"

>


<ComfortRoom

messages={
messages.map(
message=>({

id:
message.id,

category:
message.category,

title:
message.title,

content:
message.content,

})
)
}

/>


</RoomLayout>

);

}