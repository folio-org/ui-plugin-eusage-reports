// Note: mocks should ONLY be passed in testing
function downloadCSV(url, stripes, params, mocks) {
  const effectiveDocument = mocks ? mocks.document : document;
  const effectiveWindow = mocks ? mocks.window : window;

  const partialPath = url.replace(/.*\/(.*?)\?.*/, '$1');
  const cleanedURL = url.replace('&full=false', '');
  return fetch(`${cleanedURL}&csv=true`, {
    headers: {
      'X-Okapi-Tenant': stripes.okapi.tenant,
      'X-Okapi-Token': stripes.okapi.token,
    }
  }).then(response => response.blob())
    .then(blob => {
      const a = effectiveDocument.createElement('a');
      a.href = effectiveWindow.URL.createObjectURL(blob);
      a.download = `${partialPath}--${params.startDate}--${params.endDate}.csv`;
      effectiveDocument.body.appendChild(a);
      a.click();
      a.remove();
    });
}


export default downloadCSV;
