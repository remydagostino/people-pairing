import { parsePeople, parseHistory } from './parser';

describe('parser', () => {
  describe('parsePeople', () => {
    it('removes blank lines', () => {
      const peopleNames = parsePeople(['  ', '', '\n']);

      expect(peopleNames).toEqual([]);
    });

    it('removes comments', () => {
      const peopleNames = parsePeople(['Aye Bee', '# Cee Dee', 'Eee Eff']);

      expect(peopleNames).toEqual(['Aye Bee', 'Eee Eff']);
    });

    it('removes duplicates', () => {
      const peopleNames = parsePeople(['Aye Bee', 'Cee Dee', 'Aye Bee']);

      expect(peopleNames).toEqual(['Aye Bee', 'Cee Dee']);
    });

    it('trims people names', () => {
      const peopleNames = parsePeople(['foo  ', 'fizz']);

      expect(peopleNames).toEqual(['foo', 'fizz']);
    });
  });

  describe('parseHistory', () => {
    it('removes blank lines', () => {
      const peopleNames = parseHistory(['  ', '', '\n']);

      expect(peopleNames).toEqual([]);
    });

    it('extracts history items', () => {
      const peopleNames = parseHistory(['2020-01-01 Aye Bee -> Cee Dee']);

      expect(peopleNames).toEqual([
        {
          date: new Date(2020, 0, 1),
          activePerson: 'Aye Bee',
          passivePerson: 'Cee Dee'
        }
      ]);
    });
  });
});
