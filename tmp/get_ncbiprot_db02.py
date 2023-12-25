#!/usr/bin/env python3

import csv
import time
import requests
import json

# input_file_path = 'v20231129_db02.tsv' # v20231129
# output_file_path_1 = 'v20231129_db02_ncbiprot_taxid.tsv' # v20231129
# output_file_path_2 = 'v20231129_db02_ncbiprot_seq.tsv' # v20231129
ver = 'v20231224'
input_file_path = ver + '_db02.tsv'
output_file_path_1 = ver + '_db02_ncbiprot_taxid.tsv'
output_file_path_2 = ver + '_db02_ncbiprot_seq.tsv'

rows = []
with open(input_file_path, 'r', newline='', encoding='utf-8') as input_file:
    reader = csv.reader(input_file, delimiter='\t')
    header = next(reader)
    for row in reader:
        rows.append(row)

new_rows_1 = []
new_rows_2 = []

for row in rows:
    ncbi_protein_id = row[7]
    if ncbi_protein_id:
        url = f"http://togows.org/entry/ncbi-protein/{ncbi_protein_id}.json"
        time.sleep(5)
        response = requests.get(url)
        id_taxid = [row[0]]
        id_seq = [row[0]]

        if response.status_code == 200:
            data = response.json()
            taxid = data[0]["features"][0]["db_xref"][0].lstrip("taxon:")
            amino_acid_sequence = data[0]["sequence"].upper()
            id_taxid.append(taxid)
            id_seq.append(amino_acid_sequence)
            print(id_taxid)
            print(id_seq)
            print(ncbi_protein_id)
        else:
            print(f"failed HTTP request")
            row.append('')
    else:
        continue

    new_rows_1.append(id_taxid)
    new_rows_2.append(id_seq)

header_1 = ['ID', 'taxid']
header_2 = ['ID', 'aa_sequence']

# output in new file (1)
with open(output_file_path_1, 'w', newline='', encoding='utf-8') as output_file:
    writer = csv.writer(output_file, delimiter='\t')

    writer.writerow(header_1)
    writer.writerows(new_rows_1)

print(f"output_1 complete")

# output in new file (2)
with open(output_file_path_2, 'w', newline='', encoding='utf-8') as output_file:
    writer = csv.writer(output_file, delimiter='\t')

    writer.writerow(header_2)
    writer.writerows(new_rows_2)

print(f"output_2 complete")