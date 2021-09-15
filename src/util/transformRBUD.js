import chooseColor from './chooseColor';


function transformReqByUseDateData(rbdou, metricType) {
  if (!rbdou) return null;

  let dataByPeriod;
  if (metricType === 'Total_Item_Requests') {
    dataByPeriod = rbdou.totalRequestsPublicationYearsByPeriod;
  } else if (metricType === 'Unique_Item_Requests') {
    dataByPeriod = rbdou.uniqueRequestsPublicationYearsByPeriod;
  } else {
    // eslint-disable-next-line no-console
    console.error('transformReqByUseDateData: unsuported metricType =', metricType);
    return null;
  }

  // dataByPeriod is a list, parallel to rbdou.accessCountPeriods, in
  // which each entry is a hash mapping a publication year to a
  // count. But some of the hashes can be empty, and I guess in
  // general can omit some years. So -- *sigh* -- we have to walk all
  // of the hashes to determine the complete list of publication
  // years, and put them in order.

  const publicationYearMap = {};
  dataByPeriod.forEach(period => {
    Object.keys(period).forEach(publicationYear => {
      publicationYearMap[publicationYear] = true;
    });
  });
  const publicationYears = Object.keys(publicationYearMap).sort();
  // console.log('transformReqByUseDateData, publicationYears =', publicationYears);

  const datasets = publicationYears.map((publicationYear, index) => ({
    label: publicationYear === 'nopub' ? '(No publication date)' : publicationYear,
    data: dataByPeriod.map(period => period[publicationYear]),
    backgroundColor: publicationYear === 'nopub' ? '#eee' : chooseColor(index),
    stack: 'Stack 0',
  }));

  return {
    labels: rbdou.accessCountPeriods,
    datasets,
  };
}


export default transformReqByUseDateData;
