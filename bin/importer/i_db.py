#!/usr/bin/python

# flat file parser in python
import MySQLdb

# connect
db = MySQLdb.connect(host="localhost", user="leikam_kenken", passwd="2)8Mb,(bST-cY3HZ",db="leikam_kenken")

cursor = db.cursor()

cur = db.cursor()



def insert(puzzles):
	inc = 10 		# increment by which we batch insertions
	cur = db.cursor()
	sql = "INSERT INTO puzzle (width,height,difficulty,labels,shapes,answers) VALUES (%s,%s,%s,%s,%s,%s)"
	lenp = len(puzzles)
	# for i=0;i<len(puzzles);i+=inc:
	for i in range(0, lenp, inc ):
		multi = []
		if i+inc > lenp:
			j = lenp-1
		else:
			j = i+inc
		print "iterating i=%s; j=%s; lenp=%s" % (i,j,lenp)
		for p in puzzles[i:j]:
			args = (p['size'],p['size'],p['difficulty'],p['labels'],p['shapes'],p['answers'])
			multi.append(args)
		cur.executemany(sql,multi)
		print "inserted batch of %s from %d\n" % (inc,i)

	return True

def close():
	db.close()