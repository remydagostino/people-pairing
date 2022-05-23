import {
  Loop,
  Pair,
  PeopleStates,
  Person,
  PersonName,
  PersonStates,
  Solution
} from './types';

// Implementation of https://en.wikipedia.org/wiki/Stable_roommates_problem
export const pairPeople = (people: Person[]): Solution => {
  ensureEven(people);

  const states = buildInitialStates(people);

  phase1(states);

  cleanWorsePreferences(states);
  cleanAcceptedProposals(states);

  phase2(states);

  const valid = verifySolution(states);
  if (!valid) {
    return null;
  }

  const result = extractMatches(states);
  return fixOddDoppelganger(result);
};

const ensureEven = (people: Person[]) => {
  if (people.length % 2 == 1) {
    const copyName = `${people[0].name} (doppelganger)`;
    people.slice(1).forEach((person) => person.preferences.unshift(copyName));
    people.push({
      name: copyName,
      preferences: people[0].preferences
    });
  }
};

const buildInitialStates = (people: Person[]): PeopleStates => {
  return people.reduce((acc, person) => {
    acc[person.name] = {
      preferences: person.preferences
    };

    return acc;
  }, {});
};

const phase1 = (states: PeopleStates) => {
  const proposers = Object.keys(states);

  while (proposers.length > 0) {
    const proposer = proposers[0];
    const bestMatch = states[proposer].preferences[0];

    if (bestMatch === undefined) {
      console.log(
        `everyone rejected ${proposer} and they don't have any more preferences, failed to find a matching`
      );
      return null;
    }

    console.log(`${proposer} proposes to ${bestMatch}`);
    if (betterThanCurrentProposal(states[bestMatch], proposer)) {
      console.log(`${bestMatch} accepts ${proposer}'s proposal`);

      const previousProposal = states[bestMatch].acceptedProposalFrom;

      proposers.shift();

      if (previousProposal) {
        console.log(
          `${bestMatch} retrospectively rejects ${previousProposal}'s proposal`
        );

        removeMutuallyFromPreference(states, previousProposal, bestMatch);

        // previousProposal got retrospectively rejected and will now need to propose to someone else
        proposers.unshift(previousProposal);
      }

      states[bestMatch].acceptedProposalFrom = proposer;
    } else {
      // proposer's bestMatch has already accepted a better proposal than proposer

      console.log(`${bestMatch} rejects ${proposer}'s proposal`);
      removeMutuallyFromPreference(states, proposer, bestMatch);
    }
  }
};

const cleanWorsePreferences = (states: PeopleStates) => {
  Object.keys(states).forEach((person) => {
    const state = states[person];

    const proposer = state.acceptedProposalFrom;
    const proposerIndex = state.preferences.indexOf(proposer);

    console.log(
      `${person}'s best proposal was from ${proposer}, removing less prefered people from their preferences`
    );

    state.preferences
      .slice(proposerIndex + 1)
      .forEach((p) => removeMutuallyFromPreference(states, person, p));
  });
};

const cleanAcceptedProposals = (states: PeopleStates) => {
  Object.keys(states).forEach((person) => {
    states[person].acceptedProposalFrom = undefined;
  });
};

const phase2 = (states: PeopleStates) => {
  while (true) {
    const loop = findLoop(states);
    if (!loop) {
      console.log(`No loops remaining`);
      return null;
    }

    console.log(`found loop: ${JSON.stringify(loop)}, reducing preferences`);
    loop.forEach((pair) =>
      removeMutuallyFromPreference(states, pair[0], pair[1])
    );
  }
};

const findLoop = (states: PeopleStates): Loop => {
  const p = [];
  const q = [null];

  let nextP = Object.keys(states).find(
    (person) => states[person].preferences.length > 1
  );

  if (!nextP) {
    return null;
  }

  let nextQ = null;
  while (true) {
    const index = p.indexOf(nextP);

    p.push(nextP);

    if (index !== -1) {
      const loop = [];
      for (let i = index + 1; i < p.length; i++) {
        loop.push([p[i], q[i]]);
      }

      return loop;
    }

    nextQ = states[nextP].preferences[1];
    q.push(nextQ);
    nextP = states[nextQ].preferences[states[nextQ].preferences.length - 1];

    // console.log(`p = ${p}; q = ${q}; nextP = ${nextP}`);
  }
};

const betterThanCurrentProposal = (
  state: PersonStates,
  proposer: PersonName
): boolean => {
  // any proposal is better than no proposal
  if (state.acceptedProposalFrom === undefined) return true;

  // the new proposal is better if it's higher on the person preference list
  const currentProposalIndex = state.preferences.indexOf(
    state.acceptedProposalFrom
  );
  const newProposalIndex = state.preferences.indexOf(proposer);

  return newProposalIndex < currentProposalIndex;
};

const removeMutuallyFromPreference = (
  states: PeopleStates,
  person1: PersonName,
  person2: PersonName
): void => {
  states[person1].preferences = states[person1].preferences.filter(
    (pref) => pref != person2
  );
  states[person2].preferences = states[person2].preferences.filter(
    (pref) => pref != person1
  );
};

const verifySolution = (states: PeopleStates): boolean => {
  let valid = true;
  Object.keys(states).forEach((person) => {
    if (states[person].preferences.length !== 1) {
      valid = false;
      console.log(
        `invalid final preference: ${person} - ${states[person].preferences}`
      );
    }
  });
  return valid;
};

const extractMatches = (states: PeopleStates): Solution => {
  const result = [];
  let unMatched = Object.keys(states);
  while (unMatched.length > 0) {
    const current = unMatched[0];

    const match = states[current].preferences[0];

    result.push([current, match].sort());
    unMatched = unMatched.filter((p) => p !== current && p !== match);
  }
  return result;
};

const fixOddDoppelganger = (result: Solution): Solution => {
  return result.map(
    (pair) => pair.map((p) => p.replace(' (doppelganger)', '')) as Pair
  );
};
