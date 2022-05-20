import { solve } from './solver';

describe('solver', () => {
  it('works for the wikipedia example https://en.wikipedia.org/wiki/Stable_roommates_problem#Example', () => {
    const result = solve({
      student_prefs: [
        {
          '1': ['3', '4', '2', '6', '5'],
          '2': ['6', '5', '4', '1', '3'],
          '3': ['2', '4', '5', '1', '6'],
          '4': ['5', '2', '3', '6', '1'],
          '5': ['3', '1', '2', '4', '6'],
          '6': ['5', '1', '3', '4', '2']
        }
      ]
    });

    expect(result).toEqual({
      matching: [
        ['1', '6'],
        ['2', '4'],
        ['3', '5']
      ]
    });
  });
});
