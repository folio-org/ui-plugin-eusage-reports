import chooseColor from './chooseColor';


// The incoming data structure is:
//
// * accessCountPeriods is a list of publication periods (NOT access
//   periods)
// * totalRequestsPeriodsOfUseByPeriod is a list, parallel to
//   accessCountPeriods, in which each element is a hash mapping
//   usage-period to total request count within that period.
// * uniqueRequestsPeriodsOfUseByPeriod is the same for unique requests
//
// (There are other elements but they are of no interest to us.)
//

function transformReqByPubYearData(rbpy, metricType) {
  if (!rbpy) return null;

  let dataByPub;
  if (metricType === 'Total_Item_Requests') {
    dataByPub = rbpy.totalRequestsPeriodsOfUseByPeriod;
  } else if (metricType === 'Unique_Item_Requests') {
    dataByPub = rbpy.uniqueRequestsPeriodsOfUseByPeriod;
  } else {
    // eslint-disable-next-line no-console
    console.error('transformReqByPubYearData: unsuported metricType =', metricType);
    return null;
  }

  // dataByPub is a list, parallel to rbpy.accessCountPeriods, in
  // which each entry is a hash mapping a usage period year to a
  // count. But some of the hashes can, I guess, in general can omit
  // some years. So -- *sigh* -- we have to walk all of the hashes to
  // determine the complete list of usage periods, and put them in
  // order.

  const usagePeriodMap = {};
  dataByPub.forEach(period => {
    Object.keys(period).forEach(usagePeriod => {
      usagePeriodMap[usagePeriod] = true;
    });
  });
  const usagePeriods = Object.keys(usagePeriodMap).sort();

  const datasets = usagePeriods.map((usagePeriod, index) => ({
    label: usagePeriod,
    data: dataByPub.map(publicationYear => publicationYear[usagePeriod]),
    backgroundColor: chooseColor(index),
    stack: 'Stack 0',
  }));

  return {
    labels: rbpy.accessCountPeriods,
    datasets,
  };
}


export default transformReqByPubYearData;
