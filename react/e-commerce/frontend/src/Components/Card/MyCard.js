import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import { CardActions } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: 200,
    maxHeight: 250,
    minWidth: 380,
    maxWidth: 400,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 200,
    objectFit: 'contain',
  },
}));

function MyCard({ image, title, description, rating }) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.cover}
        image={image}
        title="Live from space album cover"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions style={{ position: 'relative' }}>
          <Rating
            name="half-rating-read"
            defaultValue={rating}
            precision={0.5}
            readOnly
            size="medium"
          />
        </CardActions>
      </div>
    </Card>
  );
}
export default MyCard;
