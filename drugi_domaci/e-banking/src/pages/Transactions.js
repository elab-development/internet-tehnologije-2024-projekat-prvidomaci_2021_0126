import React from 'react'
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import { useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';

function Transactions({transactions}) {

    const [filters, setFilters] = useState({
        global:{value:null, matchMode: FilterMatchMode.CONTAINS},
    });

  return (
    <div>

        <InputText onInput={(e) => setFilters({
            global: {value: e.target.value, matchMode: FilterMatchMode.CONTAINS},
        })}
        
        />

        <DataTable value={transactions} sortMode='multiple' filters={filters} 
        paginator rows={10} rowsPerPageOptions={[5,10,20,50]} >
            <Column field="id" header="ID" sortable/>
            <Column field="transactionId" header="Transaction Number" sortable/>
            <Column field="recipient" header="Recipient" sortable/>
            <Column field="dateTime" header="Date" sortable/>
            <Column field="amount" header="Amount" sortable/>
        </DataTable>

    </div>
  )
}

export default Transactions
