#!/usr/bin/env python3

import csv

# read tsv file
def read_tsv(file_path):
    with open(file_path, 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter='\t')
        return [row for row in reader]

# for sorting
def sort_by_numeric_id(table):
    return sorted(table, key=lambda x: int(x["ID"][2:]))

table1 = read_tsv('v20231129_db02.tsv')
table2 = read_tsv('v20231129_db02_up_getfamily.tsv')
table3 = read_tsv('v20231129_db02_up_getorder.tsv')
table4 = read_tsv('v20231129_db02_up_getseq.tsv')
table5 = read_tsv('v20231129_db02_ncbiprot_getfamily.tsv')
table6 = read_tsv('v20231129_db02_ncbiprot_getorder.tsv')
table7 = read_tsv('v20231129_db02_ncbiprot_seq.tsv')

# combine data from up and ncbiprot
taxonomy_1 = table2 + table5
taxonomy_2 = table3 + table6
seq = table4 + table7

# join taxonomy_1 and taxonomy_2
taxonomy = []
for row1 in taxonomy_1:
    maching_rows = [row2 for row2 in taxonomy_2 if row2["ID"] == row1["ID"]]
    for maching_row in maching_rows:
        taxonomy.append({**row1, **maching_row})

# join taxonomy and seq
addinfo = []
for row1 in taxonomy:
    maching_rows = [row2 for row2 in seq if row2["ID"] == row1["ID"]]
    for maching_row in maching_rows:
        addinfo.append({**row1, **maching_row})

# join addinfo and db02
db03 = []
for row1 in table1:
    maching_rows = [row2 for row2 in addinfo if row2["ID"] == row1["ID"]]
    for maching_row in maching_rows:
        db03.append({**row1, **maching_row})

# export
output_file_path = 'v20231129_db03.tsv'
header = db03[0].keys() if db03 else []

with open(output_file_path, 'w', newline='', encoding='utf-8') as output_file:
    writer = csv.DictWriter(output_file, fieldnames=header, delimiter='\t')

    # write header
    writer.writeheader()

    # write result
    writer.writerows(db03)