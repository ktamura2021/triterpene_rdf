$(function () { // When DOM is ready
  document.getElementById('button-download').addEventListener('click', function() {
    const selectedType = $('#select-type').val();
    const selectedPathway = $('#select-pathway').val();
    const selectedOrder = $('#select-order').val();
    fetchFastaBySPARQL(selectedType, selectedPathway, selectedOrder).then(data => {
      downloadResults(data);
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  });
  fetchDatabySPARQL('', '', '').then(data => {
    renderTable(data);
  }).catch(error => {
    console.error('Error fetching data:', error);
    document.getElementById('resultsTable').innerHTML = 'Error fetching data.';
  });

  fetch('site/type.candidates')
    .then(response => response.text())
    .then(text => {
      let rows = text.trim().split('\n');
      let selectType = document.getElementById('select-type');

      let firstOption = document.createElement('option');
      firstOption.innerText = '';
      selectType.appendChild(firstOption);
      
      rows.forEach(row => {
        let option = document.createElement('option');
        option.innerText = row;
        selectType.appendChild(option);
      });
    })
    .catch(error => console.error('Error:', error));

  fetch('site/pathway.candidates')
    .then(response => response.text())
    .then(text => {
      let rows = text.trim().split('\n');
      let selectType = document.getElementById('select-pathway');

      let firstOption = document.createElement('option');
      firstOption.innerText = '';
      selectType.appendChild(firstOption);

      rows.forEach(row => {
        let option = document.createElement('option');
        option.innerText = row;
        selectType.appendChild(option);
      });
    })
    .catch(error => console.error('Error:', error));

  fetch('site/order.candidates')
    .then(response => response.text())
    .then(text => {
      let rows = text.trim().split('\n');
      let selectType = document.getElementById('select-order');

      let firstOption = document.createElement('option');
      firstOption.innerText = '';
      selectType.appendChild(firstOption);

      rows.forEach(row => {
        let option = document.createElement('option');
        option.innerText = row;
        selectType.appendChild(option);
      });
    })
    .catch(error => console.error('Error:', error));

  $('#select-type').on('change', function() {
    const selectedType = $(this).val();
    const selectedPathway = $('#select-pathway').val();
    const selectedOrder = $('#select-order').val();
    fetchDatabySPARQL(selectedType, selectedPathway, selectedOrder).then(data => {
      renderTable(data);
    }).catch(error => {
      console.error('Error fetching data:', error);
      document.getElementById('resultsTable').innerHTML = 'Error fetching data.';
    });
  });

  $('#select-pathway').on('change', function() {
    const selectedType = $('#select-type').val();
    const selectedPathway = $(this).val();
    const selectedOrder = $('#select-order').val();
    fetchDatabySPARQL(selectedType, selectedPathway, selectedOrder).then(data => {
      renderTable(data);
    }).catch(error => {
      console.error('Error fetching data:', error);
      document.getElementById('resultsTable').innerHTML = 'Error fetching data.';
    });
  });

  $('#select-order').on('change', function() {
    const selectedType = $('#select-type').val();
    const selectedPathway = $('#select-pathway').val();
    const selectedOrder = $(this).val();
    fetchDatabySPARQL(selectedType, selectedPathway, selectedOrder).then(data => {
      renderTable(data);
    }).catch(error => {
      console.error('Error fetching data:', error);
      document.getElementById('resultsTable').innerHTML = 'Error fetching data.';
    });
  });
  
  function setupAutocomplete(candidates) {
    $('#tags').autocomplete({
      source: (request, response) => {
        response(
          $.grep(candidates, (value) => {
            let regexp = new RegExp('\\b' + escapeRegExp(request.term), 'i');
            return value.match(regexp);
          })
        );
      },
      autoFocus: true,
      delay: 100,
      minLength: 2,
      select: (e, ui) => {
        if (ui.item) {
          document.getElementById('resultsTable').innerHTML = 'Searching ...';
          let name = ui.item.label;
          fetchDatabySPARQL(name).then(data => {
            renderTable(data);
          }).catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('resultsTable').innerHTML = 'Error fetching data.';
          });
        }
      }
    });
  }
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function renderTable(data) {
  const table = document.getElementById('resultsTable');
  table.innerHTML = '';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  data.head.vars.forEach(variable => {
    const th = document.createElement('th');
    th.textContent = variable;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.results.bindings.forEach(binding => {
    const tr = document.createElement('tr');
    data.head.vars.forEach(variable => {
      const td = document.createElement('td');
      const value = binding[variable].value;
      if (value.match(/^http/)) {
        let link = document.createElement('a');
        link.href = value;
        link.textContent = value.replace(/.*\//, '');
        td.appendChild(link);
      } else {
        td.textContent = value;
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

function downloadResults(data) {
  let fasta = '';
  data.results.bindings.forEach(binding => {
    const id = binding.ID.value;
    const type = binding.type.value;
    const name = binding.name.value;
    const sequence = binding.sequence.value;
    fasta += `>${id} ${type} ${name}\n${sequence}\n`;
  });

  const date = new Date().toISOString().slice(0,10);
  const fileName = `triterpenoid_${date}.fa`;

  const blob = new Blob([fasta], {type: 'text/plain'});
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
