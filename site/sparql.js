async function fetchDatabySPARQL(selectedType, selectedPathway) {
  const endpointUrl = 'https://spang.dbcls.jp/sparql';
  let valuesForType = '';
  if (selectedType) {
    valuesForType = `VALUES (?type) { ("${selectedType}") }`;
  }
  let valuesForPathway = '';
  if (selectedPathway) {
    valuesForPathway = `VALUES (?pathway) { ("${selectedPathway}") }`;
  }
  const sparqlQuery = `
PREFIX up: <http://purl.uniprot.org/uniprot/>
PREFIX pubmed: <https://pubmed.ncbi.nlm.nih.gov/>
PREFIX : <https://raw.githubusercontent.com/ktamura2021/triterpenoid_rdf/main/ontology.ttl#>

SELECT ?type ?name ?pathway ?function ?uniprot ?family ?order ?species ?pubmed
WHERE {
  ${valuesForType}
  ${valuesForPathway}
  ?s  :type ?type ;
      :name ?name ;
      :pathway ?pathway ;
      :function ?function ;
      :uniprot ?uniprot ;
      :family ?family ;
      :order ?order ;
      :species ?species ;
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
