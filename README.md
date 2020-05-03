# sudoku backend 

## Compile the generator:

`gcc -O3 -Wall -o sugen sugen.c`

This is the pipeline to give us the prompt and solution
`./sugen -a generate > puzzle && cat puzzle | ./sugen -x print; cat puzzle | ./sugen solve`

## set the path

Edit the .env file to provide the generator path

## Start the server

`npm run start`

Outputs JSON at the configured port.

Read more on async middleware
https://github.com/geoffdavis92/express-async-await-middleware/blob/master/index.js

## @todo

* Generation error handling
* representing errors on API
* difficulty targeting
* rework the sugen pipeline to avoid the puzzle temp file
* tests
* specify CORS domains via env

