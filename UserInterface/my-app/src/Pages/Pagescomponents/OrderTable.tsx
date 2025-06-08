import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { DatatableWrapper, Pagination, TableBody, TableHeader } from 'react-bs-datatable';

interface GenericTableProps {
  headers: {
    prop: string; // Property name to map to the data
    title: string; // Header display title
    isFilterable?: boolean; // Whether the column is filterable
    cell?: (row: any) => JSX.Element; // Custom cell renderer
  }[];
  data: any[]; // Array of data objects to populate the table
}

const GenericTable: React.FC<GenericTableProps> = ({ headers, data }) => {
  return (
    <DatatableWrapper
      body={data}
      headers={headers}
      paginationOptionsProps={{
        initialState: {
          rowsPerPage: 20,
          options: [5, 10, 15, 20],
        },
      }}
    >
      <Row className="mb-4 p-2">
        <Col xs={12} lg={8} className="d-flex justify-content-end">
          {/* Optional content for future use */}
        </Col>
        <Col xs={12} lg={4} className="d-flex justify-content-end">
          {/* Replace <Filter /> with your actual filter component */}
          <div>Filter Component</div>
        </Col>
      </Row>
      <Table striped bordered hover>
        <TableHeader />
        <TableBody />
      </Table>
      <Row className="mb-4 p-2">
        <Col xs={12} sm={6} lg={12} className="d-flex justify-content-end">
          <Pagination
            alwaysShowPagination
            paginationRange={10}
            labels={{
              firstPage: 'First',
              lastPage: 'Last',
            }}
          />
        </Col>
      </Row>
    </DatatableWrapper>
  );
};

export default GenericTable;

