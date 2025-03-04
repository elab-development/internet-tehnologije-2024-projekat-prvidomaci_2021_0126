import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import '../style/Transactions.css'; // Import the CSS file

function Transactions({ transactions }) {
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        amount_in_usd: { value: 0, matchMode: FilterMatchMode.GREATER_THAN },
    });

    const sortedTransactions = [...transactions].sort((a, b) => a.id - b.id);

    return (

        <div className="transactions-container">

            <div className="filter-section">
                <div className="filter-group">
                    <label className="filter-label">Minimum USD amount:</label>
                    <InputNumber
                        value={filters.amount_in_usd.value}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                amount_in_usd: { value: e.value, matchMode: FilterMatchMode.GREATER_THAN },
                            })
                        }
                        className="filter-input"
                    />
                </div>

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
                    />
                </div>

                <button
                    onClick={() =>
                        setFilters({
                            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                            amount_in_usd: { value: null, matchMode: FilterMatchMode.GREATER_THAN },
                        })
                    }
                    className="reset-button"
                >
                    Reset Filters
                </button>
            </div>

            <DataTable
                removableSort
                value={sortedTransactions}
                sortMode="multiple"
                filters={filters}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 20, 50]}
                sortField="id"
                sortOrder={1}
                className="transactions-table"
            >
                <Column field="transaction_number" header="Transaction Number" sortable />
                <Column field="amount_in_usd" header="Subtracted" sortable />
                <Column field="recipient_name" header="Recipient" sortable />
                <Column field="recipient_account" header="Recipient Account" sortable />
                <Column field="created_at" header="Date" sortable />
                <Column field="amount" header="Amount" sortable />
                <Column field="currency" header="Currency" sortable />
                <Column field="status" header="Status" sortable />
            </DataTable>
        </div>
    );
}

export default Transactions;