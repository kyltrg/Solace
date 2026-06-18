import type {
  DateMemory,
} from "@/types/date-memory";

import DateCard
from "./DateCard";

type DatesTimelineProps = {
  memories: DateMemory[];
};

export default function DatesTimeline({
  memories,
}: DatesTimelineProps):
React.JSX.Element {
  return (
    <div className="space-y-8">
      {memories.map(
        (memory) => (
          <DateCard
            key={memory.id}
            memory={memory}
          />
        )
      )}
    </div>
  );
}