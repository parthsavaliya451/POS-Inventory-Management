import React from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, IconButton, Paper, TableContainer,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SectionTable({ sections, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Section Name</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sections.map((section) => (
            <TableRow key={section.id}>
              <TableCell>{section.sectionname}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(section)} color="primary" size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(section.id)} color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {sections.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} align="center">
                No sections found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
