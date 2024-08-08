import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { useAppData } from "../../context/AppContext";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { routesMappingData } from "../../constants";
import { Link } from "react-router-dom";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function Layout({ children }: { children: React.ReactNode }) {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { state, dispatch } = useAppData();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    confirm({
      title: "Logout ?",
      description: "Are you sure you want to logout ?",
      confirmationText: "Yes",
      cancellationText: "Cancel",
    })
      .then(() => {
        dispatch({ type: "LOGOUT_USER" });
        handleDrawerClose();
        enqueueSnackbar("logged out successfully", {
          variant: "success",
        });
      })
      .catch(() => { });
  };

  const handleChangePassword = () => {
    setAnchorEl(null);
    navigate("/change-password");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          {state?.routes && state?.routes.length > 0 && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, cursor: "pointer" }}
          // onClick={() => navigate("/")}
          >
            {/* My Store */}
          </Typography>

          {state.isAuthenticated && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle fontSize="large" />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={handleChangePassword}>
                  Change Password
                </MenuItem>
                {sessionStorage.getItem("userAuthenticated") == null && (
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                )}
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>

        <Divider sx={{ backgroundColor: "#fff" }} />
        <List>
          {state?.routes?.map((data, index) => (
            <Box key={index}>
              <Link
                to={data.route}
                style={{ color: "#000", textDecoration: "none" }}
              >
                <ListItem>
                  <ListItemButton
                    selected={window.location.pathname === data.route}
                    onClick={handleDrawerClose}
                  >
                    <ListItemText primary={data.label} />
                  </ListItemButton>
                </ListItem>
              </Link>
            </Box>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}

export default Layout;
