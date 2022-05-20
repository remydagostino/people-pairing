import { Person, Pair, SolutionCandidate } from './types';

export function pairPeople(people: Array<Person>): Array<Pair> | null {
  const sol = solvePairing({ unpairedPeople: people, pairs: [] }, people);

  return sol === null ? null : sol.pairs;
}

function solvePairing(
  sol: SolutionCandidate,
  allPeople: Array<Person>
): SolutionCandidate | null {
  if (isSolutionInvalid(sol, allPeople)) {
    return null;
  }

  if (isSolutionComplete(sol)) {
    return sol;
  }

  const possibleNextSolutions = extendSolution(sol, allPeople);

  for (const nextSol of possibleNextSolutions) {
    const finalSolution = solvePairing(nextSol, allPeople);

    if (finalSolution !== null) {
      return finalSolution;
    }
  }

  return null;
}

function isSolutionInvalid(
  sol: SolutionCandidate,
  allPeople: Array<Person>
): boolean {
  // Everyone is paired with one of their preferences
  // No more than one person is paired more than once
  const pairCounts: { [k: string]: number } = sol.pairs.reduce(
    (acc, [first, second]) => {
      return {
        ...acc,
        [first]: (acc[first] || 0) + 1,
        [second]: (acc[second] || 0) + 1
      };
    },
    {}
  );

  const sumOfMeetings = Object.values(pairCounts).reduce(
    (acc, numMeetings) => acc + numMeetings,
    0
  );

  return sumOfMeetings > allPeople.length + 1;
}

function isSolutionComplete(sol: SolutionCandidate): boolean {
  // Everyone is paired
  return sol.unpairedPeople.length === 0;
}

function extendSolution(
  sol: SolutionCandidate,
  allPeople: Array<Person>
): Array<SolutionCandidate> {
  // Remove a pair from the unpaired people
  const [head, ...rest] = sol.unpairedPeople;

  // Turn each of their preferences into a solution candidate
  return head.preferences
    .filter((pref) => {
      // Only include preferences that are available
      // ... unless no one is available
      return rest.length > 0
        ? rest.find((person) => person.name === pref) != null
        : true;
    })
    .map((pref) => {
      const prefPerson =
        allPeople.find((person) => person.name === pref) || null;
      const remainingPartners = rest.filter((person) => person.name !== pref);

      return {
        unpairedPeople: remainingPartners,
        pairs: [...sol.pairs, [head.name, prefPerson.name]]
      };
    });
}
