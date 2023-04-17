import { Participants, MeetingHistory, Meeting } from './types';

export function parsePeople(lines: Array<string>): Participants {
  return Array.from(new Set(removeComments(removeBlankLines(lines.map(name => name.trim())))));
}

export function parseHistory(lines: Array<string>): MeetingHistory {
  return removeComments(removeBlankLines(lines)).map(parseHistoryLine);
}

function parseHistoryLine(line: string, index: number): Meeting {
  const matcher = /^(\d{4})-(\d{2})-(\d{2})\s(.*?)\s->\s(.*?)$/;

  const result = line.match(matcher);

  if (result) {
    const year = Number(result[1]);
    const monthIndex = Number(result[2]) - 1;
    const day = Number(result[3]);

    return {
      date: new Date(year, monthIndex, day),
      activePerson: result[4],
      passivePerson: result[5]
    };
  } else {
    throw new Error(`Could not parse history line (${index}): ${line}`);
  }
}

function removeBlankLines(lineList: Array<string>): Array<string> {
  return lineList.filter((line) => line.trim().length > 0);
}

function removeComments(lines: Array<string>): Array<string> {
  return lines.filter((line) => line.substring(0, 1) !== '#');
}
