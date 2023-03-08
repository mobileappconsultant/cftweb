import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../../utilComponents/SearchInput/searchinput.scss";
import { Search } from "tabler-icons-react";
const SearchInp = (props: any) => {
  const handleChange = async (search: any) => {
    console.log("out");
    const requestBody = {
      query: `
        query{
          getAllGroups(query: "${search}"){
            _id
            name
            group_head
            members {
              email
              _id
              phone
              full_name
              church_group
              branch
              country
              status
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
          }
        }
        `,
    };
    const accessToken = Cookies.get("access-token");
    if (typeof accessToken !== "undefined") {
      const response = await axios.post(
        "https://admin.cftchurchesdevenvironment.xyz/graphql/",
        JSON.stringify(requestBody),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${accessToken}`,
          },
        }
      );
      if (response.data) {
        props.action({
          dataArr: response.data?.data?.getAllGroups,

          activeDataObj: response.data?.data?.getAllGroups
            ? response.data?.data?.getAllGroups[0]
            : {},
        });
      }
    }
    // ts-noignore
    // console.log(JSON.parse(token))
  };

  return (
    <div>
      {/* <input placeholder="omo" /> */}
      <div className="search-input">
        <div className="wrap">
          <form className="search">
            <input
              type="text"
              className="searchTerm"
              placeholder="Search"
              onChange={(e: any) => handleChange(e.target.value)}
            />
            <button type="submit" className="searchButton">
              <Search size={20} strokeWidth={2} color="#9CA3AF" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchInp;
