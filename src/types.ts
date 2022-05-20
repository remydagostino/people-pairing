export type PersonName = string;

export type Person = {
  name: PersonName;
  preferences: Array<PersonName>;
};

export type Pair = [PersonName, PersonName];

export type PersonStates = {
  acceptedProposalFrom?: PersonName;
  preferences: PersonName[];
};

export type PeopleStates = {
  [key: PersonName]: PersonStates;
};

export type Loop = Array<Pair>;

export type Meeting = {
  date: Date;
  activePerson: PersonName;
  passivePerson: PersonName;
};

export type Participants = Array<string>;

export type MeetingHistory = Array<Meeting>;

export type Solution = Array<Pair>;
