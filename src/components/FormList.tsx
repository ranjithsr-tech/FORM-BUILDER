// FormList Component
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContext } from '../contexts/FormContext';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material';

const FormList = () => {
  const { forms, deleteForm } = useContext(FormContext)!;
  const navigate = useNavigate();

  return (
    <Box p={2}>
      <Typography variant="h5">Your Forms</Typography>
      {forms.length > 0 ? (
        forms.map((form) => (
          <Card key={form.id} sx={{ my: 2 }}>
            <CardContent>
              <Typography variant="h6">{form.name}</Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                onClick={() => navigate(`/preview/${form.id}`)}
              >
                Preview
              </Button>
              <Button
                color="error"
                onClick={() => deleteForm(form.id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <Typography>No forms available. Create a new one!</Typography>
      )}
    </Box>
  );
};

export default FormList;