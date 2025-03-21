import { useState } from 'react';

import { useMutation } from '@apollo/client';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import { Grid, CardActions, Divider, Typography, TextField, Stack, Switch } from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';

import MainCard from '../../../../ui-component/cards/MainCard';

import { savePreferencesService } from '../../../../services/controlPanel/mutations.service';
import { useDispatch, useSelector } from '../../../../store';
import { setShow } from '../../../../store/slices/show';
import { UPDATE_PREFERENCES } from '../../../../utils/graphql/controlPanel/mutations';
import { showAlert } from '../../globalPageHelpers';

const JukeboxSettings = ({ setShowLinearProgress }) => {
  const dispatch = useDispatch();
  const { show } = useSelector((state) => state.show);

  const [jukeboxDepth, setJukeboxDepth] = useState(show?.preferences?.jukeboxDepth);
  const [jukeboxRequestLimit, setJukeboxRequestLimit] = useState(show?.preferences?.jukeboxRequestLimit);

  const [updatePreferencesMutation] = useMutation(UPDATE_PREFERENCES);

  const handleCheckIfRequestedSwitch = (event, value) => {
    setShowLinearProgress(true);
    const updatedPreferences = _.cloneDeep({
      ...show?.preferences,
      checkIfRequested: value
    });
    savePreferencesService(updatedPreferences, updatePreferencesMutation, (response) => {
      dispatch(
        setShow({
          ...show,
          preferences: {
            ...updatedPreferences
          }
        })
      );
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  const savePreferences = () => {
    setShowLinearProgress(true);
    const updatedPreferences = _.cloneDeep({
      ...show?.preferences,
      jukeboxDepth,
      jukeboxRequestLimit
    });
    savePreferencesService(updatedPreferences, updatePreferencesMutation, (response) => {
      if (response?.success) {
        dispatch(
          setShow({
            ...show,
            preferences: {
              ...updatedPreferences
            }
          })
        );
      }
      showAlert(dispatch, response?.toast);
      setShowLinearProgress(false);
    });
  };

  return (
    <Grid item xs={12}>
      <MainCard content={false}>
        <Divider />
        <CardActions>
          <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <Stack direction="row" spacing={2} pb={1}>
                <Typography variant="h4">Jukebox Queue Depth</Typography>
                <InfoTwoToneIcon
                  onClick={() =>
                    window.open(
                      'https://docs.remotefalcon.com/docs/docs/control-panel/remote-falcon-settings#jukebox-queue-depth',
                      '_blank',
                      'noreferrer'
                    )
                  }
                  fontSize="small"
                />
              </Stack>
              <Typography component="div" variant="caption">
                Controls how many sequences can be in the Jukebox Queue (use 0 for unlimited queue depth).
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextField
                type="number"
                fullWidth
                label="Jukebox Queue Depth"
                onChange={(e) => setJukeboxDepth(parseInt(e?.target?.value, 10))}
                value={jukeboxDepth}
                onBlur={savePreferences}
              />
            </Grid>
          </Grid>
        </CardActions>
        <Divider />
        <CardActions>
          <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <Stack direction="row" spacing={2} pb={1}>
                <Typography variant="h4">Jukebox Sequence Request Limit</Typography>
                <InfoTwoToneIcon
                  onClick={() =>
                    window.open(
                      'https://docs.remotefalcon.com/docs/docs/control-panel/remote-falcon-settings#jukebox-sequence-request-limit',
                      '_blank',
                      'noreferrer'
                    )
                  }
                  fontSize="small"
                />
              </Stack>
              <Typography component="div" variant="caption">
                Controls when a sequence can be requested if it already exists in the queue. Use 0 to allow any sequence to be requested at
                any time.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextField
                type="number"
                fullWidth
                label="Jukebox Sequence Request Limit"
                onChange={(e) => setJukeboxRequestLimit(parseInt(e?.target?.value, 10))}
                value={jukeboxRequestLimit}
                onBlur={savePreferences}
              />
            </Grid>
          </Grid>
        </CardActions>
        <Divider />
        <CardActions>
          <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <Stack direction="row" spacing={2} pb={1}>
                <Typography variant="h4">Prevent Multiple Requests</Typography>
                <InfoTwoToneIcon
                  onClick={() =>
                    window.open(
                      'https://docs.remotefalcon.com/docs/docs/control-panel/remote-falcon-settings#prevent-multiple-requests',
                      '_blank',
                      'noreferrer'
                    )
                  }
                  fontSize="small"
                />
              </Stack>
              <Typography component="div" variant="caption">
                Prevents a viewer from requesting more than one sequence while a song is currently playing.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Switch
                name="checkIfRequested"
                color="primary"
                checked={show?.preferences?.checkIfRequested}
                onChange={handleCheckIfRequestedSwitch}
              />
            </Grid>
          </Grid>
        </CardActions>
        <Divider />
      </MainCard>
    </Grid>
  );
};

JukeboxSettings.propTypes = {
  setShowLinearProgress: PropTypes.func
};

export default JukeboxSettings;
