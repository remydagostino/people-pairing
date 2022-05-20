import { pairPeople } from './matcher';

describe('matcher', () => {
  it('wont pair one person', () => {
    const personA = { name: 'A', preferences: [] };
    const result = pairPeople([personA]);
    expect(result).toBe(null);
  });

  it('pairs two people', () => {
    const personA = { name: 'A', preferences: ['B'] };
    const personB = { name: 'B', preferences: ['A'] };
    const result = pairPeople([personA, personB]);
    expect(result).toEqual([['A', 'B']]);
  });

  it('pairs three people (doubling the first)', () => {
    const personA = { name: 'A', preferences: ['B', 'C'] };
    const personB = { name: 'B', preferences: ['C', 'A'] };
    const personC = { name: 'C', preferences: ['A', 'B'] };

    const result = pairPeople([personA, personB, personC]);
    expect(result).toEqual([
      ['A', 'C'],
      ['A', 'B']
    ]);
  });

  it('pairs four perfect people', () => {
    const personA = { name: 'A', preferences: ['B', 'C', 'D'] };
    const personB = { name: 'B', preferences: ['C', 'A', 'D'] };
    const personC = { name: 'C', preferences: ['D', 'A', 'B'] };
    const personD = { name: 'D', preferences: ['A', 'B', 'C'] };
    const result = pairPeople([personA, personB, personC, personD]);
    expect(result).toEqual([
      ['A', 'B'],
      ['C', 'D']
    ]);
  });

  it('pairs four backwards people', () => {
    const personA = { name: 'A', preferences: ['D'] };
    const personB = { name: 'B', preferences: ['C'] };
    const personC = { name: 'C', preferences: ['B'] };
    const personD = { name: 'D', preferences: ['A'] };
    const result = pairPeople([personA, personB, personC, personD]);
    expect(result).toEqual([
      ['A', 'D'],
      ['B', 'C']
    ]);
  });

  it('fails to pair four people who are all obsessed with D', () => {
    const personA = { name: 'A', preferences: ['D'] };
    const personB = { name: 'B', preferences: ['D'] };
    const personC = { name: 'C', preferences: ['D'] };
    const personD = { name: 'D', preferences: ['A'] };
    const result = pairPeople([personA, personB, personC, personD]);
    expect(result).toBe(null);
  });

  it('pairs four people mildly obsessed with D', () => {
    const personA = { name: 'A', preferences: ['D', 'B', 'C'] };
    const personB = { name: 'B', preferences: ['D', 'C', 'A'] };
    const personC = { name: 'C', preferences: ['D', 'A', 'B'] };
    const personD = { name: 'D', preferences: ['A', 'B', 'C'] };
    const result = pairPeople([personA, personB, personC, personD]);
    expect(result).toEqual([
      ['A', 'D'],
      ['B', 'C']
    ]);
  });

  it('pairs four people with unbalanced preferences', () => {
    const personA = { name: 'A', preferences: ['D', 'C', 'B'] };
    const personB = { name: 'B', preferences: ['D', 'A', 'C'] };
    const personC = { name: 'C', preferences: ['D', 'B', 'A'] };
    const personD = { name: 'D', preferences: ['A', 'C', 'B'] };
    const result = pairPeople([personA, personB, personC, personD]);
    expect(result).toEqual([
      ['A', 'D'],
      ['B', 'C']
    ]);
  });

  it('works for the wikipedia example https://en.wikipedia.org/wiki/Stable_roommates_problem#Example', () => {
    const person1 = { name: '1', preferences: ['3', '4', '2', '6', '5'] };
    const person2 = { name: '2', preferences: ['6', '5', '4', '1', '3'] };
    const person3 = { name: '3', preferences: ['2', '4', '5', '1', '6'] };
    const person4 = { name: '4', preferences: ['5', '2', '3', '6', '1'] };
    const person5 = { name: '5', preferences: ['3', '1', '2', '4', '6'] };
    const person6 = { name: '6', preferences: ['5', '1', '3', '4', '2'] };
    const result = pairPeople([
      person1,
      person2,
      person3,
      person4,
      person5,
      person6
    ]);
    expect(result).toEqual([
      ['1', '6'],
      ['2', '4'],
      ['3', '5']
    ]);
  });
});
