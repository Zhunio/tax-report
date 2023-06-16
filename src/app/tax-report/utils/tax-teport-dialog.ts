export function getDefaultStartDate(): number {
  return new Date().getFullYear() - 5;
}

export function getDefaultEndDate(): number {
  return new Date().getFullYear() + 5;
}

export function getFiscalQuarters(): [1, 2, 3, 4] {
  return [1, 2, 3, 4];
}

export function getFiscalYears(startYear: number, endYear: number) {
  const years = [];

  if (startYear > endYear) {
    throw new Error(`${startYear} is after ${endYear}`);
  }

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
}

export function isValidFileExtension(file: File): boolean {
  return file.name.includes('xlsx');
}
