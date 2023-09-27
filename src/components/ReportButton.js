import React from 'react';

function ReportButton() {
    const downloadReport = () => {
        window.open('http://localhost:3001/generateCustomerReport', '_blank');  // Adjust the URL if your backend is on a different address or port
    };

    return (
        <button onClick={downloadReport}>Download Report</button>
    );
}

export default ReportButton;
