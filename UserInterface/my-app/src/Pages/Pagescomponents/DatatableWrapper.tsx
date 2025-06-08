import React, { useState, useEffect } from "react";
import { Table, Pagination, Form } from "react-bootstrap";

interface DatatableWrapperProps {
  data: any[]; // Data to display
  columns: { key: string; label: string; render?: (row: any) => React.ReactNode }[]; // Column definitions with optional render function
  onUpdate?: (updatedData: any[]) => void; // Callback for when data updates
}

const DatatableWrapper: React.FC<DatatableWrapperProps> = ({ data, columns, onUpdate }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const rowsPerPage = 5; // Number of rows per page

  useEffect(() => {
    const filtered = data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(filterText.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  }, [data, filterText]);

  const handleInputChange = (rowIndex: number, key: string, value: any) => {
    const updatedData = [...filteredData];
    updatedData[rowIndex][key] = value;
    setFilteredData(updatedData);
    if (onUpdate) {
      onUpdate(updatedData);
    }
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Form.Control
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="mb-3"
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? (
                    col.render({
                      value: row[col.key],
                      rowIndex,
                      onChange: (value: any) => handleInputChange(rowIndex, col.key, value),
                    })
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={currentPage === index + 1}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default DatatableWrapper;
