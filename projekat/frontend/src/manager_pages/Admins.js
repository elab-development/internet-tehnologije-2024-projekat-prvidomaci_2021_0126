import React,{useState, useEffect} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import '../style/Transactions.css'; 
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';


function Admins({}) {
    const[admins, setAdmins] = useState([]);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    //fetch admin data
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const authToken = window.sessionStorage.getItem('auth_token');
                const response = await axios.get('api/admins', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setAdmins(response.data);
                console.log(JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching admin data:', error);
            }
        };

        fetchAdmins();
    }, []);

    const handleDelete = async (adminId) => {
        try {
            const authToken = window.sessionStorage.getItem('auth_token');
            await axios.delete(`api/admins/${adminId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== adminId));
            console.log('Admin deleted successfully');
        } catch (error) {
            console.error('Error deleting admin:', error);
        }
    };

    const deleteButtonTemplate = (rowData) => {
        return (
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-outlined p-button-sm-custom"
                tooltip="Delete Admin"
                tooltipOptions={{ position: 'right' }}
                onClick={() => handleDelete(rowData.id)}
            />
        );
    };    

    return (

        <div className="transactions-container">

          
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
                        placeholder="Search admins..."
                    />
                </div>


            <DataTable
                value={admins}
                sortMode="multiple"
                filters={filters}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 20, 50]}
                sortField="id"
                sortOrder={1}
                className="transactions-table"
            >
                <Column field="id" header="ID" sortable />
                <Column field="name" header="Name" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="created_at" header="Created At" sortable />
                <Column field="updated_at" header="Updated At" sortable />
                <Column header="Manage" body={deleteButtonTemplate}/>
            </DataTable>
        </div>
    );
}

export default Admins;