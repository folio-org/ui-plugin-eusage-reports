import chooseColor from './chooseColor';


function transformReqByUseDateData(rbdou, metricType) {
  /*
  // XXX for testing only!
  rbdou = {
    'accessCountPeriods': ['2019', '2020', '2021'],
    'totalRequestsPublicationYearsByPeriod': [
      {
        '2010': 18,
        '2011': 6,
        '2012': 5,
        '2013': 7,
        '2014': 11,
        '2015': 16,
        '2016': 7,
        '2017': 7,
        '2018': 18,
        '2019': 31,
        '2020': 26,
        '2021': 30,
      },
      {
        '2010': 36,
        '2011': 13,
        '2012': 11,
        '2013': 15,
        '2014': 22,
        '2015': 33,
        '2016': 15,
        '2017': 15,
        '2018': 36,
        '2019': 63,
        '2020': 53,
        '2021': 60,
      },
      {
        '2010': 73,
        '2011': 26,
        '2012': 22,
        '2013': 31,
        '2014': 45,
        '2015': 66,
        '2016': 30,
        '2017': 31,
        '2018': 73,
        '2019': 126,
        '2020': 107,
        '2021': 120,
      }
    ],
  };
  */

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
