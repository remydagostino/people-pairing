import { readFileSync } from 'fs';
import * as process from 'process';
import { parsePeople, parseHistory } from './parser';
import { MeetingHistory, Pair, Participants } from './types';
import * as Analysis from './analysis';


function main(peopleFileName, historyFileName, command) {
  const peopleFileContents = readFileSync(peopleFileName).toString();
  const historyFileContents = readFileSync(historyFileName).toString();

  const participants = parsePeople(peopleFileContents.split('\n'));
  const history = parseHistory(historyFileContents.split('\n'));

  switch (command) {
    case 'stats':
      return doStats(participants, history);
    case 'pairing':
      return doPairing(participants, history);
  }
}

function doStats(participants, history) {
  const rosterStats = Analysis.generatePeopleStats(participants, history);
  const sortedStats = Array.from(rosterStats.values()).sort((a, b) => {
    return a.name > b.name ? 1 : -1;
  });

  for (const person of sortedStats) {
    console.log({
      name: person.name,
      instigationRatio: person.instigationRatio,
      preferences: person.preferences.map(
        ({ name, score, count }) => `${score} (${count}): ${name}`
      )
    });
  }
}

function doPairing(participants: Participants, history: MeetingHistory) {
  const pairs = Analysis.doPairing(participants, history);

  if (pairs !== null) {
    outputPairs(pairs, generateDateTimestamp(Date.now()));  
  }
}

function outputPairs(pairs: Array<Pair>, prefix: string) {
  pairs.forEach((pair) => {
    process.stdout.write([prefix, `${pair[0]} -> ${pair[1]}\n`].filter(Boolean).join(' '));
  });
}

function generateDateTimestamp(time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = ('00' + (date.getMonth() + 1)).slice(-2);
  const day = ('00' + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
}

main(process.argv[2], process.argv[3], process.argv[4] || 'pairing');