import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteOutlinedIcon from '@material-ui/icons/LocationOn';

const styles = {
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

function Dashboard(props) {
  const { classes } = props;
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h2" component="h1">
          64
        </Typography>
        <Typography className={classes.pos} variant="h5" color="textSecondary">
          <DeleteOutlinedIcon className={classes.icon} />
          Grant to Dieppe Loop
        </Typography>
        <Typography component="p" variant="h4">
          OK 6:49
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">More Info</Button>
      </CardActions>
    </Card>
  );
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
