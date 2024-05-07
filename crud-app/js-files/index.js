const table = document.getElementById('grid');
const form = document.getElementById('l-inner-form');
const header2 = document.getElementsByTagName('h2')[0];
const formBox = document.querySelector('.form-box');
const messageBox = document.getElementById('message-box');
const tableBody = document.getElementsByTagName('tbody')[0];
const filterSection = document.getElementById('filter-section');
const getSearchInput = () => document.getElementById('satelliteName').value || '';

const deafultResponse = {
  code: 0,
  message: 'Event created successfully',
  type: 'INFO'
};

function fakeFetch(data = deafultResponse) {
  displayMessage('loading');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.85) {
        resolve(data);
      } else {
        reject({message: 'There was a problem with the server, please try again.'});
      }
      messageBox.style.display = 'none';
    }, 2000);
  });
}

async function getTableData(withFilter) {
  // const url = `http://localhost:1781/restfulservice/events${withFilter ? `/${getSearchInput()}` : ''}`
  try {
    // const response = await fetch(url, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*'
    //   }
    // });
    // return await response.json();
    const parsedData = JSON.parse(localStorage.getItem('formData'));
    const response = await fakeFetch(parsedData);
    const filteredRes = !Array.isArray(response)
      ? []
      : response.filter((obj) => !withFilter || !getSearchInput() || obj.satelliteName === getSearchInput());
    return filteredRes;
  } catch (e) {
    console.log(e);
    displayMessage('failed', e?.message || 'something went wrong.');
    return e?.message || 'something went wrong.';
  }
}

function displayMessage(type, msg) {
  messageBox.style.display = 'block';
  messageBox.style.color = 'antiquewhite';
  messageBox.style.margin = '15px auto';
  messageBox.style.width = 'fit-content';
  if (type === 'loading') {
    messageBox.style.background = 'rgba(214, 195, 195, 0.5)';
    messageBox.innerText = 'Loading.....';
  } else if (type === 'success') {
    messageBox.style.background = 'green';
    messageBox.innerText = msg || 'The data has been saved.';
  } else {
    messageBox.style.background = 'red';
    messageBox.innerText = msg || 'No Data to show.';
  }
}

function clearInputs() {
  form.name.value = '';
  form.priority.value = '';
  form.description.value = '';
  form.date.value = '';
}

async function submitForm(event) {
  event.preventDefault();
  const name = form.name.value;
  const priority = form.priority.value;
  const description = form.description.value;
  const date = form.date.value;
  const formData = {satelliteName: name, priority, description, date: new Date(date).toJSON()};
  try {
    // const response = await fetch('http://localhost:1781/restfulservice/events',
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Access-Control-Allow-Origin': '*'
    //       },
    //       body: JSON.stringify(formData)
    //     }).then(res => res.json());
    const response = await fakeFetch();
    console.log(response);
    if (response?.code === 0) {
      const tableData = await getTableData();
      localStorage.setItem('formData', JSON.stringify([...(tableData || []), formData]));
      displayMessage('success', response?.message);
    } else {
      throw new Error('Data structure mismatched.');
    }
    clearInputs();
  } catch (e) {
    console.log(e);
    displayMessage('failed', e?.message || 'something went wrong.');
  }
  setTimeout(() => {
    messageBox.style.display = 'none';
  }, 5000);
}

form.addEventListener('submit', submitForm);

async function deleteRow(name) {
  try {
    // const response = await fetch(`http://localhost:1781/restfulservice/events/?eventId=${name}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
    // const resJson = await response.json();
    const tableData = await getTableData();
    localStorage.setItem('formData', JSON.stringify([...(tableData || [])].filter((obj) => obj.satelliteName !== name)));
    const resJson = await fakeFetch();
    displayMessage('success', resJson.message && 'Deleted successfully');
    showTable();
  } catch (e) {
    console.log(e);
    displayMessage('failed', e?.message || 'something went wrong.');
  }
  setTimeout(() => {
    messageBox.style.display = 'none';
  }, 5000);
}

function clearTableData() {
  if (tableBody.hasChildNodes()) {
    [...tableBody.getElementsByTagName('tr')].forEach((tr) => {
      tableBody.removeChild(tr);
    });
  }
}

function showForm() {
  table.style.display = 'none';
  filterSection.style.display = 'none';
  messageBox.style.display = 'none';
  form.style.display = 'block';
  header2.innerText = 'Input Tray';
  formBox.style.width = '400px';
  document.getElementById('satelliteName').value = '';
}

async function renderTableData(withFilter = false) {
  const tableData = await getTableData(withFilter);
  if (Array.isArray(tableData) && tableData?.length > 0) {
    if (messageBox.hasChildNodes()) {
      messageBox.style.display = 'none';
    }
    [...tableData].forEach((dataSet) => {
      const tr = document.createElement('tr');
      const dataArray = [...Object.values(dataSet), 'icon'];
      dataArray.forEach((value) => {
        const td = document.createElement('td');
        const textValue = !!value ? value : '--';
        let content;
        if (textValue !== 'icon') {
          content = document.createTextNode(textValue);
        } else {
          content = document.createElement('img');
          content.src = './assets/icons8-delete.png';
          content.alt = 'delete-icon';
          content.style.cursor = 'pointer';
          content.addEventListener('click', () => {
            deleteRow(dataSet.satelliteName);
          });
        }
        td.appendChild(content);
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  } else if (typeof tableData === 'string') {
    displayMessage('failed', tableData);
  } else {
    displayMessage('failed');
  }
}

function showTable() {
  clearTableData();
  table.style.display = 'flex';
  filterSection.style.display = 'flex';
  filterSection.style.height = '39px';
  filterSection.style.marginBottom = '20px';
  filterSection.style.justifyContent = 'space-evenly';
  form.style.display = 'none';
  header2.innerText = 'Entry Table data';
  formBox.style.width = '800px';
  renderTableData().then(() => {});
}

function filterData() {
  clearTableData();
  renderTableData(true).then(() => {});
}
