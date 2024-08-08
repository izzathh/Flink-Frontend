import { TokenConfig, baseUrl, useAppData } from "./../context/AppContext";
import axios from "axios";

interface IBody {
  contentType: string;
  fileName: string;
  uploadType: string;
}

const { tabIdentifier } = useAppData();

export const getSignedUrl = async (body: IBody) => {
  try {
    const response = await axios.post(
      `${baseUrl}/uploads/get-signed-url`,
      body,
      TokenConfig(tabIdentifier)
    );
    if (response?.data) {
      return response.data;
    }
  } catch (error) {
    console.log("getSignedUrl error", error);
    throw error;
  }
};

export const uploadFileToS3 = async (url: string, file: File) => {
  console.log("url", url);

  try {
    const { data } = await axios({
      method: "put",
      url,
      headers: {
        "Content-Type": file.type,
      },
      // converting from blob to binary form
      data: await file.arrayBuffer(),
    });
    console.log("data in uplaod to s3", data);
  } catch (error) {
    console.log("uploadFileToS3 error", error);
    throw error;
  }
};

export const mediaUploadHandler = async (file: File, uploadType = "") => {
  try {
    const body = {
      fileName: file.name,
      uploadType,
      contentType: file.type,
    };
    const signedUrlData = await getSignedUrl(body);
    console.log("signedUrlData", signedUrlData);

    if (signedUrlData?.url) {
      await uploadFileToS3(signedUrlData.url, file);
      return signedUrlData.fileKey;
    }
  } catch (error) {
    console.log("mediaUploadHandler error", error);
    throw error;
  }
};
