function downloadCSV(url, stripes, params) {
  const partialPath = url.replace(/.*\/(.*?)\?.*/, '$1');
  fetch(`${url}&csv=true`, {
    headers: {
      'X-Okapi-Tenant': stripes.okapi.tenant,
      'X-Okapi-Token': stripes.okapi.token,
    }
  }).then(response => response.blob())
    .then(blob => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `${partialPath}--${params.startDate}--${params.endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
}


export default downloadCSV;
