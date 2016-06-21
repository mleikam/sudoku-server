#!/usr/bin/python


# flat file parser in python
import MySQLdb

# connect
db = MySQLdb.connect(host="localhost", user="leikam_kenken", passwd="2)8Mb,(bST-cY3HZ",
db="leikam_kenken")

cursor = db.cursor()

# execute SQL select statement
# you must create a Cursor object. It will let
#  you execute all the queries you need
cur = db.cursor()

# Use all the SQL you like
cur.execute("SELECT * FROM puzzle")

# print all the first cell of all the rows
for row in cur.fetchall():
    print row[0]

db.close()