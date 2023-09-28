import React from 'react';

function ReportButton() {
    const downloadReport = () => {
        window.open('http://localhost:3001/generateCustomerReport', '_blank'); 
    };

    return (
        <button onClick={downloadReport}>Download Report</button>
    );
}

export default ReportButton;
