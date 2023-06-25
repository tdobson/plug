import React, { useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRow, setGridData } from './actions.jsx';

const Data = ({ product_id }) => {
  const dispatch = useDispatch();
  const rowData = useSelector((state) => state.gridData);

  const columnDefs = useMemo(
      () => [
        { field: 'first_name', headerName: 'First Name' },
        { field: 'last_name', headerName: 'Last Name' },
        { field: 'stats_attendance_attended_cached', headerName: 'First Time?' },
        { field: 'skills-belaying', headerName: 'Skills Belaying' },
        { field: 'scores_attendance_reliability_score_cached', headerName: 'Reliability' },
        { field: 'cc_attendance', headerName: 'CC Attendance' },
        { field: 'cc_volunteer', headerName: 'CC Volunteer' },
        { field: 'cc_volunteer_attendance', headerName: 'CC Volunteer Attendance' },
        {
          field: 'actions',
          headerName: 'Actions',
          cellRendererFramework: (params) => (
              <button onClick={() => handleRowClick(params.data)}>Check In</button>
          ),
        },
      ],
      []
  );

  const defaultColDef = useMemo(
      () => ({
        sortable: true,
      }),
      []
  );

  const fetchData = async () => {
    try {
      if (rowData.length > 0) {
        return rowData;
      }

      const response = await fetch(
          `https://www.climbingclan.com/wp-json/wc-api/v1/products/purchased/${product_id}`
      );
      const userOrderIDs = await response.json();

      const allUserOrderIDsExist = userOrderIDs.every((id) =>
          rowData.some((row) => row.user_id === id)
      );

      if (!allUserOrderIDsExist) {
        const newRows = await fetchDetailsForMissingUserOrderIDs(userOrderIDs);
        dispatch(setGridData([...rowData, ...newRows]));
      }

      return rowData;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDetailsForMissingUserOrderIDs = async (userOrderIDs) => {
    const userOrderMeta = {
      product_id,
      user_order_ids: userOrderIDs,
      user_meta_keys: [
        'last_name',
        'stats_attendance_attended_cached',
        'skills-belaying',
        'first_name',
        'scores_attendance_reliability_score_cached',
        'scores_volunteer_reliability_score_cached',
        'scores_volunteer_value_cached',
        'admin-can-you-help',
        'nickname',
        'climbing-indoors-leading-grades',
        'climbing-indoors-toproping-grades',
        'climbing-indoors-skills-passing-on',
      ],
      order_meta_keys: ['cc_attendance', 'cc_volunteer', 'cc_volunteer_attendance'],
    };

    const postResponse = await fetch(`https://www.climbingclan.com/wp-json/wp-api/v1/user-order-meta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userOrderMeta),
    });

    const result = await postResponse.json();
    const newRows = flattenData(result);
    return newRows;
  };

  const flattenData = (result) => {
    const flattenedData = Object.entries(result).map(([user_id, data]) => {
      return {
        user_id,
        ...data.user_meta,
        ...data.order_meta,
      };
    });
    return flattenedData;
  };

  useEffect(() => {
    fetchData();
  }, [product_id]);

  const handleRowClick = (rowData) => {
    dispatch(setSelectedRow(rowData));
  };

  return (
      <div className="ag-theme-alpine" style={{ width: 1000, height: 500 }}>
        <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            rowSelection="multiple"
        />
      </div>
  );
};

export default Data;
