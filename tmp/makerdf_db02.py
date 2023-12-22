#!/usr/bin/env python3

file_name = 'v20231129_db02.tsv'

fp = open(file_name.replace('.tsv', '.ttl'), 'w')

fp.write('@prefix up: <http://purl.uniprot.org/uniprot/> .\n')
fp.write('@prefix ncbiprotein: <https://www.ncbi.nlm.nih.gov/protein/> .\n')
fp.write('@prefix pubmed: <https://pubmed.ncbi.nlm.nih.gov/> .\n')
fp.write('@prefix doi: <https://doi.org/> .\n')
fp.write('@prefix : <https://ktamura2021.github.io/triterpene_rdf/ontology.ttl#> .\n')

num = 0
with open(file_name, encoding='utf-8') as f:
    for row in f:
        if num == 0:
            num += 1
            continue
        else:
            fields = row.strip().split('\t')
            fp.write('\n')
            fp.write(f'[]\n') # blank node
            col_blank = 11 - len(fields)
            fields_blank = [''] * col_blank
            fields = fields + fields_blank

            fp.write(f'    :ID "{fields[0]}" ;\n')
            fp.write(f'    :type "{fields[1]}" ;\n')
            fp.write(f'    :name "{fields[2]}" ;\n')
            fp.write(f'    :pathway "{fields[3]}" ;\n')
            fp.write(f'    :scaffold "{fields[4]}" ;\n')
            fp.write(f'    :function "{fields[5]}" ;\n')
            fp.write(f'    :uniprot up:{fields[6]} ;\n')
            fp.write(f'    :ncbiprotein ncbiprotein:{fields[7]} ;\n')
            pubmed = fields[8].strip().split(',')
            for pm in pubmed:
                fp.write(f'    :pubmed pubmed:{pm} ;\n')
            fp.write(f'    :doi {fields[9]} ;\n')
            fp.write(f'    :note "{fields[10]}" .\n')
            num += 1


fp.close()

