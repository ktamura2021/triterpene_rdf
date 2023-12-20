#!/usr/bin/env python3

import sys
import csv

if len(sys.argv) < 2:
    print("Usase: makefasta_db03.py <file to convert>")
    sys.exit(1)

input_file = sys.argv[1]

# read tsv file
def read_tsv(file_path):
    with open(file_path, 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter='\t')
        return [row for row in reader]

input_table = read_tsv(input_file)

output = []
for row in input_table:
    header = ">" + row['ID'] + " " + row['name'] + " " + row['species']
    seq = row['aa_sequence']
    output.append(header)
    output.append(seq)

# create fasta
output_file = input_file.replace(".tsv", ".fasta")
fp = open(output_file, 'w')

for row in output:
    fp.write(row + '\n')