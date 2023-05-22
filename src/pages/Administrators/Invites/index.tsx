import React, { useReducer, useEffect } from "react";
import { Link } from "react-router-dom";
import AlertComponent from "components/AlertComponent";
import Pagination from "utilComponents/TablePagination";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { GET_ALL_INVITED_ADMINS } from "GraphQl/Queries";
import { useQuery } from "@apollo/client";
import {
  capiitalizeFirstLetter,
  extractErrorMessage,
  processAlertError,
} from "utils";
import CircularLoader from "utilComponents/Loader";
import CreateButton from "utilComponents/CreateButton";
import { Eye } from "tabler-icons-react";
import Badges from "utilComponents/Badges";

const Invites = (): JSX.Element => {
  const initialState = {
    listView: true,
    pagination: {
      rowsPerPage: 10,
      page: 0,
      totalRecords: 10,
    },
    alertMessage: {},
    activeReportComponent: 0,
    dataArr: [],
    isLoading: true,
    search: "",
  };

  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    initialState
  );
  const { isLoading, alertMessage, dataArr, search, pagination } = state;
  const { fetchMore } = useQuery(GET_ALL_INVITED_ADMINS, {
    variables: {
      page: 0,
      limit: 10,
      query: search,
    },
  });

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ): void => {
    const newPagination = {
      ...pagination,
      page: newPage,
    };
    setState({
      page: newPage,
    });
    fetchData(newPagination);
  };

  const handleChangeRowsPerPage = (event: any): void => {
    const newPagination = {
      ...pagination,
      rowsPerPage: event?.target?.value,
    };
    setState({
      rowsPerPage: event?.target?.value,
    });
    fetchData(newPagination);
  };
  const handleAlertClose = () => {
    setState({
      alertMessage: {},
    });
  };

  const fetchData = async (paginationArgs = pagination) => {
    setState({
      isLoading: true,
    });
    const searchItem = search ?? " ";
    const apiData: any = await fetchMore({
      variables: {
        query: searchItem,
        page: paginationArgs?.page + 1,
        limit: paginationArgs?.rowsPerPage,
      },
    });

    if (apiData.data) {
      setState({
        dataArr: apiData?.data?.getAllInvitedAdmin?.docs,
        pagination: {
          rowsPerPage: apiData?.data?.getAllAdmin?.limit,
          page: apiData?.data?.getAllAdmin?.page - 1,
          totalRecords: apiData?.data?.getAllAdmin?.totalDocs,
        },
      });
    }

    if (!apiData.loading) {
      setState({
        isLoading: false,
      });
    }

    if (apiData.error) {
      setState({
        alertMessage: processAlertError(extractErrorMessage(apiData?.error)),
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    fetchData();
    // Cleanup method
    return () => {
      setState({
        ...initialState,
      });
    };
  }, []);

  return (
    <>
      {alertMessage?.text && (
        <div className=" px-2 pt-2">
          <AlertComponent
            text={alertMessage.text}
            type={alertMessage.type}
            onClose={handleAlertClose}
          />
        </div>
      )}

      {isLoading ? (
        <>
          <CircularLoader />
        </>
      ) : (
        <div className="">
          <div className=" py-3 ">
            <div
              className={`col-md-12 bg-white d-flex justify-content-between px-0 `}
            ></div>
            <div className="py-3 px-2 w-100 ">
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 300 }}
                  aria-label="simple table"
                  // className="table mt-4"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell className="table-th">#SN</TableCell>
                      <TableCell align="left" className="table-th">
                        Full Name
                      </TableCell>
                      <TableCell align="left" className="table-th">
                        Email
                      </TableCell>
                      <TableCell align="left" className="table-th">
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataArr.map((row: any, index: number) => {
                      return (
                        <TableRow
                          //   key={row.name}
                          sx={{
                            "&:last-child TableCell, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            {capiitalizeFirstLetter(row.full_name ?? "N/A")}
                          </TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>
                            {row.full_name ? (
                              <Badges type="success" text={"Accepted"} />
                            ) : (
                              <Badges type="pending" text={"Pending"} />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Pagination
                count={dataArr.length ?? 0}
                page={0}
                rowsPerPage={10}
                onPageChange={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Invites;
