import axiosInstance from "@/components/axiosInstance";

export const postData = async () => {
  console.log("HI");
  try {
    const response = await axiosInstance.post("login/", {
      username: "admin",
      password: "1234",
    });
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.access);

    // Handle response data as needed
  } catch (error) {
    console.error("Error posting data:", error);
    // Handle error
  }
};
