// mocks should remain local
import './currencyData.mock';
import './matchMedia.mock';
import './reactIntl.mock';
import './stripesConfig.mock';
import './stripesIcon.mock';

// Our copy of the stripes-core mock is identical to the one provided
// by stripes-acq-components except that its `<Pluggable>` export is a
// `jest.fn` mock instead of just `props => <>{props.children}</>`
import './stripesCore.mock';
