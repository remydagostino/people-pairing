import { pairPeople } from './matcher';
import {
  MeetingHistory,
  Pair,
  Participants,
  Person,
  PersonName
} from './types';

type PersonHistory = {
  name: PersonName;
  meetings: Map<PersonName, Array<{ on: Date; instigator: boolean }>>;
};

type PersonPreference = {
  name: PersonName;
  count: number;
  score: number;
};

type PersonStats = {
  name: PersonName;
  totalMeetings: number;
  instigationRatio: number;
  preferences: Array<PersonPreference>;
};

type RosterStats = Map<PersonName, PersonStats>;

export function doPairing(
  participants: Participants,
  history: MeetingHistory
): Array<Pair> | null {
  const rosterStats = generateRosterStats(participants, history);
  const pairs = getBestFitPairs(rosterStats);

  // Order the pairs by instigation count
  const orderedPairs = pairs.map((pair) => {
    return pair.sort((a, b) => {
      return (
        rosterStats.get(a).instigationRatio -
        rosterStats.get(b).instigationRatio
      );
    });
  });

  return orderedPairs;
}

export function generateRosterStats(
  participants: Participants,
  history: MeetingHistory
): RosterStats {
  const now = Date.now(); // <- TODO fix this

  const peopleHistory = generatePeopleHistory(history);

  return new Map(
    participants.map((person) => {
      const stats = getHistoryWithDefault(peopleHistory, person);

      return [
        person,
        {
          name: person,
          totalMeetings: stats.meetings.size,
          instigationRatio: getInstigationRatio(stats),
          preferences: getPreferences(stats, participants, now)
        }
      ];
    })
  );
}

function getBestFitPairs(rosterStats: RosterStats): Array<Pair> | null {
  const peoplePreferences = generatePeoplePreferences(rosterStats);
  const solution = pairPeople(peoplePreferences);

  return solution;
}

function generatePeoplePreferences(
  peopleStats: Map<PersonName, PersonStats>
): Array<Person> {
  return Array.from(peopleStats.values()).map((personStats) => {
    return {
      name: personStats.name,
      preferences: getAllTopPreferences(personStats.preferences)
    };
  });
}

function getAllTopPreferences(
  preferences: Array<PersonPreference>
): Array<PersonName> {
  return generatePreferenceHistogram(preferences).reduce((acc, group) => {
    return acc.concat(group.names);
  }, []);
}

function generatePreferenceHistogram(
  preferences: Array<PersonPreference>
): Array<{ score: number; names: Array<PersonName> }> {
  return preferences.reduce(
    (acc, pref) => {
      // Add to an existing group
      if (acc.score === pref.score) {
        const histogramFront = acc.histogram.slice(0, -1);
        const histogramEnd = acc.histogram[acc.histogram.length - 1];

        return {
          histogram: [
            ...histogramFront,
            {
              score: histogramEnd.score,
              names: [...histogramEnd.names, pref.name]
            }
          ],
          score: pref.score
        };
      } else {
        return {
          histogram: [
            ...acc.histogram,
            { score: pref.score, names: [pref.name] }
          ],
          score: pref.score
        };
      }
    },
    { histogram: [], score: null }
  ).histogram;
}

function getPreferences(
  stats: PersonHistory,
  people: Array<PersonName>,
  now: number
): Array<PersonPreference> {
  return people
    .filter((person) => person != stats.name)
    .map((person) => {
      const meetings = stats.meetings.get(person) || [];

      return {
        name: person,
        count: meetings.length,
        // A higher score means more time between now and the last meeting
        score: meetings.reduce(
          (acc, meeting) => Math.min(acc, now - meeting.on.getTime()),
          Infinity
        )
      };
    })
    .sort((a, b) => {
      return b.score - a.score;
    });
}

function getInstigationRatio(personStats: PersonHistory): number {
  const meetingStats = Array.from(personStats.meetings.values()).reduce(
    (acc, meetingList) => {
      return {
        total: acc.total + meetingList.length,
        instigations:
          acc.instigations +
          meetingList.reduce(
            (acc2, { instigator }) => acc2 + (instigator ? 1 : 0),
            0
          )
      };
    },
    {
      total: 0,
      instigations: 0
    }
  );

  return meetingStats.instigations / meetingStats.total;
}

function getHistoryWithDefault(
  map: Map<PersonName, PersonHistory>,
  id: PersonName
): PersonHistory {
  return map.has(id) ? map.get(id) : { name: id, meetings: new Map() };
}

function generatePeopleHistory(
  historyPairs: MeetingHistory
): Map<PersonName, PersonHistory> {
  return historyPairs.reduce((acc, { date, activePerson, passivePerson }) => {
    const activePersonStats = getHistoryWithDefault(acc, activePerson);
    const passivePersonStats = getHistoryWithDefault(acc, passivePerson);

    const updatedFrom = Object.assign({}, activePersonStats, {
      meetings: new Map([
        ...Array.from(activePersonStats.meetings),
        [
          passivePerson,
          (activePersonStats.meetings.get(passivePerson) || []).concat({
            on: date,
            instigator: true
          })
        ]
      ])
    });

    const updatedTo = Object.assign({}, passivePersonStats, {
      meetings: new Map([
        ...Array.from(passivePersonStats.meetings),
        [
          activePerson,
          (passivePersonStats.meetings.get(activePerson) || []).concat({
            on: date,
            instigator: false
          })
        ]
      ])
    });

    return new Map([
      ...Array.from(acc),
      [activePerson, updatedFrom],
      [passivePerson, updatedTo]
    ]);
  }, new Map<PersonName, PersonHistory>());
}
