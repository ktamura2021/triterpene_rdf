async function fetchDatabySPARQL(value) {
  const endpointUrl = 'https://spang.dbcls.jp/sparql';
  const sparqlQuery = `
PREFIX up: <http://purl.uniprot.org/uniprot/>
PREFIX pubmed: <https://pubmed.ncbi.nlm.nih.gov/>
PREFIX : <https://raw.githubusercontent.com/ktamura2021/triterpenoid_rdf/main/ontology.ttl#>

SELECT ?type ?name ?pathway ?function ?uniprot ?pubmed
WHERE {
  VALUES (?type) { ("${value}") }
  ?s  :type ?type ;
      :name ?name ;
      :pathway ?pathway ;
      :function ?function ;
      :uniprot ?uniprot ;
      :pubmed ?pubmed .
}   
`;

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/sparql-results+json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `query=${encodeURIComponent(sparqlQuery)}`
    });
    if (!response.ok) {
      // response.ok === true if the status code is 2xx
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Could not fetch data: ${error}`);
  }
}
