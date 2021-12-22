import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './loader.scss';
export default function CircularLoader() {
  return (
    <div className="loader">
        <Box sx={{ display: 'flex' }}>
            <CircularProgress 
                size={70}
                thickness={5}
            />
        </Box>
    </div>
  );
};