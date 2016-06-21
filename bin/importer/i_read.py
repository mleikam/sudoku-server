#!/usr/bin/python
import re

path = '/home/leikam/webapps/kenken/data/'

def get(fn,start=1,end=10000):
	# look for the given range of puzzles using # n. pattern
	fn = open(path+fn,'r')
	reading = False
	delim = '# %s.'
	i = start
	puzzles = []
	this_puzzle = ''

# could also use this design pattern:
# with open('filename.txt') as f:
	for ln in fn:
		if i>=end: break # if we get to the end index, we are done
		# ln = fn.readline()
		if ln.startswith(delim % i):			
			reading = True # we have reached the begining of our start block
		if ln.startswith(delim % (i+1)):
			# we have found the string identifying our next block so 
			# increment our counter which lets us stop at the END index
			i += 1
			# add whatever we've found for the current puzzle to our return list
			puzzle_parts = parse(this_puzzle)
			puzzles.append(puzzle_parts)
			# blank out the puzzle string so we can build the next one
			this_puzzle = ''
		if reading:
			this_puzzle += ln 


	# ln = fn.readline()
	# while ln!="":
	# 	if i>=end: break # if we get to the end index, we are done
	# 	# ln = fn.readline()
	# 	if ln.startswith(delim % i):			
	# 		reading = True # we have reached the begining of our start block
	# 	if ln.startswith(delim % (i+1)):
	# 		# we have found the string identifying our next block so 
	# 		# increment our counter which lets us stop at the END index
	# 		i += 1
	# 		# add whatever we've found for the current puzzle to our return list
	# 		puzzle_parts = parse(this_puzzle)
	# 		puzzles.append(puzzle_parts)
	# 		# blank out the puzzle string so we can build the next one
	# 		this_puzzle = ''
	# 	if reading:
	# 		this_puzzle += ln 
	# 	ln = fn.readline()

	fn.close
	return puzzles

# parse the text of a puzzle and break it into component parts
def parse(p):
	p = p.strip();
	p = p.replace('#','')	# remove # signs
	pp = p.split("\n") # turn the string into a list

	## pull apart the various pieces
	puzzle_id = pp.pop(0)	# first item
	labels = pp.pop(0)		# now the first item
	difficulty = pp.pop()	# last item
	dn = difficulty.replace(' Difficulty: ','')
	
	half = len(pp)/2
	shapes = pp[0:half]
	answers = pp[half:len(pp)]
	
	# construct a return dictionary
	parsed = {}
	parsed['id'] = puzzle_id
	parsed['size'] = half
	parsed['difficulty'] = dn
	parsed['labels'] = labels
	parsed['shapes'] = "\n".join(shapes)
	parsed['answers'] = "\n".join(answers)
	
	print "parsed %s" % puzzle_id
	return parsed
