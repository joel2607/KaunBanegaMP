"use client";
import React, { useState } from 'react';
import { FormControl, InputLabel, Box, Typography, TextField, Select, MenuItem, Button, Divider, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    State_Name: '0',
    Year: new Date().getFullYear(),
    Sex: 1,
    Turnout_Percentage: 0,
    ENOP: 0,
    last_poll: 0,
    No_Terms: 0,
    Turncoat: 0,
    Incumbent: 0,
    Recontest: 0,
    Reserved_Constituency: 0,
    Party_Type_TCPD: 'independents',
    Party_Type_TCPD_local_party: 0,
    Party_Type_TCPD_national_party: 0,
    Party_Type_TCPD_state_based_party: 0,
    Party_Type_TCPD_state_based_party_other_state: 0, 
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (formData.Party_Type_TCPD == 'local party') formData.Party_Type_TCPD_local_party = 1
    else if (formData.Party_Type_TCPD == 'national party') formData.Party_Type_TCPD_national_party = 1
    else if (formData.Party_Type_TCPD == 'state-based party') formData.Party_Type_TCPD_state_based_party = 1
    else if (formData.Party_Type_TCPD == 'state-based party (other state)') formData.Party_Type_TCPD_state_based_party_other_state = 1

    try {
      // removing Party_Type_TCPD
      const {Party_Type_TCPD, ...req} = formData
      const result = await axios.post('/api/predict/', req)
      setPrediction(result.data);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const statesAndUTs = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Dadra and Nagar Haveli and Daman and Diu",
    "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
    "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];


  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: '800px',
        mx: 'auto',
        p: 4,
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant="h4" gutterBottom>
        Election Winner Prediction
      </Typography>

      {/* Basic Information */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="state-label">State Name</InputLabel>
          <Select
            labelId="state-label"
            id="state"
            value={formData.State_Name}
            label="State Name"
            onChange={(e) => handleInputChange('State_Name', e.target.value)}
          >
            {statesAndUTs.map((state, index) => (
              <MenuItem key={state} value={index}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          id="year"
          label="Year"
          type="number"
          value={formData.Year}
          onChange={(e) => handleInputChange('Year', parseInt(e.target.value))}
        />
        <FormControl>
        <InputLabel id="sex-label">Sex</InputLabel>
        <Select
          id="sex"
          label="Sex"
          value={formData.Sex}
          onChange={(e) => handleInputChange('Sex', e.target.value)}
        >
          <MenuItem value="1">Male</MenuItem>
          <MenuItem value="0">Female</MenuItem>
          <MenuItem value="0">Other</MenuItem>
        </Select>
        </FormControl>
        <TextField
          id="turnout"
          label="Turnout Percentage"
          type="number"
          value={formData.Turnout_Percentage}
          onChange={(e) => handleInputChange('Turnout_Percentage', parseFloat(e.target.value))}
        />
      </Box>

      {/* Electoral Metrics */}
      <Divider style={{ marginTop: '24px', marginBottom: '24px' }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        <TextField
          id="enop"
          label="ENOP"
          type="number"
          value={formData.ENOP}
          onChange={(e) => handleInputChange('ENOP', parseFloat(e.target.value))}
        />
        <TextField
          id="lastPoll"
          label="Last Poll"
          type="number"
          value={formData.last_poll}
          onChange={(e) => handleInputChange('last_poll', parseFloat(e.target.value))}
        />
      </Box>

      {/* Candidate History */}
      <Divider style={{ marginTop: '24px', marginBottom: '24px' }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        <TextField
          id="terms"
          label="Number of Terms"
          type="number"
          value={formData.No_Terms}
          onChange={(e) => handleInputChange('No_Terms', parseInt(e.target.value))}
        />
        <FormControl className="min-w-[200px]">
        <InputLabel id="turncoat-label">Turncoat</InputLabel>
        <Select
          labelId="turncoat-label"
          id="turncoat"
          value={formData.Turncoat.toString()}
          label="Turncoat"
          onChange={(e) => handleInputChange('Turncoat', parseInt(e.target.value))}
        >
          <MenuItem value="0">No</MenuItem>
          <MenuItem value="1">Yes</MenuItem>
        </Select>
        </FormControl>
        <FormControl className="min-w-[200px]">
        <InputLabel id="incumbent-label">Incumbent</InputLabel>
        <Select
          labelId="incumbent-label"
          id="incumbent"
          value={formData.Incumbent.toString()}
          label="Incumbent"
          onChange={(e) => handleInputChange('Incumbent', parseInt(e.target.value))}
        >
          <MenuItem value="0">No</MenuItem>
          <MenuItem value="1">Yes</MenuItem>
        </Select>
      </FormControl>

      <FormControl className="min-w-[200px]">
        <InputLabel id="recontest-label">Recontest</InputLabel>
        <Select
          labelId="recontest-label"
          id="recontest"
          value={formData.Recontest.toString()}
          label="Recontest"
          onChange={(e) => handleInputChange('Recontest', parseInt(e.target.value))}
        >
          <MenuItem value="0">No</MenuItem>
          <MenuItem value="1">Yes</MenuItem>
        </Select>
      </FormControl>

      <FormControl className="min-w-[200px]">
        <InputLabel id="reserved-label">Reserved Constituency</InputLabel>
        <Select
          labelId="reserved-label"
          id="reserved"
          value={formData.Reserved_Constituency.toString()}
          label="Reserved Constituency"
          onChange={(e) => handleInputChange('Reserved_Constituency', parseInt(e.target.value))}
        >
          <MenuItem value="0">No</MenuItem>
          <MenuItem value="1">Yes</MenuItem>
        </Select>
      </FormControl>
      <FormControl className="min-w-[200px]">
        <InputLabel id="Party-Type-label">Party Type</InputLabel>
        <Select
          id="party-type"
          label="Party Type"
          value={formData.Party_Type_TCPD}
          onChange={(e) => handleInputChange('Party_Type_TCPD', e.target.value)}
        >
          <MenuItem value="independents">Independent</MenuItem>
          <MenuItem value="local party">Local Party</MenuItem>
          <MenuItem value="national party">National Party</MenuItem>
          <MenuItem value="state-based party">State-based Party</MenuItem>
          <MenuItem value="state-based party (other state)">State-based Party (Other State)</MenuItem>
        </Select>
      </FormControl>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Predicting...' : 'Predict Winner'}
        </Button>
      </Box>

      {prediction !== null && (
        <Box>
          <Button>
            The candidate is predicted to {prediction.prediction ? 'win' : 'lose'} the election. <br></br>
            Win Probability: {prediction.win_probability * 100} %
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PredictionForm;