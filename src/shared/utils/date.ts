export const isDateObject = (date: any): boolean => date instanceof Date;

export const countDay = (
  dateFrom: string | Date,
  dateTo: string | Date
): number => {
  const from = typeof dateFrom === "string" ? new Date(dateFrom) : dateFrom;
  const to = typeof dateTo === "string" ? new Date(dateTo) : dateTo;

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    throw new Error("Invalid date input");
  }

  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(to.getTime() - from.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1;
};

export const dateInRange = (
  date: Date | string,
  range: { from: Date | string; to: Date | string },
  includeStartDate?: boolean,
  includeEndDate?: boolean
) => {
  const dateObj = new Date(date);
  const startDate = new Date(range?.from);
  const endDate = new Date(range?.to);

  return (
    (includeStartDate ? dateObj >= startDate : dateObj > startDate) &&
    (includeEndDate ? dateObj <= endDate : dateObj < endDate)
  );
};

export const getCalendarRange = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  // get the first date of the target month
  const firstOfMonth = new Date(year, month, 1);
  // get the weekday index (0 = Sunday, 6 = Saturday)
  const startDay = firstOfMonth.getDay();

  // calculate the first visible date in the calendar
  const firstVisible = new Date(firstOfMonth);
  firstVisible.setDate(firstOfMonth.getDate() - startDay);

  // calculate the last visible date (6 rows × 7 days = 42 days)
  const lastVisible = new Date(firstVisible);
  lastVisible.setDate(firstVisible.getDate() + 41);

  return { firstVisible, lastVisible };
};
