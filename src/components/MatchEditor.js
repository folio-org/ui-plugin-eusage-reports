import { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  HasCommand,
  Paneset,
  Pane,
  Layout,
  ButtonGroup,
  Button,
  MultiColumnList,
  Dropdown,
  IconButton,
  DropdownMenu
} from '@folio/stripes/components';
import generateTitleCategories from '../util/generateTitleCategories';


function MatchEditor({ matchType, onClose, data, paneTitleRef }) {
  const intl = useIntl();
  const [currentMatchType, setCurrentMatchType] = useState(matchType);
  const categories = generateTitleCategories(data.reportTitles);
  const dataSet = categories.filter(c => c.key === currentMatchType)[0].data;

  return (
    <HasCommand commands={[{ name: 'close', handler: onClose }]}>
      <Paneset isRoot>
        <Pane
          defaultWidth="fill"
          dismissible
          onClose={onClose}
          paneTitle={<FormattedMessage
            id="ui-plugin-eusage-reports.matching-summary.matcher-heading"
            values={{ label: data.usageDataProvider.label }}
          />}
          paneTitleRef={paneTitleRef}
        >
          <Layout className="textCentered">
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
          </Layout>

          <MultiColumnList
            autosize
            contentData={dataSet}
            visibleColumns={['id', 'counterReportTitle', 'kbTitleName', 'kbTitleId', 'kbManualMatch', 'action']}
            columnMapping={{
              id: <FormattedMessage id="ui-plugin-eusage-reports.column.id" />,
              counterReportTitle: <FormattedMessage id="ui-plugin-eusage-reports.column.counterReportTitle" />,
              kbTitleName: <FormattedMessage id="ui-plugin-eusage-reports.column.kbTitleName" />,
              kbTitleId: <FormattedMessage id="ui-plugin-eusage-reports.column.kbTitleId" />,
              kbManualMatch: <FormattedMessage id="ui-plugin-eusage-reports.column.kbManualMatch" />,
              action: <FormattedMessage id="ui-plugin-eusage-reports.column.action" />,
            }}
            columnWidths={{
              id: '90px',
              counterReportTitle: '300px',
              kbTitleName: '300px',
              kbTitleId: '90px',
              kbManualMatch: '120px',
              action: '100px',
            }}
            formatter={{
              id: r => r.id.substring(0, 8),
              kbTitleId: r => (r.kbTitleId || '').substring(0, 8),
              action: r => (
                <Dropdown
                  id={`menu-${r.id}`}
                  renderTrigger={({ getTriggerProps }) => (
                    <IconButton
                      {...getTriggerProps()}
                      icon="ellipsis"
                      aria-label={intl.formatMessage({ id: 'ui-plugin-eusage-reports.column.action' })}
                    />
                  )}
                  renderMenu={({ onToggle }) => (
                    <DropdownMenu role="menu" aria-label="XXX actions">
                      <Button
                        role="menuitem"
                        buttonStyle="dropdownItem"
                        data-test-dropdown-edit
                        onClick={e => {
                          console.log('edit', e);
                          onToggle(e);
                        }}
                      >
                        Edit match
                      </Button>
                      <Button
                        role="menuitem"
                        buttonStyle="dropdownItem"
                        data-test-dropdown-ignore
                        onClick={e => {
                          console.log('ignore', e);
                          onToggle(e);
                        }}
                      >
                        Ignore
                      </Button>
                    </DropdownMenu>
                  )}
                />
              ),
            }}
          />
        </Pane>
      </Paneset>
    </HasCommand>
  );
}


MatchEditor.propTypes = {
  matchType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired, // XXX tighten this up
  paneTitleRef: PropTypes.object.isRequired,
};


export default MatchEditor;
