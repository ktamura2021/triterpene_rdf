async function fetchDatabySPARQL(selectedType, selectedPathway, selectedOrder) {
  const endpointUrl = 'https://spang.dbcls.jp/sparql';
  let valuesForType = '';
  if (selectedType) {
    valuesForType = `VALUES (?type) { ("${selectedType}") }`;
  }
  let valuesForPathway = '';
  if (selectedPathway) {
    valuesForPathway = `VALUES (?pathway) { ("${selectedPathway}") }`;
  }
  let valuesForOrder = '';
  if (selectedOrder) {
    valuesForOrder = `VALUES (?order) { ("${selectedOrder}") }`;
  }
  const sparqlQuery = `
PREFIX up: <http://purl.uniprot.org/uniprot/>
PREFIX pubmed: <https://pubmed.ncbi.nlm.nih.gov/>
PREFIX : <https://ktamura2021.github.io/triterpene_rdf/ontology.ttl#>

SELECT ?ID ?type ?name ?pathway ?function ?uniprot ?species ?family ?order ?pubmed
WHERE {
  ${valuesForType}
  ${valuesForPathway}
  ${valuesForOrder}
  ?s  :type ?type ;
      :ID ?ID ;
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

async function fetchFastaBySPARQL(selectedType, selectedPathway, selectedOrder) {
  const endpointUrl = 'https://spang.dbcls.jp/sparql';
  let valuesForType = '';
  if (selectedType) {
    valuesForType = `VALUES (?type) { ("${selectedType}") }`;
  }
  let valuesForPathway = '';
  if (selectedPathway) {
    valuesForPathway = `VALUES (?pathway) { ("${selectedPathway}") }`;
  }
  let valuesForOrder = '';
  if (selectedOrder) {
    valuesForOrder = `VALUES (?order) { ("${selectedOrder}") }`;
  }
  const sparqlQuery = `
PREFIX up: <http://purl.uniprot.org/uniprot/>
PREFIX pubmed: <https://pubmed.ncbi.nlm.nih.gov/>
PREFIX : <https://raw.githubusercontent.com/ktamura2021/triterpenoid_rdf/main/ontology.ttl#>

SELECT ?ID ?type ?name ?sequence
WHERE {
  ${valuesForType}
  ${valuesForPathway}
  ${valuesForOrder}
  ?s  :type ?type ;
      :ID ?ID ;
      :name ?name ;
      :pathway ?pathway ;
      :order ?order ;
      :aa_sequence ?sequence .
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
