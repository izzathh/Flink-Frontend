import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  Modal,
} from "@mui/material";
import React from "react";

function ImageViewDialog({
  imgSrc,
  itemDescription,
  open,
  handleClose,
}: {
  imgSrc: string;
  itemDescription: string;
  open: boolean;
  handleClose: () => void;
}) {
  return (
    // <Modal
    //   open={open}
    //   onClose={handleClose}
    //   aria-labelledby="modal-modal-title"
    //   aria-describedby="modal-modal-description"
    // >
    <Dialog open={open} onClose={handleClose} scroll={"paper"}>
      <DialogTitle>Item Photo</DialogTitle>
      <Box>
        <img
          src={imgSrc}
          alt="item"
          style={{ width: "100%", height: "100%", objectFit: "contain", padding: "10px" }}
        />
      </Box>
      <DialogContentText
        style={{ padding: "10px" }}
      >
        <label htmlFor="DialogContentText" style={{ fontWeight: "600" }}>Description: </label>
        {itemDescription}
      </DialogContentText>
      <DialogActions>
        <Button onClick={handleClose}>close</Button>
      </DialogActions>
    </Dialog>
    // </Modal>
  );
}

export default ImageViewDialog;
