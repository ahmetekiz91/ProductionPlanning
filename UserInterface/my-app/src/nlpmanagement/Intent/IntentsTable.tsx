import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Row, Col, Table } from "react-bootstrap";
import './intent.css'
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableColumnType,
  TableHeader
} from "react-bs-datatable";


// Define the structure of each row with an index signature for additional properties.
type ArrayElementType = {
  ID: number; // Ensure ID is included for deleting intents
  IntentName: string;
  [key: string]: any; // This allows any additional properties
};

type IntentsTableProps = {
  intents: ArrayElementType[];
  onDeleteIntent: (intentId: number) => void;
};

// Create table headers consisting of columns for the intents.
const STORY_HEADERS: TableColumnType<ArrayElementType>[] = [
  {
    prop: "ID",
    title: "ID",
    isFilterable: true
  },
  {
    prop: "IntentName",
    title: "Intent Name",
    isFilterable: true
  },
  {
    prop: "action", // Using "action" for button column
    title: "Actions",
    cell: (row) => (
      <Button variant="danger" size="sm" onClick={() => row.onDeleteIntent(row.ID)}>Delete</Button>
    )
  }
];

const IntentsTable: React.FC<IntentsTableProps> = ({ intents, onDeleteIntent }) => {
  // Map through intents to add the onDeleteIntent function to each row
  const tableBody = intents.map((intent) => ({
    ...intent,
    onDeleteIntent // Add the delete function to each row
  }));

  return (
    <DatatableWrapper
      body={tableBody} // Use the modified table body
      headers={STORY_HEADERS}
      paginationOptionsProps={{
        initialState: {
          rowsPerPage: 10,
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
        <Col xs={12} sm={6} lg={4} className="d-flex flex-col justify-content-end align-items-end">
     
          <Pagination
           alwaysShowPagination paginationRange={3}
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

export default IntentsTable;
