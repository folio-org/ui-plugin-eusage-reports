// We would like to just import the whole of
// @folio/stripes-acq-components/test/jest/__mock__
// But we need our own local stripes-core mock, so instead we have to
// laboriously include each of the stripes-acq-components mocks individually.

import '@folio/stripes-acq-components/test/jest/__mock__';
import '@folio/stripes-acq-components/test/jest/__mock__/currencyData.mock';
import '@folio/stripes-acq-components/test/jest/__mock__/documentCreateRange.mock';
import '@folio/stripes-acq-components/test/jest/__mock__/localStorage.mock';
import '@folio/stripes-acq-components/test/jest/__mock__/matchMedia.mock';
import '@folio/stripes-acq-components/test/jest/__mock__/reactIntl.mock';
import '@folio/stripes-acq-components/test/jest/__mock__/stripesConfig.mock';
// import '@folio/stripes-acq-components/test/jest/__mock__/stripesCore.mock';
import '@folio/stripes-acq-components/test/jest/__mock__/stripesIcon.mock';
import '@folio/stripes-acq-components/test/jest/__mock__/stripesSmartComponents.mock';

// Our copy of the stripes-core mock is identical to the one provided
// by stripes-acq-components except that its `<Pluggable>` export is a
// `jest.fn` mock instead of just `props => <>{props.children}</>`

import './stripesCore.mock';
