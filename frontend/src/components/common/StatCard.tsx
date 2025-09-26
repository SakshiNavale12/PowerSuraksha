import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface StyledProps { $bgColor: string }

const StyledPaper = styled(Paper)(({ theme, $bgColor }: { theme: any; $bgColor: string }) => ({
  padding: theme.spacing(2),
  background: `linear-gradient(145deg, ${$bgColor}10, ${$bgColor}1A)`,
  borderRadius: '14px',
  textAlign: 'center',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 16px 40px rgba(0,0,0,0.10)'
  }
}));

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, bgColor }) => {
  return (
    <StyledPaper $bgColor={bgColor}>
      <Box sx={{ fontSize: 40, color: bgColor, mb: 1 }}>
        {icon}
      </Box>
      <Typography variant="h6">{value}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </StyledPaper>
  );
};

export default StatCard;
