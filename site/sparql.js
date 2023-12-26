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

SELECT ?ID ?type ?name ?pathway ?skeleton ?function ?uniprot ?ncbiprotein ?species ?family ?order ?pubmed ?note
WHERE {
  ${valuesForType}
  ${valuesForPathway}
  ${valuesForOrder}
  ?s  :type ?type ;
      :ID ?ID ;
      :name ?name ;
      :pathway ?pathway ;
      :skeleton ?skeleton ;
      :function ?function ;
      :uniprot ?uniprot ;
      :ncbiprotein ?ncbiprotein ;
      :family ?family ;
      :order ?order ;
      :species ?species ;
      :pubmed ?pubmed ; 
      :note ?note .
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
PREFIX : <https://ktamura2021.github.io/triterpene_rdf/ontology.ttl#> 

SELECT ?ID ?type ?name ?species ?sequence
WHERE {
  ${valuesForType}
  ${valuesForPathway}
  ${valuesForOrder}
  ?s  :type ?type ;
      :ID ?ID ;
      :name ?name ;
      :pathway ?pathway ;
      :order ?order ;
      :species ?species ;
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
