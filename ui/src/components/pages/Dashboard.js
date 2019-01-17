import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteOutlinedIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';

export class Dashboard extends Component {
  state = {
    busInformation: [],
  };
  async componentDidMount() {
    const res = await fetch('http://localhost:4000/stop/10611/18');
    const blocks = await res.json();

    this.setState({
      busInformation: blocks,
    });

    try {
      setInterval(async () => {
        const res = await fetch('http://localhost:4000/stop/10611/18');
        const blocks = await res.json();

        this.setState({
          busInformation: blocks,
        });
      }, 2000);
    } catch (error) {
      console.log('Rate Limit Reached');
    }
  }

  render() {
    const buses = this.state.busInformation.map((bus) => (
      <div key={bus.key}>
        <Card className="minwidth: 275 mt">
          <CardContent>
            <Typography variant="h2" component="h1">
              {bus.routeNumber}
            </Typography>
            <Typography className="marginbottom: 12" variant="h5" color="textSecondary">
              <DeleteOutlinedIcon />
              {bus.name}
            </Typography>
            <Typography component="p" variant="h4">
              {bus.status} {bus.time}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">More Info</Button>
          </CardActions>
        </Card>
      </div>
    ));

    return (
      <div>
        <br />
        <Grid container spacing={8}>
          <div>{buses}</div>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
