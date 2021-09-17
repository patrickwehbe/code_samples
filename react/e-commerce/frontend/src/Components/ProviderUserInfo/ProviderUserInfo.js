import React, { useEffect, useState } from "react";
import axios from "../../axios";

function ProviderUserInfo() {
  const user_id = JSON.parse(localStorage.getItem("uu"));
  const [username, setUsername] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");

  const getUserInfo = async () => {
    const res = await axios.get(`/user/profile/getuserbyid?user_id=${user_id}`);
    const data = res.data;
    setUsername(data.user_username);
    setPhoneNum(data.phoneNumber);
    setEmail(data.user_email);
    setGender(data.gender);
  };

  useEffect(async () => {
    await getUserInfo();
    localStorage.removeItem("uu");
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginTop: "20vh",
        }}
      >
        <p style={{ fontSize: "25px", margin: "0px" }}>Username: </p>
        <p style={{ fontSize: "18px" }}>{username}</p>
        <p style={{ fontSize: "25px", margin: "0px" }}>phone Number: </p>
        <p style={{ fontSize: "18px" }}>{phoneNum}</p>
        <p style={{ fontSize: "25px", margin: "0px" }}>Email: </p>
        <p style={{ fontSize: "18px" }}>{email}</p>
      </div>
    </div>
  );
}

export default ProviderUserInfo;
