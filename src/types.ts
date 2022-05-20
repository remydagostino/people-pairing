export type PersonName = string;

export type Person = {
  name: PersonName;
  preferences: Array<PersonName>;
};

export type Pair = [PersonName, PersonName];

export type SolutionCandidate = {
  unpairedPeople: Array<Person>;
  pairs: Array<Pair>;
};

export type Meeting = {
  date: Date;
  activePerson: PersonName;
  passivePerson: PersonName;
};

export type Participants = Array<string>;

export type MeetingHistory = Array<Meeting>;

export interface PreferenceRecord {
  student_prefs: { [key: string]: string[] }[]
};

export interface TripleAssignment {
  matching: [ string, string, string][],
  reason?: string,
  unmatched?: string[]
};

export interface Assignment {
  matching: [ string, string ][],
  reason?: string,
  unmatched?: string[]
};

export interface ProposerState {
  name: string,
  acceptedProposal?: string,
  preferences: string[]
}