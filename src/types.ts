export type PersonName = string;

export type Person = {
  name: PersonName
  preferences: Array<PersonName>
}

export type Pair = [PersonName, PersonName];

export type SolutionCandidate = {
  unpairedPeople: Array<Person>
  pairs: Array<Pair>
}

export type Meeting = {
  date: Date,
  activePerson: PersonName,
  passivePerson: PersonName
}

export type Participants = Array<string>;

export type MeetingHistory = Array<Meeting>;
