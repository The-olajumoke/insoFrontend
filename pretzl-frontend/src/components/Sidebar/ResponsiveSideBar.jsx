import React, { useState } from "react";
import NavItem from "./NavItem";
import { FiBarChart } from "react-icons/fi";
import { MdShowChart } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import downloadImg from "../../Exports/downloadimg.svg";
import { MdHeadsetMic} from "react-icons/md";
import { FaRegCalendar } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdChatBubbleOutline } from "react-icons/md";
// import avatar from "../"
function ResponsiveSideBar({ navSize }) {
  return (
    <nav className="responNav">
      <div
        className={`userDetailsCont    ${
          navSize === "small" ? "justify-end" : "justify-center"
        }    ${navSize === "small" ? "pr-3" : ""}  `}
      >
        {/* <img className={`user-img`} src={avatar} alt="" /> */}
        <div className={`details ${navSize === "small" ? "hidden" : "flex"} `}>
          <h3>Patrick Dempsey</h3>
          <span>@patrick</span>
        </div>
      </div>

      <div className=" allNavItems">
        <NavItem
          navSize={navSize}
          title="Discussions"
          icon={<MdChatBubbleOutline />}
          path="/discussions"
          active
        />
        <NavItem
          navSize={navSize}
          title="Nofications"
          icon={<IoMdNotificationsOutline />}
          path="/notifications"
        />
        <NavItem
          navSize={navSize}
          title="Analytics"
          icon={<MdChatBubbleOutline />}
          path="/analytics"
          active
        />

        <NavItem
          navSize={navSize}
          title="Charts "
          icon={<FiBarChart />}
          path="/charts"
        />
        <NavItem
          navSize={navSize}
          title="Calendar"
          icon={<FaRegCalendar />}
          path="/calendar"
        />
        <NavItem
          navSize={navSize}
          title="Grades"
          icon={<MdShowChart />}
          path="/grades"
        />
        <NavItem
          navSize={navSize}
          title="Contact us"
          icon={<MdHeadsetMic />}
          path="/contact"
        />
        <NavItem
          navSize={navSize}
          title="Settings"
          icon={<IoSettingsOutline />}
          path="/settings"
        />
      </div>
      <div
        className={`  mt-10 mb-2  w-full flex  
         ${navSize == "small" ? "" : "px-12"}
            ${navSize == "small" ? "pr-3" : ""}
    ${navSize == "small" ? "justify-end" : "justify-items-start"}`}
      >
        <button
          className={` upgradeBtn  ${navSize == "small" ? "p-3" : "p-3"}`}
          style={{ width: `${navSize == "small" ? "auto" : "230px"}` }}
        >
          {/* <NavIcon
                className={`nav-icon ${navSize == "small" ? "" : "mr-4"}
            
            `}
                icon={<FaRegCalendar />}
              /> */}
          <img src={downloadImg} alt="" />
          <h3
            className={` ${navSize == "small" ? "hidden" : "flex"}
          `}
          >
            Upgrade
          </h3>
        </button>
      </div>
    </nav>
  );
}

export default ResponsiveSideBar;
