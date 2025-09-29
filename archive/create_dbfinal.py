#!/usr/bin/env python3

import csv

# read tsv file
def read_tsv(file_path):
    with open(file_path, 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter='\t')
        return [row for row in reader]

table1 = read_tsv('v20231129_db03.tsv')
table2 = read_tsv('v20231224_db03.tsv')
table3 = read_tsv('v20240207_db03.tsv')

# table_concat = table1 + table2 # v20231224
table_concat = table1 + table2 + table3

# export
# ver = 'v20231224'
# output_file_path = ver + '_dbfinal.tsv' # v20231224
output_file_path = 'dbfinal.tsv'
header = table_concat[0].keys() if table_concat else []

with open(output_file_path, 'w', newline='', encoding='utf-8') as output_file:
    writer = csv.DictWriter(output_file, fieldnames=header, delimiter='\t')

    # write header
    writer.writeheader()

    # write result
    writer.writerows(table_concat)