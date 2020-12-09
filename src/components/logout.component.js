import React from "react";

function Logout(){
    localStorage.removeItem('token');
    window.location = "./signin";
}

export default Logout;