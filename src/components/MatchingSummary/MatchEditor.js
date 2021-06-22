import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Paneset, Pane, ButtonGroup, Button } from '@folio/stripes/components';
import generateTitleCategories from '../../util/generateTitleCategories';


function MatchEditor({ matchType, onClose, data }) {
  const [currentMatchType, setCurrentMatchType] = useState(matchType);
  const categories = generateTitleCategories(data.reportTitles);
  const dataSet = categories.filter(c => c.key === currentMatchType)[0].data;

  return (
    <Paneset isRoot>
      <Pane
        defaultWidth="fill"
        dismissible
        onClose={onClose}
        paneTitle={<>Match editor for <code>{currentMatchType}</code></>}
      >
        <div style={{ textAlign: 'center', margin: 'auto' }}>
          <ButtonGroup>
            {
              categories.map(cat => (
                <Button
                  key={cat.key}
                  buttonStyle={`${cat.key === currentMatchType ? 'primary' : 'default'}`}
                  id={`segment-category-${cat.key}`}
                  onClick={() => setCurrentMatchType(cat.key)}
                >
                  <FormattedMessage id={`ui-plugin-eusage-reports.matching-summary.${cat.key}`} />
                </Button>
              ))
            }
          </ButtonGroup>
        </div>

        <ol>
          {
            dataSet.map((entry, i) => (
              <li key={i}>
                {JSON.stringify(entry)}
              </li>
            ))
          }
        </ol>
      </Pane>
    </Paneset>
  );
}


MatchEditor.propTypes = {
  matchType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired, // XXX tighten this up
};


export default MatchEditor;
