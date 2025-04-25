  import axios from "axios";

  const useImageUploader = (baseUrl, token) => {
    const uploadImage = async (image) => {
      if (!image) return null;

      const formData = new FormData();
      formData.append('file', image);

      try {
        const res = await axios.post(`${baseUrl}/upload/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });

        return res.data?.filePath || res.data?.filename || null;
      } catch (err) {
        console.error("Image upload failed:", err);
        return null;
      }
    };

    return uploadImage;
  };

  export default useImageUploader;
