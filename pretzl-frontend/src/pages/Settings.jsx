import React, { useState } from "react";
import BodyWrapper from "../components/BodyWrapper";
import ResponsiveTop from "../components/ResponsiveTop";
import Notific from "../components/Settings/Notific";
import Plan from "../components/Settings/Plan";
import Profile from "../components/Settings/Profile";
import Security from "../components/Settings/Security";
import SettingHeader from "../components/Settings/SettingHeader";
import "../Styling/settings.css";

function Settings() {
  const [active, setActive] = useState("profile");

  const handleClick = (e) => {
    console.log(e.target.name);
    setActive(e.target.name);
  };
  return (
    <BodyWrapper>
      <div className="setMain">
        {/* <SettingHeader /> */}
        <div className="setCont  font-Poppins">
          {active == "profile" && <Profile handleClick={handleClick} />}
          {active == "security" && <Security handleClick={handleClick} />}
          {active == "plan" && <Plan handleClick={handleClick} />}
          {active == "notification" && <Notific handleClick={handleClick} />}
        </div>
      </div>
    </BodyWrapper>
  );
}

export default Settings;