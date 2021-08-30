import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import uniqueId from 'lodash/uniqueId';
import { Label } from '@folio/stripes/components';


function Monthpicker(props) {
  const { value: initialValue, label, onChange, ...rest } = props;
  const uniq = uniqueId('monthpicker-');
  const id = rest.id || `${uniq}-id`;
  const name = rest.name || `${uniq}-name`;
  delete rest.id;
  delete rest.name;

  let year;
  let month;
  const [tmpYear, setYear] = useState();
  const [tmpMonth, setMonth] = useState();
  if (tmpYear) {
    [year, month] = [tmpYear, tmpMonth];
  } else {
    year = initialValue.substring(0, 4);
    month = initialValue.substring(5, 7);
    setYear(year);
    setMonth(month);
  }

  return (
    <>
      <Label htmlFor={id}>
        {label}
      </Label>
      <span id={id}>
        <FormattedMessage id="ui-plugin-eusage-reports.monthpicker.year" />
        {' '}
        <input
          {...rest}
          id={`${id}-y`}
          name={`${name}-y`}
          type="number"
          size="4"
          value={year}
          onChange={e => {
            const newYear = e.target.value;
            // console.log('change year to', newYear);
            if (newYear.match(/^\d{4}/)) {
              // console.log(` valid year '${newYear}'`);
              setYear(newYear);
              onChange({ target: { value: `${newYear}-${month}` } });
            } else {
              // console.log(` invalid year '${newYear}', no-op`);
              setYear(newYear);
            }
          }}
        />
        {' '}
        <FormattedMessage id="ui-plugin-eusage-reports.monthpicker.month" />
        {' '}
        <select
          {...rest}
          id={`${id}-m`}
          name={`${name}-m`}
          value={month}
          onChange={e => {
            const newMonth = e.target.value;
            setMonth(newMonth);
            onChange({ target: { value: `${year}-${newMonth}` } });
          }}
        >
          {
            Array.apply(0, Array(12)).map((_, i) => {
              const padded = (i + 1).toString().padStart(2, '0');
              return <option key={padded} value={padded}>{padded}</option>;
            })
          }
        </select>
      </span>
    </>
  );
}


Monthpicker.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};


export default Monthpicker;
