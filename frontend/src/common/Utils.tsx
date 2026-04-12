export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options,
  );
  return formattedDate;
};

export const formatTime = (datetimeString: string) => {
  if (!datetimeString) return;
  const dateObj = new Date(datetimeString);

  // Extract the time part and format it to AM/PM
  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true, // true for AM/PM format
  });

  return time || "";
};
