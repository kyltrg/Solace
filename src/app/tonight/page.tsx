import RoomLayout
from "@/components/layout/RoomLayout";


import TonightEntryForm
from "@/components/tonight/TonightEntryForm";


import TonightTimeline
from "@/components/tonight/TonightTimeline";


import { prisma }
from "@/lib/prisma";


import type {
  TonightEntry,
} from "@prisma/client";



export default async function TonightPage():
Promise<React.JSX.Element> {


  const entries: TonightEntry[] =
    await prisma.tonightEntry.findMany({

      orderBy: {
        createdAt: "desc",
      },

      take: 100,

    });



  return (

    <RoomLayout

      eyebrow="Reflection"

      title="Tonight"

      description="
      A quiet place
      before we rest.
      "

    >


      <div
        className="
          space-y-20
        "
      >



        {/* Past reflections first */}

        <TonightTimeline
          entries={entries}
        />




        {/* Divider */}

        <div
          className="
            flex
            items-center
            gap-6
          "
        >

          <div
            className="
              h-px
              flex-1
              bg-[var(--border)]
            "
          />


          <span
            className="
              text-xs
              uppercase
              tracking-[0.25em]
              text-[var(--muted)]/50
            "
          >
            New reflection
          </span>


          <div
            className="
              h-px
              flex-1
              bg-[var(--border)]
            "
          />

        </div>




        <TonightEntryForm />



      </div>


    </RoomLayout>

  );
}