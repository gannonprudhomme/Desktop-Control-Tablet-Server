const commands = require('../routes/commands');

describe('Commands', () => {
  describe('getProcessVolumes', () => {
    test('computes correctly', async () => {
      // arrange
      // TODO: Mock exec so it can run without it

      // act
      const output = await commands.getProcessVolumes();

      // assert
      // console.log(output);
    });

    test('regex stuff', () => {
      // arrange?
      const pid = '10250';
      const programName = 'ProgramName';
      const volume = '100';
      const string = `${pid} "${programName}" ${volume}`;

      const regex = /(?:(?:\s")|(?:"\s))/;

      const expected = [pid, programName, volume];

      // act
      const result = string.split(regex);

      const resultPid = result[0];
      const resultProgramName = result[1];
      const resultVolume = result[2];

      // assert
      expect(resultPid).toEqual(pid);
      expect(resultProgramName).toEqual(programName);
      expect(resultVolume).toEqual(volume);
    });
  });
});