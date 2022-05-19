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
    const personA = { name: 'A', preferences: ['B'] };
    const personB = { name: 'B', preferences: ['C'] };
    const personC = { name: 'C', preferences: ['A'] };

    const result = pairPeople([personA, personB, personC]);
    
    expect(result).toEqual([['A', 'B'], ['C', 'A']]);
  });

  it('pairs four perfect people', () => {
    const personA = { name: 'A', preferences: ['B'] };
    const personB = { name: 'B', preferences: ['C'] };
    const personC = { name: 'C', preferences: ['D'] };
    const personD = { name: 'D', preferences: ['A'] };

    const result = pairPeople([personA, personB, personC, personD]);
    
    expect(result).toEqual([['A', 'B'], ['C', 'D']]);
  });

  it('pairs four backwards people', () => {
    const personA = { name: 'A', preferences: ['D'] };
    const personB = { name: 'B', preferences: ['C'] };
    const personC = { name: 'C', preferences: ['B'] };
    const personD = { name: 'D', preferences: ['A'] };

    const result = pairPeople([personA, personB, personC, personD]);
    
    expect(result).toEqual([['A', 'D'], ['B', 'C']]);
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
    const personA = { name: 'A', preferences: ['D', 'B'] };
    const personB = { name: 'B', preferences: ['D', 'C'] };
    const personC = { name: 'C', preferences: ['D', 'A'] };
    const personD = { name: 'D', preferences: ['A', 'B'] };

    const result = pairPeople([personA, personB, personC, personD]);
    
    expect(result).toEqual([['A', 'D'], ['B', 'C']]);
  });

  it('pairs four people with unbalanced preferences', () => {
    const personA = { name: 'A', preferences: ['D', 'C'] };
    const personB = { name: 'B', preferences: ['D'] };
    const personC = { name: 'C', preferences: ['D', 'B'] };
    const personD = { name: 'D', preferences: ['A', 'C'] };

    const result = pairPeople([personA, personB, personC, personD]);
    
    expect(result).toEqual([['A', 'C'], ['B', 'D']]);
  });
});