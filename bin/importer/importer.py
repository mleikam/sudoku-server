#!/usr/bin/python
# importer

import i_db,i_read


fn = '8x8.100'  # filename
fn = '4x4.10000'

## turned off because we have all the data 
print "disabled!"
exit()

puzzles = i_read.get(fn,1,10001)	# read the puzzle from the text file
info = i_db.insert(puzzles)  	# insert them into  the db

i_db.close()
print "done\n"
# print len(puzzle), puzzle
# print info