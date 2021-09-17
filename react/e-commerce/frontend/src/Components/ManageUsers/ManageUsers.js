import React, { useState, useEffect } from 'react';

import { DataGrid } from '@material-ui/data-grid';

import axios from '../../axios';

function ManageUsers() {
  const [user, setUser] = useState([]);

  const [select, setSelection] = useState([]);
  const list = [];
  const getUser = async () => {
    const res = await axios.get('/user/all');
    setUser(res.data);
  };

  useEffect(() => {
    getUser();
  }, []);
  user.map((user) => {
    list.push({
      id: user.user_id,

      col2: user.user_username,
      col3: user.user_email,
      col4: user.user_role,
      col5: user.gender,
      col6: user.phoneNumber,
      col7: user.birthDate,
    });
  });
  console.log(list);
  const row = { list };

  const columns = [
    { field: 'id', headerName: 'user Id', width: 200 },
    { field: 'col2', headerName: 'username', width: 200 },
    { field: 'col3', headerName: 'user email', width: 200 },
    { field: 'col4', headerName: 'user role', width: 200 },
    { field: 'col5', headerName: 'gender', width: 200 },
    { field: 'col6', headerName: 'phone number', width: 200 },
    { field: 'col7', headerName: 'birth date', width: 200 },
  ];

  return (
    <div style={{ height: 400, width: '100%', paddingTop: '20vh' }}>
      <DataGrid
        rows={list}
        columns={columns}
        autoHeight="true"
        checkboxSelection
        onSelectionChange={(newSelection) => {
          setSelection(newSelection.rows);
        }}
      />
      {select}
    </div>
  );
}

export default ManageUsers;
