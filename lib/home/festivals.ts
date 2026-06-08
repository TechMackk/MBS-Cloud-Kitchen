/**
 * Config-driven festival banners for the homepage.
 * Date ranges are evaluated at runtime — no hardcoded "today" checks in components.
 */

export type FestivalConfig = {
  id: string;
  name: string;
  /** Inclusive start (month 1–12, day 1–31) */
  startMonth: number;
  startDay: number;
  /** Inclusive end (month 1–12, day 1–31) */
  endMonth: number;
  endDay: number;
  headline: string;
  message: string;
  ctaLabel: string;
  ctaHref: string;
};

export const FESTIVALS: FestivalConfig[] = [
  {
    id: "bonalu",
    name: "Bonalu",
    startMonth: 7,
    startDay: 1,
    endMonth: 7,
    endDay: 31,
    headline: "Celebrate Bonalu with MBS",
    message: "Traditional Telangana flavours for your festival table.",
    ctaLabel: "Explore Festival Menu",
    ctaHref: "/menu",
  },
  {
    id: "sankranti",
    name: "Sankranti",
    startMonth: 1,
    startDay: 10,
    endMonth: 1,
    endDay: 20,
    headline: "Happy Sankranti from MBS",
    message: "Harvest-season specials made fresh for your family.",
    ctaLabel: "Order Now",
    ctaHref: "/menu",
  },
  {
    id: "ugadi",
    name: "Ugadi",
    startMonth: 3,
    startDay: 20,
    endMonth: 4,
    endDay: 5,
    headline: "Ugadi Specials",
    message: "Welcome the Telugu New Year with authentic home-style meals.",
    ctaLabel: "View Menu",
    ctaHref: "/menu",
  },
  {
    id: "diwali",
    name: "Diwali",
    startMonth: 10,
    startDay: 20,
    endMonth: 11,
    endDay: 5,
    headline: "Diwali Feast by MBS",
    message: "Light up your celebrations with premium Telangana dishes.",
    ctaLabel: "Catering Enquiry",
    ctaHref: "/catering",
  },
];

function festivalDayValue(month: number, day: number): number {
  return month * 100 + day;
}

function isDateInRange(
  month: number,
  day: number,
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number,
): boolean {
  const current = festivalDayValue(month, day);
  const start = festivalDayValue(startMonth, startDay);
  const end = festivalDayValue(endMonth, endDay);

  if (start <= end) {
    return current >= start && current <= end;
  }

  // Range spans year boundary (e.g. Dec → Jan)
  return current >= start || current <= end;
}

/**
 * Returns the first active festival for the given date, or null if none match.
 */
export function getActiveFestival(
  date: Date = new Date(),
): FestivalConfig | null {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return (
    FESTIVALS.find((festival) =>
      isDateInRange(
        month,
        day,
        festival.startMonth,
        festival.startDay,
        festival.endMonth,
        festival.endDay,
      ),
    ) ?? null
  );
}
