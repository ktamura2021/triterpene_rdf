# triterpenoid_rdf
## 環境構築
1. DockerでVirtuosoを起動
```
docker run --rm \
    --name virtuoso_docker_test \
    --env DBA_PASSWORD=dba \
    --publish 1111:1111 \
    --publish 8890:8890 \
    --volume `pwd`:/database \
    tenforce/virtuoso:1.3.2-virtuoso7.2.0
```
- 参考: http://wiki.lifesciencedb.jp/mw/SPARQLthon75/virtuoso_docker

2. http://localhost:8890 にアクセスし、Conductorにログイン
- Account, Passwordはともに`dba`

3. Interactive SQLを開き、SERVICE句を使えるようにするための設定コマンドを打つ
```
GRANT SELECT ON DB.DBA.SPARQL_SINV_2 TO "SPARQL";
GRANT EXECUTE ON DB.DBA.SPARQL_SINV_IMP TO "SPARQL";
```

4. Conductorに戻り、Linked Data > Quad Store UploadからRDFファイルをアップロードする

5. http://localhost:8890/sparql にアクセスし、Query TextにQueryを入力してExecute Queryで検索実行
- Default Data Set Name (Graph IRI) は空欄のままにする

## リンク集
### Overview diagram
- https://sparql.uniprot.org/uniprot
- https://sparql.uniprot.org/taxonomy

### Hints
- [How to get taxonomic lineage from UniProt with SPARQL](https://www.biostars.org/p/221397/)
