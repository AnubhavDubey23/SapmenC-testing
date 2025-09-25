export function debounce<T extends any[]>(
  cb: (...args: T) => void,
  wait: number
) {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: T) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = null;
      cb(...args);
    }, wait);
  };
}
