import TransitionLink from "@/components/navigation/TransitionLink";
import React from "react";

type Room = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  icon: React.ReactNode;
};

const ROOMS: Room[] = [
  {
    title: "Living Room",
    subtitle: "Do you need me?",
    href: "/when-you-need-me",
    image: "/assets/rooms/living.png",
    icon: (
      <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
      </svg>
    ),
  },
  {
    title: "Study Room",
    subtitle: "Do you want to read some letters?",
    href: "/letters",
    image: "/assets/rooms/study.jpg",
    icon: (
      <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"/>
      </svg>
    ),
  },
  {
    title: "Kitchen",
    subtitle: "Where we keep the little moments we shared.",
    href: "/dates",
    image: "/assets/rooms/kitchen.png",
    icon: (
      <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13h2c1.1046 0 2 .8954 2 2s-.8954 2-2 2h-2.5M10 3c0 2.4-3 1.6-3 4m8-4c0 2.4-3 1.6-3 4m-7 4 .6398 6.398C5.84428 19.4428 7.56494 21 9.61995 21H10.38c2.0551 0 3.7757-1.5572 3.9802-3.602L15 11H5Z"/>
      </svg>
    ),
  },
  {
    title: "Balcony",
    subtitle: "Sit with me for a while. Let's talk about our dreams.",
    href: "/plans",
    image: "/assets/rooms/balcony.jpg",
    icon: (
      <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth="2" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"/>
      </svg>
    ),
  },
  {
    title: "Music Room",
    subtitle: "The songs that became part of us.",
    href: "/songs",
    image: "/assets/rooms/music.jpg",
    icon: (
      <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 18c0 1.1046-.89543 2-2 2s-2-.8954-2-2 .89543-2 2-2 2 .8954 2 2Zm0 0V6.33333L18 4v11.6667M8 10.3333 18 8m0 8c0 1.1046-.8954 2-2 2s-2-.8954-2-2 .8954-2 2-2 2 .8954 2 2Z"/>
      </svg>
    ),
  },
  {
    title: "Bedroom",
    subtitle: "A quiet place for tonight.",
    href: "/tonight",
    image: "/assets/rooms/bedroom.jpg",
    icon: (
      <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 17v2M12 5.5V10m-6 7v2m15-2v-4c0-1.6569-1.3431-3-3-3H6c-1.65685 0-3 1.3431-3 3v4h18Zm-2-7V8c0-1.65685-1.3431-3-3-3H8C6.34315 5 5 6.34315 5 8v2h14Z"/>
      </svg>
    ),
  },
];

export default function RoomsGrid(): React.JSX.Element {
  return (
    <section id="rooms" className="relative overflow-hidden px-4 sm:px-6 py-20 sm:py-40 scroll-mt-48">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[.3em] text-[var(--accent)]">
          Our home
        </p>

        <h2 className="mt-5 font-display text-4xl sm:text-6xl font-light md:text-8xl">
          Rooms
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {ROOMS.map((room) => (
            <TransitionLink
              key={room.href}
              href={room.href}
              className="group relative min-h-[260px] overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card-bg)] p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[var(--accent)]/40"
            >
              <div className="absolute inset-0 opacity-0 transition-all duration-700 group-hover:opacity-20">
                <img
                  src={room.image}
                  alt=""
                  className="h-full w-full object-cover grayscale blur-[2px] transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)]">
                  {room.icon}
                </div>

                <h3 className="mt-8 font-display text-3xl sm:text-5xl font-light">
                  {room.title}
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
                  {room.subtitle}
                </p>
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
