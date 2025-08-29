const convertToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  return hours * 3600 + minutes * 60 + seconds;
};

export const getSecondsDurationFromTimeRange = (
  timeFrom: string | undefined,
  timeTo: string | undefined
): number | undefined => {
  if (timeFrom && timeTo) {
    const secondsFrom = convertToSeconds(timeFrom);
    const secondsTo = convertToSeconds(timeTo);

    const durationInSeconds =
      secondsTo >= secondsFrom
        ? secondsTo - secondsFrom
        : 24 * 3600 - secondsFrom + secondsTo;

    return durationInSeconds;
  } else {
    return undefined;
  }
};
