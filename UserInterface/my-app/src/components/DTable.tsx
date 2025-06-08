import React from "react";
import { Button, Row, Col, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableColumnType,
  TableHeader,

} from "react-bs-datatable";

type ArrayElementType = {
  [key: string]: any;
  button: any;
};

interface DataTableProps {
  data: any[];
  headers: { prop: any, title: string, isFilterable?: boolean, cell?: (row: any) => JSX.Element }[];
  onDelete: (id: number) => void;
  onEdit?: (row: any) => void;
}

const DTable: React.FC<DataTableProps> = ({ data, headers, onDelete, onEdit }) => {
   // Map through intents to add the onDeleteIntent function to each row
   const tableBody = data.map((intent) => ({
    ...intent,
    onDelete,
    onEdit
  }));
  return (


<DatatableWrapper
      body={tableBody}
      headers={headers}
      paginationOptionsProps={{
        initialState: {
          rowsPerPage: 20,
          options: [5, 10, 15, 20],
          
        }
      }}
    >
   <Row className="mb-4 p-2">
        <Col xs={12}  lg={8} className="d-flex flex-col justify-content-end align-items-end">
    
        </Col>
        <Col xs={12}  lg={4} className="d-flex flex-col justify-content-end align-items-end">
          <Filter />
        </Col>

      </Row>
      <Table striped bordered hover>
        <TableHeader />
        <TableBody />
      </Table>
      <Row className="mb-4 p-2">
        <Col xs={12} sm={6} lg={12} className="d-flex flex-col justify-content-end align-items-end">
     
          <Pagination
           alwaysShowPagination paginationRange={10}
            labels={{
              firstPage: "First",
              lastPage: "Last",
              
            }}
          />
        </Col>
      </Row>
    </DatatableWrapper>


  );
};

export default DTable;
