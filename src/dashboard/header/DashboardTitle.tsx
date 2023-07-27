import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setDashboardTitle } from '../DashboardActions';
import { getDashboardTitle } from '../DashboardSelectors';
import { getDashboardIsEditable } from '../../settings/SettingsSelectors';
import { Typography } from '@neo4j-ndl/react';

export const NeoDashboardTitle = ({
  dashboardTitle,
  //   setDashboardTitle,
  // editable
}) => {
  const [dashboardTitleText, setDashboardTitleText] = React.useState(dashboardTitle);

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (dashboardTitle !== dashboardTitleText) {
      setDashboardTitleText(dashboardTitle);
    }
  }, [dashboardTitle]);
  return (
    <div className='n-flex n-flex-row n-flex-wrap n-justify-between n-items-center'>
      {/* TODO : Replace with editable field if dashboard is editable */}
      <Typography variant='h3'>{dashboardTitle}</Typography>
    </div>
  );
};

const mapStateToProps = (state) => ({
  dashboardTitle: getDashboardTitle(state),
  editable: getDashboardIsEditable(state),
});

const mapDispatchToProps = (dispatch) => ({
  setDashboardTitle: (title: any) => {
    dispatch(setDashboardTitle(title));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardTitle);
