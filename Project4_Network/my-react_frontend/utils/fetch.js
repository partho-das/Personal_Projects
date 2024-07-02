import axiosInstance from "@/components/axiosInstance";

export const fetchData = async () => {
  try {
    let accessToken = localStorage.getItem("access");
    console.log(accessToken);
    const response = await axiosInstance.get("user/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data);
    // Handle response data as needed
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle error
  }
};
