// Sample protected route handler
exports.getMyboi = (req, res) => {
    req.db.collection('DataTest').find().toArray()
      .then((data) => {
        res.json(data);
      })
      .catch(err => {
        console.error('Error retrieving data:', err);
        res.status(500).send('Internal Server Error');
      });
  };
  