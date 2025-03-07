import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import axios from 'axios';
import '../style/Transactions.css'; 
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

function Users({ users, setUsers }) {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const navigate = useNavigate();

  const handleDelete = async (userId) => {
    try {
      const authToken = window.sessionStorage.getItem('auth_token');
      await axios.delete(`api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleRowClick = (event) => {
    const userId = event.data.id; 
    navigate(`/users/${userId}`);
  };

  const deleteButtonTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger p-button-outlined p-button-sm-custom"
        tooltip="Delete User"
        tooltipOptions={{ position: 'right' }}
        onClick={() => handleDelete(rowData.id)}
      />
    );
  };

  return (
    <div className="transactions-container1">
      <div className="filter-group">
        <label className="filter-label">Search:</label>
        <InputText
          value={filters.global.value || ''}
          onInput={(e) =>
            setFilters({
              ...filters,
              global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
            })
          }
          className="filter-input"
          placeholder="Search users..."
        />
      </div>

      <DataTable
        value={users}
        sortMode="multiple"
        filters={filters}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 20, 50]}
        sortField="id"
        sortOrder={1}
        onRowClick={handleRowClick}
        selectionMode="single" // enable single row selection
        className="transactions-table"
      >
        <Column field="id" header="ID" sortable />
        <Column field="name" header="Name" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="created_at" header="Created At" sortable />
        <Column field="updated_at" header="Updated At" sortable />
        <Column field="gender" header="Gender" sortable />
        <Column field="work_status" header="Work Status" sortable />
        <Column field="country" header="Country" sortable />
        <Column field="phone_number" header="Phone Number" sortable />
        <Column header="Manage" body={deleteButtonTemplate} />
      </DataTable>
    </div>
  );
}

export default Users;