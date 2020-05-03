'use strict'

// sudoku middleware

const path = require('path');
const { exec } = require('child_process');

const pathToSugen = path.join(process.env.SUGEN_PATH,'sugen')
const cmd = `${pathToSugen} -a generate > puzzle && cat puzzle | \
  ${pathToSugen} -x print; cat puzzle | \
  ${pathToSugen} solve`;

const extractSolution = raw => raw.match(/[0-9 \n]{81,300}/)[0]
const extractInitial = raw => raw.match(/[0-9\.\n]{81,150}/)[0]
const extractDifficulty = raw => raw.match(/Difficulty: ([0-9]+)/)[1]
const removeWhitespace = s => s.replace(/[\s]/g,'')

const generate = () => {
  return new Promise((resolve,reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      const output = {
        solution: removeWhitespace(extractSolution(stdout)),
        initial: removeWhitespace(extractInitial(stdout)),
        difficulty: parseInt(extractDifficulty(stdout))
      }
      resolve(output)
    });
  });
}

const sudoku = async (req, res, next) => {
  req.data = await generate()
  next();
};

module.exports = sudoku; 