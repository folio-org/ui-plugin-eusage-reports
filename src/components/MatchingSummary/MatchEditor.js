import PropTypes from 'prop-types';
import { Paneset, Pane, Button } from '@folio/stripes/components';


function MatchEditor({ matchType, onClose }) {
  return (
    <Paneset isRoot>
      <Pane defaultWidth="fill">
        <h1>Match editor for <code>{matchType}</code></h1>
        <Button onClick={onClose}>Dismiss</Button>
      </Pane>
    </Paneset>
  );
}


MatchEditor.propTypes = {
  matchType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};


export default MatchEditor;
