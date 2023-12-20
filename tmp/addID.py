#!/usr/bin/env python3

fp = open('v20231129_db02.tsv', 'w')

num = 0
with open('v20231129_db01.tsv', encoding='utf-8') as f:
    for row in f:
        if num == 0:
            fields = row.split('\t')
            field_list = '\t'.join(map(str, fields))
            fp.write(f'ID\t{field_list}')
            num += 1
            continue
        else:
            fields = row.split('\t')
            entry_id = f'TP{num:04}'
            field_list = '\t'.join(map(str, fields))
            fp.write(f'{entry_id}\t{field_list}')
            num += 1

fp.close()