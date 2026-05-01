import dayjs from "dayjs";

export const useMe = () => {
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((this: any, ...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout>;

    return function (this: any, ...args: Parameters<T>) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const formatDate = (dateStr: string | null): dayjs.Dayjs | null => {
    // Input: "12.02.2005" => Output: dayjs object
    if (!dateStr) return null;

    const [day, month, year] = dateStr.split(".");
    if (!day || !month || !year) return null;

    // Create a dayjs object
    return dayjs(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
  };

  const formatDuration = (date: string) => {
    const formatedDate = formatDate(date);
    if (!formatedDate) return "";

    const start = formatedDate;
    const now = dayjs();
    const diffInDays = now.diff(start, "day");

    const years = Math.floor(diffInDays / 365);
    const months = Math.floor((diffInDays % 365) / 30);
    const days = diffInDays % 30;

    let result = "";
    if (years > 0) result += `${years} yil `;
    if (months > 0) result += `${months} oy `;
    if (days > 0) result += `${days} kun`;

    return result.trim();
  };

  return { debounce, filterOption, formatDate, formatDuration };
};
