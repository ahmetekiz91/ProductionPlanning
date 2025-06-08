import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Row, Col, Table, Pagination, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface AjaxDataTableProps {
  children: React.ReactNode;
}

const AjaxDataTable = forwardRef((props: AjaxDataTableProps, ref) =>  {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Element[]>([]);
  const [filteredData, setFilteredData] = useState<Element[]>([]);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Rows per page
  const maxPageButtons = 5; // Max visible page buttons

  const fillobject = () => {
    if (tableRef.current) {
   
      const tableElement = tableRef.current.querySelector("table") as HTMLTableElement | null;
  
      if (tableElement) {
        const thElements = tableElement.querySelectorAll("thead th");
        const headers = Array.from(thElements).map((th) => th.textContent || "");
        setTableHeaders(headers);
  
        const rows = tableElement.querySelectorAll("tbody tr");
        const data = Array.from(rows);
  
        setTableData(data);
        setFilteredData(data);
  
        if (tableElement.parentNode) {
          tableElement.remove(); // Ensure no duplicate removal
        }
      }
    }
  };
  

  // Expose the `fillobject` method to the parent via `ref`
  useImperativeHandle(ref, () => ({
    loadTableData: fillobject,
  }));

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value.toLowerCase();
    setFilterText(searchText);

    const filtered = tableData.filter((row) => {
      const rowText = Array.from(row.children)
        .map((cell) => cell.textContent?.toLowerCase() || "")
        .join(" ");
      return rowText.includes(searchText);
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  return (
    <div>
      <Row className="mb-4">
        <Col md={6}></Col>
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search..."
            value={filterText}
            onChange={handleFilterChange}
          />
        </Col>
      </Row>

      <div ref={tableRef}>{props.children}</div>

      <Table striped bordered hover>
        <thead>
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
  {filteredData.map((row, index) => {
    const isVisible =
      index >= (currentPage - 1) * rowsPerPage &&
      index < currentPage * rowsPerPage;
    return (
      <tr
        key={`row-${index}`}
        style={{ display: isVisible ? "table-row" : "none" }}
      >
        {Array.from(row.children).map((cell, cellIndex) => (
          <td
            key={`cell-${index}-${cellIndex}`}
            dangerouslySetInnerHTML={{ __html: cell.innerHTML }}
          />
        ))}
      </tr>
    );
  })}
</tbody>

      </Table>

      <Row className="mb-4 p-2">
        <Col xs={12} className="d-flex justify-content-center">
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {visiblePages.map((page) => (
              <Pagination.Item
                key={page}
                active={currentPage === page}
                onClick={() => handlePageChange(page)}
              >
                {page}
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
        </Col>
      </Row>
    </div>
  );
});

export default AjaxDataTable;
