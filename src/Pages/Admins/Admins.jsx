// Main component file: Admins.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Tooltip
} from "@mui/material";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminsHeader from "../../Components/AdminsHeader/AdminsHeader";
import DeleteConfirmDialog from "../../Components/DeleteConfirmDialog/DeleteConfirmDialog";
import AdminsToolbar from "../../Components/AdminsToolbar/AdminsToolbar";
import AddAdminDialog from "../../Components/AddAdminDialog/AddAdminDialog";
import { Context } from "../../context/AuthContext";
const Admins = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState([]);
  const { token, baseUrl } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);



  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/dashboard/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res?.data);
      setError(null);
    } catch (err) {
        console.log(err)
      setError(
        err.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Failed to load admins. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };



  const handleAddAdmin = async (adminData) => {
    try {
      await axios.post(
        `${baseUrl}/dashboard/admins`,
        adminData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOpenAddDialog(false);
      fetchAdmins(); // Refresh the admin list
    } catch (err) {
      setError("Failed to add admin. Please try again.");
    }
  };

  const deleteAdmin = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${baseUrl}/dashboard/admins/${adminToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      
      });
      setAdmins(admins.filter((admin) => admin.id !== adminToDelete.id));
      setOpenDeleteConfirm(false);
    } catch (err) {
      setError("Failed to delete admin. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter admins based on search term
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.id?.toString().includes(searchTerm)
  );

  // Get paginated admins
  const paginatedAdmins = filteredAdmins.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    fetchAdmins();
  }, [token, baseUrl]);
  return (
    <Box className="admins-container" sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <AdminsHeader onAddAdmin={() => setOpenAddDialog(true)} />
      
      <AdminsToolbar setSearchTerm={setSearchTerm} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredAdmins.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No admins found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or add a new admin.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => setOpenAddDialog(true)}
          >
            Add New Admin
          </Button>
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAdmins?.map((admin) => (
                  <TableRow hover key={admin.id}>
                    <TableCell>{admin.id}</TableCell>
                    <TableCell>{admin.username}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell align="right">
                      {/* <Tooltip title="Edit Admin">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setOpenAddDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip> */}
                      <Tooltip title="Delete Admin">
                        <IconButton
                          color="error"
                          onClick={() => {
                            setAdminToDelete(admin);
                            setOpenDeleteConfirm(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAdmins.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      <AddAdminDialog
        open={openAddDialog}
        admin={selectedAdmin}
        onClose={() => {
          setOpenAddDialog(false);
          setSelectedAdmin(null);
        }}
        onSubmit={handleAddAdmin}
      />

      <DeleteConfirmDialog
        open={openDeleteConfirm}
        deleting={deleting}
        onClose={() => setOpenDeleteConfirm(false)}
        onDelete={deleteAdmin}
        message={"Are you sure you want to delete this admin?"}
      />
    </Box>
  );
};

export default Admins;